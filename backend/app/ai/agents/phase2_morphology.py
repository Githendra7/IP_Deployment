import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import List, Dict

from app.core.config import settings
from app.ai.tools.component_search import Hardware_Component_Search
from app.ai.agents.validators import ValidationResult

class SolutionPrinciple(BaseModel):
    principle: str = Field(description="A real, physical mechanism combining engineering principles.")
    description: str = Field(description="Brief explanation of how it satisfies the function.")

class FunctionSolutionMapping(BaseModel):
    function: str = Field(description="The abstract engineering function.")
    solutions: List[SolutionPrinciple] = Field(description="At least 3 physical solution principles for the function.")

class MorphologicalChart(BaseModel):
    mappings: List[FunctionSolutionMapping] = Field(description="Mapping of functions to solutions.")

# Generator
generator_llm = ChatGroq(temperature=0.7, model_name="llama-3.3-70b-versatile", groq_api_key=settings.GROQ_API_KEY)
generator_with_tools = generator_llm.bind_tools([Hardware_Component_Search])

generator_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an Ideation & Systems Engineering Agent specializing in engineering concept generation and morphological analysis. Your task is to convert each MAIN function (Level 1 functions only) from the provided functional decomposition tree into a comprehensive morphological chart by mapping each function to multiple feasible solution principles. The columns must strictly include only the main functional decomposition (Level 1 functions) from the previous phase, and no sub-functions should be used as columns. For every function, generate a minimum of 5 and up to 10 distinct solution principles to maximize design exploration. Each solution must represent a real, implementable principle and must obey fundamental constraints (physical laws for hardware, computational/logical feasibility for software, and system constraints for hybrid systems). Ensure solutions can include mechanical, electrical, thermal, fluidic, digital, algorithmic, or human-interaction principles depending on the nature of the function. Avoid vague or generic terms; instead, use concrete working principles such as kinematic mechanisms, energy conversion methods, sensing principles, actuation methods, data processing methods, control logic, communication protocols, and decision-making strategies. Ensure high diversity by covering multiple domains (mechanical, electrical, software, control systems, data systems, human-system interaction, etc.) and different underlying principles (e.g., electromagnetic, hydraulic, rule-based logic, probabilistic models, feedback control, distributed systems), avoiding redundancy or closely similar options. Do not leave any function unmapped. Present the output strictly as a structured morphological chart where each column represents a main function and contains its corresponding solution principles. Ensure solutions are independent, non-overlapping, and suitable for combination into complete system concepts, while maintaining practical feasibility, scalability, and real-world applicability. Return only the morphological chart without explanations."),
    ("human", "Functional Tree: {functional_tree}\n\nValidation Feedback (if any): {validation_feedback}\n\nPlease generate the Morphological Chart mapping.")
])

phase2_generator = generator_prompt | generator_with_tools.with_structured_output(MorphologicalChart)

# Validator
validator_llm = ChatGroq(temperature=0.0, model_name="llama-3.1-8b-instant", groq_api_key=settings.GROQ_API_KEY)

validator_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an Engineering Validator. Evaluate the morphological chart mappings. Rules to check:\n1) Every function MUST have at least 3 distinct solutions.\n2) Solutions cannot be duplicated within a function.\n3) Avoid non-physical abstractions (must be tangible physical mechanisms/components).\nIf valid, return is_valid=True and empty feedback. If invalid, return is_valid=False and detail the exact violations."),
    ("human", "Morphological Chart JSON to validate: {morphological_chart}")
])

phase2_validator = validator_prompt | validator_llm.with_structured_output(ValidationResult)
