import operator
from typing import TypedDict, Annotated, List, Dict, Optional, Any

class EngineeringState(TypedDict):
    project_id: str
    problem_statement: str
    functional_tree: Any
    morphological_alternatives: Any
    risk_checklist: Any
    current_phase: str
    validation_feedback: Optional[str]
    revision_count: Annotated[int, operator.add] # Tracks retries to prevent infinite loops
