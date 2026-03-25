import operator
from typing import TypedDict, Annotated, List, Dict, Optional

class EngineeringState(TypedDict):
    project_id: str
    problem_statement: str
    functional_tree: Dict
    morphological_alternatives: Dict
    risk_checklist: Dict
    current_phase: str
    validation_feedback: Optional[str]
    revision_count: Annotated[int, operator.add] # Tracks retries to prevent infinite loops
