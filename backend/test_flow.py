import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000/api"
PROBLEM_STATEMENT = "Design a portable solar-powered water purifier for rural use."

# --- Helper to print JSON nicely ---
def print_json(data):
    print(json.dumps(data, indent=2))
    print("-" * 40)

def run_e2e_test():
    print(f"🚀 Starting E2E Test for AI Product Development Tool")
    print(f"Problem Statement: {PROBLEM_STATEMENT}\n")

    # This script now requires a valid Supabase JWT.
    # You can get one by logging into the frontend and copying the 'access_token' from the 'sb-ysvhabgvsaxehkumyztx-auth-token' cookie.
    headers = {
        "Authorization": "Bearer YOUR_REAL_JWT_HERE"
    }
    
    # NOTE: Since the current API routes enforce Supabase JWT, this test script requires you to
    # either provide a valid JWT above, or temporarily remove `Depends(get_current_user)` from `app/api/routes.py`.
    
    print("⚠️  IMPORTANT: This script requires a valid JWT in the headers to interact with the API.\n")

    # Step 1: Create Project
    print("1️⃣ Creating Project...")
    # Passing a dummy user_id if auth is bypassed in the route implementation
    # Alternatively, if auth is bypassed, the route needs to hardcode a user_id. 
    # Assuming the user bypassed auth for testing and hardcoded `current_user={"user_id": "dummy-uuid"}` in routes
    
    create_req = requests.post(
        f"{BASE_URL}/projects", 
        json={"problem_statement": PROBLEM_STATEMENT},
        headers=headers
    )
    
    if create_req.status_code != 200:
        print(f"❌ Failed to create project: {create_req.text}")
        return
        
    project_data = create_req.json()
    project_id = project_data.get("id")
    print(f"✅ Project Created! ID: {project_id}")
    print_json(project_data)

    # Step 2: Phase 1 - Functional Decomposition
    print("2️⃣ Running Phase 1 (Functional Decomposition)...")
    p1_req = requests.post(f"{BASE_URL}/projects/{project_id}/run-phase/functional_decomposition", headers=headers)
    p1_res = p1_req.json()
    print("Phase 1 Generation Result:")
    print_json(p1_res)
    
    if p1_res.get("status") == "human_review" or p1_res.get("status") == "pending":
        print("✅ Phase 1 awaiting human approval. Approving existing AI data...")
        ai_data = p1_res.get("state", {}).get("functional_tree", {})
        
        # Approve Phase 1
        approve_req = requests.put(
            f"{BASE_URL}/projects/{project_id}/phase/functional_decomposition", 
            json={"human_approved_data": ai_data},
            headers=headers
        )
        print("Approval response:", approve_req.json())
        print("-" * 40)
    else:
        print("❌ Phase 1 did not reach human review state.", p1_res)
        return

    # Step 3: Phase 2 - Morphological Chart
    print("3️⃣ Running Phase 2 (Morphological Chart)...")
    p2_req = requests.post(f"{BASE_URL}/projects/{project_id}/run-phase/morphological_chart", headers=headers)
    p2_res = p2_req.json()
    print("Phase 2 Generation Result:")
    # print_json(p2_res) # Commented out full print as it could be long
    print(f"Status: {p2_res.get('status')}")
    
    if p2_res.get("status") == "human_review" or p2_res.get("status") == "pending":
        print("✅ Phase 2 awaiting human approval. Approving existing AI data...")
        ai_data = p2_res.get("state", {}).get("morphological_alternatives", {})
        
        # Approve Phase 2
        approve_req = requests.put(
            f"{BASE_URL}/projects/{project_id}/phase/morphological_chart", 
            json={"human_approved_data": ai_data},
            headers=headers
        )
        print("Approval response:", approve_req.json())
        print("-" * 40)
    else:
        print("❌ Phase 2 did not reach human review state.", p2_res)
        return

    # Step 4: Phase 3 - Risk Analysis
    print("4️⃣ Running Phase 3 (Risk Analysis)...")
    p3_req = requests.post(f"{BASE_URL}/projects/{project_id}/run-phase/risk_analysis", headers=headers)
    p3_res = p3_req.json()
    print("Phase 3 Generation Result:")
    # print_json(p3_res)
    print(f"Status: {p3_res.get('status')}")
    print("✅ End-to-End Test Completed Successfully!")

if __name__ == "__main__":
    try:
        run_e2e_test()
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Ensure your FastAPI server is running! (Run: uvicorn app.main:app --reload)")
