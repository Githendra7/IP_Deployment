import sys
from app.core.config import supabase_client

res = supabase_client.table("project_phases").select("*").order("created_at", desc=True).limit(20).execute()
with open("output.txt", "w", encoding="utf-8") as f:
    f.write(f"Total Rows: {len(res.data)}\n")
    for row in res.data:
        p_id = row['project_id'].split('-')[0]
        p_name = row['phase_name']
        ai_data = row.get('ai_generated_data') or {}
        hum_data = row.get('human_approved_data') or {}
        f.write(f"Proj[{p_id}] Phase[{p_name}] AI_Len[{len(str(ai_data))}] Hum_Len[{len(str(hum_data))}]\n")
