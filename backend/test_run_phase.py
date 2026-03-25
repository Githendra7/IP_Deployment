import sys
import json
from app.api.deps import get_current_user
from app.services.project_service import create_project_in_db
from app.services.phase_service import start_phase_graph
from app.core.config import supabase_client

user_id = "00000000-0000-0000-0000-000000000000"

print("Creating project...")
project = create_project_in_db(user_id, "test product idea for saving")
print(f"Project created: {project['id']}")

print("Running phase 1...")
res = start_phase_graph(project['id'], "functional_decomposition", "test product idea for saving")
print("Response keys:", res.keys())

check = supabase_client.table("project_phases").select("*").eq("project_id", project['id']).execute()
print(f"Saved DB records: {len(check.data)}")
print(json.dumps(check.data[0] if check.data else "None", indent=2))
