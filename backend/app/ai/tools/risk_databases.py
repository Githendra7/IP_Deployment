from langchain_core.tools import tool
from typing import Dict, List

FMEA_CATEGORIES = {
    "Mechanical": [
        "Fatigue failure", "Wear and tear", "Thermal expansion mismatch", 
        "Vibration loosening", "Yielding/Deformation", "Corrosion"
    ],
    "Electrical": [
        "Short circuit", "Open circuit", "Overheating", 
        "Electromagnetic interference (EMI)", "Component degradation"
    ],
    "Thermal": [
        "Overheating", "Thermal runaway", "Poor dissipation", 
        "Freezing/crystallization"
    ],
    "Manufacturing": [
        "Tolerance stack-up", "Assembly error", "Material defect", 
        "Contamination"
    ],
    "Integration": [
        "Signal mismatch", "Mechanical interference", 
        "Software/Hardware timing issues", "Connector failure"
    ]
}

@tool
def FMEA_Lookup(query: str = "") -> Dict[str, List[str]]:
    """
    A static knowledge base tool containing standard Failure Mode and Effects Analysis (FMEA) 
    categories for mechanical, electrical, thermal, manufacturing, and integration systems.
    Use this to identify standard engineering risks and trade-offs.
    """
    return FMEA_CATEGORIES
