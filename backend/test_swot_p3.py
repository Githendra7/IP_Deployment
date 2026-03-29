import sys
import os
import json
from dotenv import load_dotenv

# Add current directory to path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

# Load .env
load_dotenv()

from app.ai.agents.phase3_risk import phase3_generator, RiskAnalysisList

def test_phase3_swot():
    print("Testing Phase 3 SWOT Analysis...")
    problem = "Design a low-cost mechatronic automated waste sorter."
    
    # Mock data from phase 2
    mock_morphology = {
        "mappings": [
            {
                "function": "Sense Waste Type",
                "solutions": [
                    {"principle": "Infrared Sensor", "category": "Electronic", "cost_estimate": "$2", "description": "Detects material reflection."},
                    {"principle": "Camera + AI", "category": "Industrial", "cost_estimate": "$25", "description": "Visual classification."},
                    {"principle": "Conductivity Probe", "category": "Low-Cost", "cost_estimate": "$1", "description": "Metal detection."}
                ]
            }
        ]
    }
    
    try:
        # Invoke generator
        res = phase3_generator.invoke({
            "problem_statement": problem,
            "morphological_alternatives": json.dumps(mock_morphology)
        })
        
        print("\n✅ Generation Successful!")
        print("-" * 40)
        for idx, item in enumerate(res.analysis):
            print(f"[{item.function_name} -> {item.solution_name}]")
            print("S: " + item.strength)
            print("W: " + item.weakness)
            print("O: " + item.opportunity)
            print("T: " + item.threat)
            print("-" * 40)
        
        if len(res.analysis) > 0:
            print("\n✅ All SWOT quadrant analyses populated.")
        else:
            print("\n⚠️  No analyses found.")
            
    except Exception as e:
        print(f"\n❌ Phase 3 Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_phase3_swot()
