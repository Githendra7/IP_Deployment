from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
import json
import time

from app.ai.state import EngineeringState
from app.ai.agents.phase1_functional import phase1_generator, phase1_validator
from app.ai.agents.phase2_morphology import phase2_generator, phase2_validator
from app.ai.agents.phase3_risk import phase3_generator, phase3_validator

def route_based_on_phase(state: EngineeringState):
    phase = state.get("current_phase")
    if phase == "functional_decomposition":
        return "generate_phase1"
    elif phase == "morphological_chart":
        return "generate_phase2"
    elif phase == "risk_analysis":
        return "generate_phase3"
    return END

# --- Phase 1 Nodes ---
def generate_phase1(state: EngineeringState):
    tree = phase1_generator.invoke({
        "problem_statement": state["problem_statement"],
        "validation_feedback": state.get("validation_feedback", "")
    })
    return {"functional_tree": tree.dict(), "revision_count": 1}

def validate_phase1(state: EngineeringState):
    res = phase1_validator.invoke({"functional_tree": json.dumps(state["functional_tree"])})
    if res.is_valid:
        return {"validation_feedback": ""}
    else:
        return {"validation_feedback": res.feedback}

def check_validity_phase1(state: EngineeringState):
    if state.get("validation_feedback"):
        if state.get("revision_count", 0) >= 3:
            return END
        return "generate_phase1"
    return END

# --- Phase 2 Nodes ---
def generate_phase2(state: EngineeringState):
    chart = phase2_generator.invoke({
        "functional_tree": json.dumps(state["functional_tree"]),
        "validation_feedback": state.get("validation_feedback", "")
    })
    return {"morphological_alternatives": chart.dict(), "revision_count": 1}

def validate_phase2(state: EngineeringState):
    res = phase2_validator.invoke({"morphological_chart": json.dumps(state["morphological_alternatives"])})
    if res.is_valid:
        return {"validation_feedback": ""}
    else:
        return {"validation_feedback": res.feedback}

def check_validity_phase2(state: EngineeringState):
    if state.get("validation_feedback"):
        if state.get("revision_count", 0) >= 3:
            return END
        return "generate_phase2"
    return END

# --- Phase 3 Nodes ---
def generate_phase3(state: EngineeringState):
    print(f"[Phase 3] Generating risk analysis for: {state.get('problem_statement')}")
    try:
        # Check if morphological_alternatives even exists
        morph = state.get("morphological_alternatives")
        if not morph or not (morph.get("mappings") or morph.get("mappings") == []):
            print("[Phase 3 ERROR] morphological_alternatives is empty or missing from state.")
            return {"risk_checklist": [], "revision_count": 1}

        res = phase3_generator.invoke({
            "problem_statement": state.get("problem_statement", ""),
            "morphological_alternatives": json.dumps(morph)
        })
        
        if res and hasattr(res, 'analysis'):
            # Convert specifically to raw dict list for checkpoint compatibility
            analysis_data = [item.dict() for item in res.analysis]
            print(f"[Phase 3] Successfully generated {len(analysis_data)} alternatives.")
            return {"risk_checklist": analysis_data, "revision_count": 1}
        else:
            print("[Phase 3 WARNING] Generator returned None or malformed object.")
            return {"risk_checklist": [], "revision_count": 1}
            
    except Exception as e:
        print(f"[Phase 3 GENERATE ERROR] {str(e)}")
        import traceback
        traceback.print_exc()
        return {"risk_checklist": [], "revision_count": 1}

def validate_phase3(state: EngineeringState):
    print("[Phase 3] Validating Risk Analysis...")
    try:
        data_to_val = state.get("risk_checklist", [])
        res = phase3_validator.invoke({
            "risk_checklist": json.dumps(data_to_val)
        })
        if res.is_valid:
            print("[Phase 3] Validation PASSED.")
            return {"validation_feedback": ""}
        else:
            print(f"[Phase 3] Validation FAILED: {res.feedback}")
            return {"validation_feedback": res.feedback}
    except Exception as e:
        print(f"[Phase 3 VALIDATE ERROR] {str(e)}")
        import traceback
        traceback.print_exc()
        return {"validation_feedback": f"Validation system error: {str(e)}"}

def check_validity_phase3(state: EngineeringState):
    if state.get("validation_feedback"):
        if state.get("revision_count", 0) >= 3:
            print("[Phase 3] Max revisions reached. Ending.")
            return END
        print(f"[Phase 3] Redoing generation. Count: {state.get('revision_count')}")
        return "generate_phase3"
    return END


# --- Graph Construction ---
workflow = StateGraph(EngineeringState)

# Add nodes
workflow.add_node("generate_phase1", generate_phase1)
workflow.add_node("validate_phase1", validate_phase1)

workflow.add_node("generate_phase2", generate_phase2)
workflow.add_node("validate_phase2", validate_phase2)

workflow.add_node("generate_phase3", generate_phase3)
workflow.add_node("validate_phase3", validate_phase3)

# Add edges
workflow.add_conditional_edges(START, route_based_on_phase)

# Phase 1 loop
workflow.add_edge("generate_phase1", "validate_phase1")
workflow.add_conditional_edges("validate_phase1", check_validity_phase1, {"generate_phase1": "generate_phase1", END: END})

# Phase 2 loop
workflow.add_edge("generate_phase2", "validate_phase2")
workflow.add_conditional_edges("validate_phase2", check_validity_phase2, {"generate_phase2": "generate_phase2", END: END})

# Phase 3 loop
workflow.add_edge("generate_phase3", "validate_phase3")
workflow.add_conditional_edges("validate_phase3", check_validity_phase3, {"generate_phase3": "generate_phase3", END: END})

# Setup Memory Checkpointer
memory = MemorySaver()

# Compile graph with human-in-the-loop breakpoints (interrupt_after)
# We interrupt after validation if it's successful (returning END from condition means it reaches END of phase processing)
# We can set interrupt_after=["validate_phase1", "validate_phase2", "validate_phase3"] for breakpoints
# Actually, since these nodes conditionally go to END if valid (or max retries), we can just set interrupt_after the validate nodes.
# When the subgraph finishes, the API waits for user input before proceeding to the next phase, which is done via API calls setting the `current_phase`.
app_graph = workflow.compile(checkpointer=memory, interrupt_after=["validate_phase1", "validate_phase2", "validate_phase3"])
