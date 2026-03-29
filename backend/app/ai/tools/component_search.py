from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.tools import tool
from app.core.config import settings

# Initialize Tavily using the key from settings
tavily_search = TavilySearchResults(
    tavily_api_key=settings.TAVILY_API_KEY,
    max_results=5, 
    search_depth="advanced"
)

@tool
def Engineering_Research_Scraper(query: str, phase: str) -> str:
    """
    Scrapes specific domains based on the engineering phase:
    phase1: hackster.io, instructables.com, hackaday.com, maker.pro (Functional Logic)
    phase2: general web search (Components/Prices)
    phase3: patents.google.com, reddit.com/r/hardware, kickstarter.com, amazon.com (Market/Legal)
    """
    domain_map = {
        "phase1": "site:hackster.io OR site:instructables.com OR site:hackaday.com OR site:maker.pro",
        "phase2": "",
        "phase3": "site:patents.google.com OR site:reddit.com/r/hardware OR site:kickstarter.com OR site:amazon.com"
    }
    
    target_domains = domain_map.get(phase, "")
    enhanced_query = f"{query} {target_domains}".strip()
    
    try:
        results = tavily_search.invoke(enhanced_query)
        if not results:
            raise ValueError("No results found via Tavily")
        return "\n---\n".join([f"Source: {r['url']}\nContent: {r['content']}" for r in results])
    except Exception as e:
        print(f"Tavily search failed or returned empty ({e}). Falling back to DuckDuckGo...")
        try:
            ddg_query = f"{query} {phase} project details"
            # Lazy initialize
            ddg_search = DuckDuckGoSearchRun()
            # Return result via duckduckgo
            ddg_result = ddg_search.invoke(ddg_query)
            return f"DuckDuckGo Fallback Result:\n{ddg_result}"
        except Exception as ddg_err:
            return f"Scraping error across endpoints: {str(ddg_err)}"
