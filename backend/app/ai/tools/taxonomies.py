from langchain_core.tools import tool
from typing import Dict, List

# Standard NIST Functional Basis (Simplified for example)
NIST_FUNCTIONAL_BASIS = {
    "Branch": ["Separate", "Distribute", "Route"],
    "Channel": ["Import", "Export", "Transfer", "Guide"],
    "Connect": ["Couple", "Mix"],
    "Control Magnitude": ["Actuate", "Regulate", "Change", "Stop"],
    "Convert": ["Convert"],
    "Provision": ["Store", "Supply"],
    "Signal": ["Sense", "Indicate", "Process"],
    "Support": ["Stabilize", "Secure", "Position"]
}

# 40 TRIZ Inventive Principles
TRIZ_PRINCIPLES = [
    "1. Segmentation", "2. Taking out", "3. Local quality", "4. Asymmetry",
    "5. Merging", "6. Universality", "7. Nested doll", "8. Anti-weight",
    "9. Preliminary anti-action", "10. Preliminary action", "11. Beforehand cushioning",
    "12. Equipotentiality", "13. 'The other way round'", "14. Spheroidality - Curvature",
    "15. Dynamics", "16. Partial or excessive actions", "17. Another dimension",
    "18. Mechanical vibration", "19. Periodic action", "20. Continuity of useful action",
    "21. Skipping", "22. 'Blessing in disguise'", "23. Feedback", "24. 'Intermediary'",
    "25. Self-service", "26. Copying", "27. Cheap short-living objects",
    "28. Mechanics substitution", "29. Pneumatics and hydraulics", "30. Flexible shells and thin films",
    "31. Porous materials", "32. Color changes", "33. Homogeneity", "34. Discarding and recovering",
    "35. Parameter changes", "36. Phase transitions", "37. Thermal expansion",
    "38. Strong oxidants", "39. Inert atmosphere", "40. Composite materials"
]

@tool
def Functional_Basis_Lookup(query: str) -> Dict[str, List[str]]:
    """
    Lookup tool containing standard engineering functional bases (e.g., NIST Functional Basis).
    Given a query or empty string, it returns basic functional categories to help abstract the engineering functions.
    Returns functions formulated as Verb + Noun.
    """
    # In a real app, you might do a vector search here.
    return NIST_FUNCTIONAL_BASIS

@tool
def TRIZ_Principles_Query(query: str) -> List[str]:
    """
    Lookup tool containing the 40 TRIZ Inventive Principles.
    Use this to get inventive principles for solving mechanical and engineering contradictions.
    """
    return TRIZ_PRINCIPLES
