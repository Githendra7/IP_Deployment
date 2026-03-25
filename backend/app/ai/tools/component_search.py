from langchain_core.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun

search_tool = DuckDuckGoSearchRun()

@tool
def Hardware_Component_Search(query: str) -> str:
    """
    A web search tool specifically prompted to search for real-world mechatronic and hardware components.
    Use this to find physical solution principles, mechanisms, and specific components for engineering functions.
    """
    enhanced_query = f"mechatronic hardware component mechanism for {query}"
    try:
        results = search_tool.invoke(enhanced_query)
        return results
    except Exception as e:
        return f"Error performing hardware search: {str(e)}"
