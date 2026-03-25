import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import List, Dict

from app.core.config import settings
from app.ai.tools.taxonomies import Functional_Basis_Lookup, TRIZ_Principles_Query
from app.ai.agents.validators import ValidationResult

class SubFunction(BaseModel):
    function: str = Field(description="Level 2 abstract engineering function (Verb + Noun).")

class MainFunction(BaseModel):
    function: str = Field(description="Level 1 abstract engineering function (Verb + Noun).")
    sub_functions: List[SubFunction] = Field(default_factory=list, description="Child sub-functions for this Level 1 function.")

class FunctionalTree(BaseModel):
    root_function: str = Field(description="The main top-level function of the system (Verb + Noun).")
    main_functions: List[MainFunction] = Field(description="The Level 1 functions that decompose the root function.")

# Generator
generator_llm = ChatGroq(temperature=0.7, model_name="llama-3.3-70b-versatile", groq_api_key=settings.GROQ_API_KEY)

generator_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a Functional Architect specializing in engineering system abstraction. Your task is to convert the given problem statement into a hierarchical Functional Decomposition Tree. Every function must strictly follow the Verb + Noun format (e.g., “Convert Energy”, “Transmit Signal”). Do not include physical components (such as pump, battery, server), specific materials (such as water, air, metal), or specific technologies (such as AI, blockchain, solar). Always use generalized engineering flows such as energy, material (solid/liquid/gas), signal, data, and human. Ensure all functions are solution-neutral, technology-independent, and abstract but meaningful. Avoid vague verbs like “handle”, “manage”, or “process”, and instead use precise verbs such as “convert”, “transfer”, “store”, “control”, “regulate”, “detect”, and “separate”. Begin with a top-level function representing the overall purpose of the system, then decompose it into 4–8 major Level 1 functions, followed by Level 2 and further sub-levels until functions become atomic and cannot be meaningfully decomposed further. Present the output as a clear hierarchical tree using indentation or numbering. Before finalizing, ensure all functions follow the Verb + Noun format, no physical components or technologies are mentioned, the decomposition is logically complete and non-redundant, and each level increases in detail. Return only the functional tree without any explanations."),
    ("human", "Problem Statement: {problem_statement}\n\nValidation Feedback (if any): {validation_feedback}\n\nPlease generate the functional tree obeying the rules strictly.")
])

# Use structure for final output parsing
phase1_generator = generator_prompt | generator_llm.with_structured_output(FunctionalTree)

# Validator
validator_llm = ChatGroq(temperature=0.0, model_name="llama-3.1-8b-instant", groq_api_key=settings.GROQ_API_KEY)

validator_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an Engineering Validator. Evaluate the functional decomposition tree. Rules to check:\n1) NO physical components or specific real-world technologies (e.g. 'solar', 'pump', 'filter'). Note: Generic engineering flows like 'liquid', 'solid', 'gas', 'energy', 'signal' are ALLOWED and VALID abstract nouns.\n2) Functions must be abstract (Verb + Noun).\n3) There must exist a defined hierarchy (root -> main_functions -> sub_functions).\nIf valid, return is_valid=True and empty feedback. If invalid, return is_valid=False and specify the exact rule violations."),
    ("human", "Functional Tree JSON to validate: {functional_tree}")
])

phase1_validator = validator_prompt | validator_llm.with_structured_output(ValidationResult)
