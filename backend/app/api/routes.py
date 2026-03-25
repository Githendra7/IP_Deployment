from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.models.schemas import ProjectCreate, ProjectPhaseUpdate
from app.services.project_service import create_project_in_db, get_project_from_db, get_recent_projects_from_db
from app.services.phase_service import start_phase_graph, update_phase_human_data
from app.core.config import supabase_client

router = APIRouter()

@router.post("/projects")
def create_project(data: ProjectCreate, current_user: dict = Depends(get_current_user)):
    try:
        project = create_project_in_db(current_user["user_id"], data.problem_statement)
        return project
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/projects")
def get_recent_projects(limit: int = 10, current_user: dict = Depends(get_current_user)):
    try:
        projects = get_recent_projects_from_db(current_user["user_id"], limit=limit)
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/projects/{project_id}")
def get_project(project_id: str, current_user: dict = Depends(get_current_user)):
    project = get_project_from_db(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/projects/{project_id}/run-phase/{phase_name}")
def run_phase(project_id: str, phase_name: str, current_user: dict = Depends(get_current_user)):
    project = get_project_from_db(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    try:
        res = start_phase_graph(project_id, phase_name, project["problem_statement"])
        return res
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/projects/{project_id}/phase/{phase_name}")
def get_phase(project_id: str, phase_name: str, current_user: dict = Depends(get_current_user)):
    try:
        res = supabase_client.table("project_phases").select("*").eq("project_id", project_id).eq("phase_name", phase_name).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Phase not found")
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/projects/{project_id}/phase/{phase_name}")
def update_phase(project_id: str, phase_name: str, data: ProjectPhaseUpdate, current_user: dict = Depends(get_current_user)):
    try:
        res = update_phase_human_data(project_id, phase_name, data.human_approved_data)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
