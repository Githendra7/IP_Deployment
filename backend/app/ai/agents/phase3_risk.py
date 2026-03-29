import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import List, Dict

from app.ai.tools.component_search import Engineering_Research_Scraper
from app.core.config import settings
from app.ai.tools.risk_databases import FMEA_Lookup
from app.ai.agents.validators import ValidationResult

class RiskItem(BaseModel):
    risk_category: str = Field(description="Category of the risk (e.g., Mechanical, Electrical, Thermal, Manufacturing, Integration).")
    cause: str = Field(description="A clear engineering cause for the risk based on physical hardware.")
    trade_off: str = Field(description="A key engineering trade-off associated with the risk.")

class RiskChecklist(BaseModel):
    risks: List[RiskItem] = Field(description="List of engineering risks and trade-offs.")

class AlternativeSWOT(BaseModel):
    function_name: str = Field(description="Function name from morphological chart.")
    solution_name: str = Field(description="Specific alternative name/component.")
    strength: str = Field(description="Strength of this alternative.")
    weakness: str = Field(description="Weakness, including rate of equipment, project implementation difficulty, and specific morph chart risks.")
    opportunity: str = Field(description="Opportunities based on market/social sentiment, or previous historical usage of this method.")
    threat: str = Field(description="Threats based on Google Patents claims or alternatives.")
    working_plan: str = Field(description="A depth working plan for implementing this solution, including components, sensors, microcontrollers, and step-by-step assembly/integration.")

class RiskAnalysisList(BaseModel):
    analysis: List[AlternativeSWOT] = Field(description="List of SWOT analysis for each alternative.")

# Generator
generator_llm = ChatGroq(temperature=0.7, model_name="llama-3.3-70b-versatile", groq_api_key=settings.GROQ_API_KEY)
generator_with_tools = generator_llm.bind_tools([Engineering_Research_Scraper])

generator_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a Market & Risk Agent. Use 'Engineering_Research_Scraper' with phase='phase3' to check patents, sentiment, and project history. For every single alternative in the morphology, determine its Strength, Weakness (factor in equipment rate and implementation difficulty), Opportunity, Threat, and a **Depth Working Plan**. The Working Plan must be technical and specific to the hardware (microcontrollers, sensors, etc.). Output as a detailed array."),
    ("human", "Goal: {problem_statement}\nMorphology: {morphological_alternatives}")
])


phase3_generator = generator_prompt | generator_llm.bind_tools([Engineering_Research_Scraper]).with_structured_output(RiskAnalysisList)
# Validator
validator_llm = ChatGroq(temperature=0.0, model_name="mixtral-8x7b-32768", groq_api_key=settings.GROQ_API_KEY)

validator_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an Engineering Validator. Evaluate the Risk Analysis List. Rules to check:\n1) Must map every alternative to the fields function_name, solution_name, strength, weakness, opportunity, threat, and working_plan.\n2) Weakness must cover equipment rates and implementation complexity.\n3) Opportunities must mention historical successes.\n4) working_plan MUST be a detailed, multi-step technical guide for implementing the component.\nIf valid, return is_valid=True and empty feedback. If invalid, return is_valid=False and detail the exact violations."),
    ("human", "SWOT Analysis JSON to validate: {risk_checklist}")
])

phase3_validator = validator_prompt | validator_llm.with_structured_output(ValidationResult)
