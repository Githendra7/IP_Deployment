from pydantic import BaseModel, Field

class ValidationResult(BaseModel):
    """Structured output for Validator Agents to evaluate outputs."""
    is_valid: bool = Field( description="Whether the generated output passes all validation rules.")
    feedback: str = Field(description="Detailed feedback explaining why the output failed validation, or an empty string if valid.")
