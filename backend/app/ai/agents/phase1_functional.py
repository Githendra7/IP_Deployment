import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import List, Dict

from app.core.config import settings
from app.ai.tools.taxonomies import Functional_Basis_Lookup, TRIZ_Principles_Query
from app.ai.agents.validators import ValidationResult
from app.ai.tools.component_search import Engineering_Research_Scraper

# Pydantic schema for generator output
class FunctionNode(BaseModel):
    function: str = Field(description="The abstract engineering function formulated as Verb + Noun.")
    children: List["FunctionNode"] = Field(default_factory=list, description="Child sub-functions.")

class FunctionalTree(BaseModel):
    root_function: FunctionNode = Field(description="The main top-level function of the system.")

# Generator
generator_llm = ChatGroq(temperature=0.7, model_name="llama-3.3-70b-versatile", groq_api_key=settings.GROQ_API_KEY)
# Bind tools
generator_with_tools = generator_llm.bind_tools([Engineering_Research_Scraper])
generator_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a Functional Architect. Use 'Engineering_Research_Scraper' with phase='phase1' to deeply scrape project ideas and find prior art. Base the decomposition on successful real-world mechatronic architectures found in the search results. Ensure the decomposition is highly detailed, breaking the system into AT LEAST 5-7 robust sub-steps (children). Emphasize deep 'Verb + Noun' abstraction that mirrors sophisticated engineering flows (e.g., 'Modulate Power Flow' vs 'Control Power')."),
    ("human", "Problem Statement: {problem_statement}\nValidation Feedback: {validation_feedback}")
])


# Use structure for final output parsing
phase1_generator = generator_prompt | generator_llm.bind_tools([Engineering_Research_Scraper]).with_structured_output(FunctionalTree)
# Validator
validator_llm = ChatGroq(temperature=0.0, model_name="llama-3.1-8b-instant", groq_api_key=settings.GROQ_API_KEY)

validator_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an Engineering Validator. Evaluate the functional decomposition tree. Rules to check:\n1) NO physical components or specific real-world technologies (e.g. 'solar', 'pump', 'filter'). Note: Generic engineering flows like 'liquid', 'solid', 'gas', 'energy', 'signal' are ALLOWED and VALID abstract nouns.\n2) Functions must be abstract (Verb + Noun).\n3) There must exist a defined hierarchy (root -> children).\nIf valid, return is_valid=True and empty feedback. If invalid, return is_valid=False and specify the exact rule violations."),
    ("human", "Functional Tree JSON to validate: {functional_tree}")
])

phase1_validator = validator_prompt | validator_llm.with_structured_output(ValidationResult)
