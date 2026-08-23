import operator
from typing import Annotated, Any, Dict, List, TypedDict, Union
from langgraph.graph import StateGraph, END
import time

class AgentState(TypedDict):
    input_data: str
    parsed_intent: Dict[str, Any]
    semantic_knowledge: Dict[str, Any]
    admissibility_status: str
    admissibility_reasoning: str
    uncertainty_metrics: Dict[str, float]
    economic_score: float
    negotiation_offer: str
    payment_details: Dict[str, Any]
    audit_trail: Annotated[List[str], operator.add]

def perception_agent(state: AgentState):
    # Mocking perception: voice/image/text -> JSON intent
    print("Running Perception Agent")
    # In a real app, this would use Whisper/Qwen VL
    parsed = {
        "budget": 2500,
        "product": "protein powder",
        "diet": "vegan",
        "delivery": "Friday"
    }
    return {
        "parsed_intent": parsed,
        "audit_trail": [f"[{time.strftime('%H:%M:%S')}] Perception: Extracted intent from input."]
    }

def knowledge_agent(state: AgentState):
    print("Running Knowledge Agent")
    # Mocking Neo4j retrieval
    knowledge = {
        "product_id": "prod_123",
        "name": "Vegan Power Protein",
        "base_price": 2700,
        "inventory": "high",
        "margin": 25 # percentage
    }
    return {
        "semantic_knowledge": knowledge,
        "audit_trail": [f"[{time.strftime('%H:%M:%S')}] Knowledge: Queried Semantic Graph for 'vegan protein'."]
    }

def decision_admissibility_engine(state: AgentState):
    print("Running Decision Admissibility Engine")
    # Rule based + LLM evaluation
    intent = state.get("parsed_intent", {})
    knowledge = state.get("semantic_knowledge", {})
    
    budget = intent.get("budget", 0)
    base_price = knowledge.get("base_price", 0)
    
    status = "ADMISSIBLE"
    reasoning = "Customer budget is within acceptable negotiation range."
    
    if budget < base_price * 0.7:
        status = "REJECTED"
        reasoning = "Budget is too low to maintain margin."
        
    return {
        "admissibility_status": status,
        "admissibility_reasoning": reasoning,
        "audit_trail": [f"[{time.strftime('%H:%M:%S')}] Decision Engine: Status evaluated to {status}."]
    }

def uncertainty_engine(state: AgentState):
    print("Running Uncertainty Engine")
    metrics = {
        "epistemic_uncertainty": 0.05,
        "aleatoric_uncertainty": 0.12,
        "decision_entropy": 0.8
    }
    return {
        "uncertainty_metrics": metrics,
        "audit_trail": [f"[{time.strftime('%H:%M:%S')}] Uncertainty: Computed confidence metrics (Safe)."]
    }

def economic_reasoner(state: AgentState):
    print("Running Economic Reasoner")
    # U = 0.35P + 0.30S + 0.20L - 0.15R
    # Mock calculation
    P = 0.8 # Profitability factor
    S = 0.9 # Satisfaction factor
    L = 0.7 # LTV factor
    R = 0.1 # Risk factor
    
    U = (0.35 * P) + (0.30 * S) + (0.20 * L) - (0.15 * R)
    
    return {
        "economic_score": U,
        "audit_trail": [f"[{time.strftime('%H:%M:%S')}] Economic Reasoner: Calculated Utility Score U={U:.2f}"]
    }

def negotiation_agent(state: AgentState):
    print("Running Negotiation Agent")
    # Generates final offer based on economic score and admissibility
    offer = "I can offer you the Vegan Power Protein for ₹2250, leveraging your Gold membership."
    return {
        "negotiation_offer": offer,
        "audit_trail": [f"[{time.strftime('%H:%M:%S')}] Negotiation: Generated counter-offer."]
    }

def execution_agent(state: AgentState):
    print("Running Execution Agent")
    # Calls Razorpay API (Mocked here, integrated in main.py)
    payment = {
        "status": "pending_creation",
        "amount": 2250
    }
    return {
        "payment_details": payment,
        "audit_trail": [f"[{time.strftime('%H:%M:%S')}] Execution: Prepared Razorpay payment intent."]
    }

def router(state: AgentState):
    if state.get("admissibility_status") == "REJECTED":
        return "end"
    return "continue"

workflow = StateGraph(AgentState)

workflow.add_node("perception", perception_agent)
workflow.add_node("knowledge", knowledge_agent)
workflow.add_node("decision", decision_admissibility_engine)
workflow.add_node("uncertainty", uncertainty_engine)
workflow.add_node("economic", economic_reasoner)
workflow.add_node("negotiation", negotiation_agent)
workflow.add_node("execution", execution_agent)

workflow.set_entry_point("perception")
workflow.add_edge("perception", "knowledge")
workflow.add_edge("knowledge", "decision")

workflow.add_conditional_edges(
    "decision",
    router,
    {
        "continue": "uncertainty",
        "end": END
    }
)

workflow.add_edge("uncertainty", "economic")
workflow.add_edge("economic", "negotiation")
workflow.add_edge("negotiation", "execution")
workflow.add_edge("execution", END)

prism_graph = workflow.compile()
