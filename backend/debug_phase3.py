import os
import sys
import json
import traceback

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__))))

from app.services.phase_service import start_phase_graph
from app.core.config import supabase_client

project_id = "d43e4014-2fb6-41b3-8a72-1fe4f2b76fd4"

def debug():
    print(f"Debugging Phase 3 for Project: {project_id}")
    try:
        # Check Project
        proj = supabase_client.table("projects").select("*").eq("id", project_id).execute()
        if not proj.data:
            print("Project not found.")
            return
        
        problem_statement = proj.data[0]["problem_statement"]
        print(f"Problem Statement: {problem_statement}")

        # Check Phase 2 (Morphological Chart)
        p2 = supabase_client.table("project_phases").select("*").eq("project_id", project_id).eq("phase_name", "morphological_chart").execute()
        if not p2.data:
            print("Phase 2 (morphological_chart) not found in database.")
            return
        
        data = p2.data[0].get("human_approved_data") or p2.data[0].get("ai_generated_data")
        print(f"Phase 2 Data: {json.dumps(data, indent=2)[:500]}...")

        # Run Phase 3
        print("Running Phase 3 Graph...")
        res = start_phase_graph(project_id, "risk_analysis", problem_statement)
        print("SUCCESS!")
        print(f"Result: {json.dumps(res, indent=2)[:500]}...")

    except Exception as e:
        print(f"FAILED with error: {str(e)}")
        traceback.print_exc()

if __name__ == "__main__":
    debug()
