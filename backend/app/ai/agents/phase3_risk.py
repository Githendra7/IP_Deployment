import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import List, Dict

from app.core.config import settings
from app.ai.tools.risk_databases import FMEA_Lookup
from app.ai.agents.validators import ValidationResult

class SWOTItem(BaseModel):
    function_name: str = Field(description="The engineering function title from Phase 2.")
    solution_name: str = Field(description="The specific solution principle name being evaluated.")
    strength: str = Field(description="A specific engineering strength of this solution.")
    weakness: str = Field(description="A specific engineering weakness, including its cause and associated trade-off.")
    opportunity: str = Field(description="A specific technical opportunity for future improvement.")
    threat: str = Field(description="A specific engineering threat or risk, including its cause and associated trade-off.")

class SWOTAnalysis(BaseModel):
    analysis: List[SWOTItem] = Field(description="List of engineering SWOT analysis items.")

# Generator
generator_llm = ChatGroq(temperature=0.7, model_name="llama-3.3-70b-versatile", groq_api_key=settings.GROQ_API_KEY)

generator_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an Engineering Evaluation Agent. Your task is to perform a detailed SWOT analysis for EVERY engineering solution principle generated for the SPECIFIC function provided. Evaluate ALL alternatives for this single function. Each response must contain a complete Strengths, Weaknesses, Opportunities, and Threats assessment for every single alternative. You must not skip any alternatives. Each Weakness and Threat must include a specific engineering cause (e.g. friction, signal noise) and trade-off (e.g. cost vs reliability). Strengths and Opportunities should highlight inherent technical advantages or future potential. Maintain technical depth and avoid business or market considerations. Return a flat list of SWOT assessments for the alternatives provided."),
    ("human", "Problem Statement: {problem_statement}\nFunctional Context: {functional_tree}\n\nFunction to Evaluate: {function_name}\nAlternatives to Evaluate: {alternatives}\n\nValidation Feedback (if any): {validation_feedback}\n\nPlease generate a SWOT analysis for ALL alternatives under this specific function.")
])

phase3_generator = generator_prompt | generator_llm.with_structured_output(SWOTAnalysis)

# Validator
validator_llm = ChatGroq(temperature=0.0, model_name="llama-3.1-8b-instant", groq_api_key=settings.GROQ_API_KEY)

validator_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an Engineering Validator. Evaluate the structured engineering SWOT analysis checklist. You must ensure completeness against the Morphological Chart. Rules to check:\n1) Ensure THERE IS EXACTLY ONE SWOT assessment for EVERY single alternative (solution principle) listed under EVERY function in the Morphological Chart. If any alternative is missing from the SWOT checklist, it is INVALID.\n2) No generic business or market risks (must be engineering specific).\n3) Weakness and Threat must have clear engineering causes and trade-offs.\nIf valid, return is_valid=True and empty feedback. If invalid, return is_valid=False and detail the exact violations including which specific alternatives for which functions are missing."),
    ("human", "Morphological Chart (Input): {morphological_alternatives}\n\nSWOT Analysis JSON to validate: {risk_checklist}")
])

phase3_validator = validator_prompt | validator_llm.with_structured_output(ValidationResult)
