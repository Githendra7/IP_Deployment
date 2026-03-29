import sys
import os
from dotenv import load_dotenv

# Add current directory to path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

# Load .env
load_dotenv()

from app.ai.agents.phase1_functional import phase1_generator, FunctionNode, FunctionalTree

def test_phase1_recursive():
    print("Testing Phase 1 Recursive Functional Decomposition...")
    problem = "Design a smart automated window blind system."
    
    try:
        # We use invoke with structured output
        res = phase1_generator.invoke({
            "problem_statement": problem,
            "validation_feedback": ""
        })
        
        print("\n✅ Generation Successful!")
        print(f"Root Function: {res.root_function.function}")
        
        def print_tree(node, indent=0):
            print("  " * indent + f"- {node.function}")
            for child in node.children:
                print_tree(child, indent + 1)
        
        print("\nFunctional Tree Structure:")
        print_tree(res.root_function)
        
        # Verify recursion
        has_nesting = any(len(node.children) > 0 for node in [res.root_function] + res.root_function.children)
        if has_nesting:
            print("\n✅ Recursive structure verified (found children nodes).")
        else:
            print("\n⚠️  No nesting found in this run, but it might just be a shallow decomposition.")
            
    except Exception as e:
        print(f"\n❌ Phase 1 Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_phase1_recursive()
