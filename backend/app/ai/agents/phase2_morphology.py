import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import List, Dict

from app.core.config import settings
from app.ai.tools.component_search import Engineering_Research_Scraper
from app.ai.agents.validators import ValidationResult

class SolutionPrinciple(BaseModel):
    principle: str = Field(description="The component/mechanism name.")
    category: str = Field(description="One of: Low-Cost, Mechanical, Electronic, Industrial.")
    cost_estimate: str = Field(description="Estimated price found during scraping.")
    description: str = Field(description="Explanation.")

class FunctionSolutionMapping(BaseModel):
    function: str = Field(description="The abstract engineering function.")
    solutions: List[SolutionPrinciple] = Field(description="At least 3 physical solution principles for the function.")

class MorphologicalChart(BaseModel):
    mappings: List[FunctionSolutionMapping] = Field(description="Mapping of functions to solutions.")

# Generator
generator_llm = ChatGroq(temperature=0.7, model_name="llama-3.3-70b-versatile", groq_api_key=settings.GROQ_API_KEY)
generator_with_tools = generator_llm.bind_tools([Engineering_Research_Scraper])
generator_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a Mechatronics Agent. Use 'Engineering_Research_Scraper' with phase='phase2' to find parts and prices. Prioritize specific, tangible hardware: microcontrollers (e.g., ESP32, STM32, Arduino), sensors (e.g., IR, Ultrasonic, Encoder, IMU), and specialized industrial equipment. If the search doesn't return specific prices, estimate based on market averages for that specific component. CRITICAL: You must strictly carry over EVERY SINGLE FUNCTION generated in the Phase 1 Functional Tree into the morphological chart, ensuring there is a 1:1 mapping with different physical implementation methods (solutions). Each solution must include brief technical specs (e.g., voltage, torque, resolution)."),
    ("human", "Functional Tree: {functional_tree}\nValidation Feedback: {validation_feedback}")
])

phase2_generator = generator_prompt | generator_llm.bind_tools([Engineering_Research_Scraper]).with_structured_output(MorphologicalChart)
# Validator
validator_llm = ChatGroq(temperature=0.0, model_name="llama-3.1-8b-instant", groq_api_key=settings.GROQ_API_KEY)

validator_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an Engineering Validator. Evaluate the morphological chart mappings. Rules to check:\n1) Every function MUST have at least 3 distinct solutions.\n2) Solutions cannot be duplicated within a function.\n3) Avoid non-physical abstractions (must be tangible physical mechanisms/components).\nIf valid, return is_valid=True and empty feedback. If invalid, return is_valid=False and detail the exact violations."),
    ("human", "Morphological Chart JSON to validate: {morphological_chart}")
])

phase2_validator = validator_prompt | validator_llm.with_structured_output(ValidationResult)
