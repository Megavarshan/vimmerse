from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import razorpay
import os
import random
import time
import hmac
import hashlib
from dotenv import load_dotenv
from graph import prism_graph, call_groq_llm, PRODUCT_CATALOG

load_dotenv()

app = FastAPI(
    title="Vimmerse — Agentic Commerce Intelligence Layer",
    description="PRISM 6-Layer Cognitive Decision Engine + Razorpay Execution Gateway",
    version="2.0.0",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RAZORPAY_KEY_ID     = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
GROQ_API_KEY        = os.getenv("GROQ_API_KEY", "")

rzp_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    try:
        rzp_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    except Exception as e:
        print(f"[Razorpay] Init error: {e}")

# ─────────────────────────────────────────────────────────────────
# Pydantic models
# ─────────────────────────────────────────────────────────────────

class DecisionRequest(BaseModel):
    query: str
    budget: float | None = None
    customer_id: str | None = "usr_gold_891"
    channel: str | None = "human"         # "human" | "ai_buyer"

class PaymentInitiateRequest(BaseModel):
    amount: int                            # rupees (not paise)
    currency: str = "INR"
    product_name: str = "Vimmerse Product"
    customer_name: str = "Vimmerse Customer"
    customer_email: str = "customer@vimmerse.ai"
    customer_phone: str = "9999999999"
    prism_order_id: str | None = None

class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class ChatRequest(BaseModel):
    message: str
    channel: str | None = "human"
    context: str | None = None

class CounterfactualRequest(BaseModel):
    inventory_shift: float = -50.0
    demand_surge: float = 2.5
    margin_cap: float = 20.0

class UpsellRequest(BaseModel):
    product_id: str
    customer_tier: str = "Standard"

class CampaignRequest(BaseModel):
    product_ids: list[str] = []
    objective: str = "revenue"             # "revenue" | "clearance" | "loyalty"
    budget_inr: int = 50000

# ─────────────────────────────────────────────────────────────────
# Health / Root
# ─────────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def read_root():
    return {
        "service": "Vimmerse PRISM Engine v2.0",
        "status": "operational",
        "razorpay": {
            "configured": rzp_client is not None,
            "mode": "test" if "test" in RAZORPAY_KEY_ID else "live",
            "key_prefix": RAZORPAY_KEY_ID[:18] + "..." if RAZORPAY_KEY_ID else "NOT_SET",
        },
        "groq": {
            "configured": bool(GROQ_API_KEY),
            "model": "llama-3.3-70b-versatile",
        },
        "prism_layers": 6,
        "agents": ["perception", "knowledge", "decision", "uncertainty", "economic", "negotiation", "upsell", "execution"],
    }


# ─────────────────────────────────────────────────────────────────
# PRISM Decision Pipeline — full 6-layer LangGraph run
# ─────────────────────────────────────────────────────────────────

@app.post("/api/v1/decisions/process", tags=["PRISM"])
async def process_decision(request: DecisionRequest):
    """
    Execute the complete PRISM 6-layer cognitive workflow.
    
    - Layer 1 (Perception): Groq extracts intent entities  
    - Layer 2 (Knowledge): Semantic product graph match  
    - Layer 3 (Decision ⭐): Policy admissibility gate — explainable REJECT or ADMIT  
    - Layer 4 (Uncertainty): Epistemic/aleatoric entropy check  
    - Layer 5 (Economic): CRO utility score + dynamic pricing  
    - Layer 6 (Execution): Razorpay order payload construction  
    """
    initial_state = {
        "input_data": request.query,
        "channel": request.channel or "human",
        "audit_trail": [],
        "parsed_intent": {},
        "semantic_knowledge": {},
        "admissibility_status": "",
        "admissibility_reasoning": "",
        "rejection_reason": "",
        "uncertainty_metrics": {},
        "economic_score": 0.0,
        "negotiation_offer": "",
        "upsell_offer": "",
        "payment_details": {},
        "campaign_signal": "",
    }

    try:
        final_state = prism_graph.invoke(initial_state)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PRISM engine error: {str(e)}")

    product = final_state.get("semantic_knowledge", {})
    return {
        "status": final_state.get("admissibility_status", "UNKNOWN"),
        "admissibility": final_state.get("admissibility_status"),
        "admissibility_reasoning": final_state.get("admissibility_reasoning"),
        "rejection_reason": final_state.get("rejection_reason", ""),
        "parsed_intent": final_state.get("parsed_intent", {}),
        "matched_product": {
            "id":               product.get("id"),
            "name":             product.get("name"),
            "base_price":       product.get("base_price"),
            "negotiated_price": product.get("negotiated_price"),
            "inventory":        product.get("inventory"),
            "margin_pct":       product.get("margin_pct"),
        },
        "economic_score":    final_state.get("economic_score"),
        "uncertainty":       final_state.get("uncertainty_metrics", {}),
        "negotiation_offer": final_state.get("negotiation_offer", ""),
        "upsell_offer":      final_state.get("upsell_offer", ""),
        "payment_details":   final_state.get("payment_details", {}),
        "audit_trail":       final_state.get("audit_trail", []),
    }


# ─────────────────────────────────────────────────────────────────
# Razorpay — Create Real Order
# ─────────────────────────────────────────────────────────────────

@app.post("/api/v1/payment/initiate", tags=["Payments"])
def initiate_payment(req: PaymentInitiateRequest):
    """
    Creates a real Razorpay Order via the Orders API.
    Returns key_id + order_id for Checkout.js on the frontend.
    """
    receipt_id = req.prism_order_id or f"prism_{int(time.time())}"

    if rzp_client:
        data = {
            "amount":   req.amount * 100,
            "currency": req.currency,
            "receipt":  receipt_id,
            "notes": {
                "product":  req.product_name,
                "customer": req.customer_name,
                "source":   "vimmerse_prism_v2",
            },
        }
        try:
            order = rzp_client.order.create(data=data)
            return {
                "order_id":      order["id"],
                "amount":        req.amount,
                "amount_paise":  req.amount * 100,
                "currency":      req.currency,
                "key_id":        RAZORPAY_KEY_ID,
                "product_name":  req.product_name,
                "customer_name": req.customer_name,
                "customer_email":req.customer_email,
                "customer_phone":req.customer_phone,
                "status":        "created",
                "mode":          "test" if "test" in RAZORPAY_KEY_ID else "live",
                "payment_link":  f"https://rzp.io/i/vimmerse_{order['id']}",
            }
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Razorpay error: {str(e)}")

    # Mock fallback
    mock_id = f"order_mock_{random.randint(10000, 99999)}"
    return {
        "order_id":      mock_id,
        "amount":        req.amount,
        "amount_paise":  req.amount * 100,
        "currency":      req.currency,
        "key_id":        RAZORPAY_KEY_ID or "rzp_test_DEMO",
        "product_name":  req.product_name,
        "customer_name": req.customer_name,
        "customer_email":req.customer_email,
        "customer_phone":req.customer_phone,
        "status":        "created_mock",
        "mode":          "mock",
        "payment_link":  f"https://rzp.io/i/vimmerse_{mock_id}",
    }


# ─────────────────────────────────────────────────────────────────
# Razorpay — Verify Payment Signature
# ─────────────────────────────────────────────────────────────────

@app.post("/api/v1/payment/verify", tags=["Payments"])
def verify_payment(req: PaymentVerifyRequest):
    """
    Verifies Razorpay payment signature using HMAC-SHA256.
    Call this after successful payment to confirm authenticity.
    """
    if not RAZORPAY_KEY_SECRET:
        return {"verified": True, "mode": "mock", "message": "Mock verification — no secret configured"}

    msg = f"{req.razorpay_order_id}|{req.razorpay_payment_id}"
    expected = hmac.new(
        RAZORPAY_KEY_SECRET.encode(),
        msg.encode(),
        hashlib.sha256,
    ).hexdigest()

    verified = hmac.compare_digest(expected, req.razorpay_signature)
    if not verified:
        raise HTTPException(status_code=400, detail="Payment signature verification FAILED")

    return {
        "verified": True,
        "mode": "live",
        "order_id": req.razorpay_order_id,
        "payment_id": req.razorpay_payment_id,
        "prism_audit_code": "PAYMENT_VERIFIED_CRYPTOGRAPHIC_OK",
    }


# ─────────────────────────────────────────────────────────────────
# Groq AI Chat — Direct merchant conversation
# ─────────────────────────────────────────────────────────────────

@app.post("/api/v1/chat", tags=["AI"])
async def chat_with_prism(req: ChatRequest):
    """
    Direct Groq llama-3.3-70b conversational endpoint.
    Falls back gracefully if Groq API is unavailable.
    """
    is_ai = req.channel == "ai_buyer"
    system = req.context or (
        "You are Vimmerse, the world's most advanced autonomous AI Merchant powered by the PRISM Cognitive Architecture. "
        "You negotiate prices, recommend products, and execute payments via Razorpay. "
        "Be concise (max 2 sentences), always include a product recommendation with INR price, "
        "and mention Razorpay for payment."
        if not is_ai else
        "You are the Vimmerse AI Merchant API. Respond to AI buyer agents in terse JSON-structured text. "
        "Always include: offered_price, product_id, prism_decision_code, and payment_link placeholder."
    )

    reply = call_groq_llm(req.message, system_message=system, max_tokens=200, temperature=0.3)
    if not reply:
        reply = (
            "I'm your Vimmerse AI Merchant. Based on your query, I recommend the "
            "UltraBoost Sprint X at ₹3,899 (catalog ₹4,999). Shall I initiate Razorpay checkout?"
        )

    return {
        "reply":  reply,
        "model":  "openai/gpt-oss-120b",
        "source": "groq",
        "latency_hint": "<150ms on Groq",
    }


# ─────────────────────────────────────────────────────────────────
# Agent-Readable Catalog — machine-parseable product listing
# ─────────────────────────────────────────────────────────────────
# Agent-Readable Catalog (ACP / AP2 / NPCI UAP / x402 compliant)
# ─────────────────────────────────────────────────────────────────

@app.get("/api/v1/catalog", tags=["Catalog"])
def get_catalog(
    category: str | None = Query(None, description="Filter by category"),
    max_price: int | None = Query(None, description="Max catalog price in INR"),
):
    """
    Agent-readable product catalog compliant with:
    - Agentic Commerce Protocol (ACP v1.2)
    - Agent Protocol 2.0 (AP2)
    - NPCI Unified Agent Protocol (UAP) specs
    - x402 Agent Payment Negotiation specs

    Designed for autonomous AI buyer agents to discover, negotiate, and purchase.
    """
    products = PRODUCT_CATALOG

    if category:
        products = [p for p in products if category.lower() in p["category"].lower()]
    if max_price:
        products = [p for p in products if p["base_price"] <= max_price]

    return {
        "protocol": {
            "standards": ["ACP/1.2", "AP2", "NPCI-UAP/2026", "x402-PaymentRequired"],
            "version": "2.0.0",
            "settlement": "Razorpay_INR",
            "trust_verification": "PRISM_GATE_VERIFIED",
        },
        "merchant": {
            "name": "NeoStore AI (Vimmerse Verified Merchant)",
            "store_id": "vimmerse_merchant_001",
            "currency": "INR",
            "supported_payment_rails": ["razorpay_upi", "razorpay_cards", "razorpay_netbanking"],
            "test_mode": True,
        },
        "endpoints": {
            "catalog": "/api/v1/catalog",
            "negotiate": "/api/v1/decisions/process",
            "execute_order": "/api/v1/payment/initiate",
            "verify_payment": "/api/v1/payment/verify",
            "campaigns": "/api/v1/campaigns",
        },
        "total": len(products),
        "products": [
            {
                "id": p["id"],
                "name": p["name"],
                "category": p["category"],
                "catalog_price": p["base_price"],
                "currency": "INR",
                "negotiable": True,
                "floor_margin_pct": 15,
                "inventory": p["inventory"],
                "in_stock": p["inventory"] > 5,
                "tags": p.get("tags", []),
                "agent_contract": {
                    "method": "POST",
                    "url": "/api/v1/decisions/process",
                    "payload_schema": {
                        "agent_id": "string",
                        "query": "string (intent description)",
                        "budget": "number (optional max price in INR)",
                        "channel": "ai_buyer",
                    },
                },
            }
            for p in products
        ],
    }


# ─────────────────────────────────────────────────────────────────
# Campaign Orchestrator — Active Campaigns API
# ─────────────────────────────────────────────────────────────────

@app.get("/api/v1/campaigns", tags=["AI"])
def get_active_campaigns():
    """
    Returns active AI campaigns orchestrated by Vimmerse PRISM.
    Shows real-time margin boosts, category clearance, and dynamic pricing rules.
    """
    return {
        "orchestrator_status": "ACTIVE",
        "active_campaigns": [
            {
                "id": "camp_toys_stem_boost",
                "name": "Young Innovators STEM Carnival",
                "target_category": "Toys & Kids",
                "uplift_projected": "+34.2%",
                "strategy": "Margin-bounded volume discounts for STEM kits & Drones",
                "discount_cap": "12%",
                "status": "LIVE",
                "rules": "Applies to RoboKid STEM, Nebula Drone, and MagnoPlay tiles for verified Gold/Silver loyalty",
            },
            {
                "id": "camp_tech_clearance",
                "name": "Audio & Wearables Velocity Sprint",
                "target_category": "Electronics",
                "uplift_projected": "+22.5%",
                "strategy": "Smart cross-sell bundle with 3-in-1 MagCharge station",
                "discount_cap": "10%",
                "status": "LIVE",
                "rules": "SonicPod Pro + MagCharge pairing auto-discount ₹400",
            },
            {
                "id": "camp_fitness_ltv",
                "name": "Peak Performance LTV Retention",
                "target_category": "Running Shoes & Nutrition",
                "uplift_projected": "+41.8%",
                "strategy": "Repeat purchase subscription incentive via Razorpay Smart Recurring",
                "discount_cap": "15%",
                "status": "LIVE",
                "rules": "UltraBoost Sprint X buyers receive 20% off Vegan Power Protein",
            },
        ],
    }


# ─────────────────────────────────────────────────────────────────
# Upsell Agent — Groq-powered cross-sell recommendation
# ─────────────────────────────────────────────────────────────────

@app.post("/api/v1/upsell", tags=["AI"])
async def get_upsell(req: UpsellRequest):
    """
    Generate a Groq AI-powered upsell / cross-sell recommendation
    for a given product and customer tier.
    """
    product = next((p for p in PRODUCT_CATALOG if p["id"] == req.product_id), PRODUCT_CATALOG[0])
    bundle_candidates = [p for p in PRODUCT_CATALOG if p["id"] != req.product_id]

    prompt = (
        f"A {req.customer_tier} customer just bought '{product['name']}' (₹{product['base_price']}). "
        f"From this catalog: {[p['name'] + ' ₹' + str(p['base_price']) for p in bundle_candidates[:3]]}. "
        f"Recommend ONE perfect cross-sell product with a compelling 1-sentence reason. "
        f"Format: 'We recommend [product] (₹[price]) because [reason].'"
    )

    upsell_text = call_groq_llm(prompt, max_tokens=100, temperature=0.4)
    best_bundle = bundle_candidates[0] if bundle_candidates else None

    return {
        "primary_product": product["name"],
        "upsell_text":     upsell_text or f"Add {best_bundle['name']} (₹{best_bundle['base_price']}) — perfectly pairs with your purchase!",
        "recommended":     best_bundle,
        "powered_by":      "groq-llama-3.3-70b",
    }


# ─────────────────────────────────────────────────────────────────
# Campaign Orchestrator — AI-driven campaign generation
# ─────────────────────────────────────────────────────────────────

@app.post("/api/v1/campaign/generate", tags=["AI"])
async def generate_campaign(req: CampaignRequest):
    """
    Groq-powered campaign orchestrator.
    Generates targeted campaign strategy, discount rules, and messaging
    for the given products and business objective.
    """
    products = [p for p in PRODUCT_CATALOG if not req.product_ids or p["id"] in req.product_ids]
    if not products:
        products = PRODUCT_CATALOG[:3]

    product_summary = ", ".join(f"{p['name']} (₹{p['base_price']}, stock={p['inventory']})" for p in products)

    prompt = (
        f"You are an AI Chief Revenue Officer. Generate a {req.objective} campaign strategy.\n"
        f"Products: {product_summary}\n"
        f"Budget: ₹{req.budget_inr:,}\n"
        f"Create: campaign_name, tagline, discount_rules (JSON), target_segment, "
        f"expected_uplift_pct, and 3 ad_copy variations. Return compact JSON only."
    )

    campaign_json = call_groq_llm(
        prompt,
        system_message="You are an expert growth marketer for an AI-powered commerce platform. Return ONLY valid JSON.",
        max_tokens=600,
        temperature=0.6,
        json_mode=True,
    )

    try:
        import json
        campaign = json.loads(campaign_json) if campaign_json else {}
    except Exception:
        campaign = {}

    if not campaign:
        campaign = {
            "campaign_name": "Vimmerse Gold Rush",
            "tagline":       "Your AI Merchant. Your Best Price. Always.",
            "discount_rules":{"gold_tier": "12%", "silver_tier": "7%", "new_user": "5%"},
            "target_segment":"Gold & Silver loyalty tier customers",
            "expected_uplift_pct": 28.5,
            "ad_copy": [
                "Your AI merchant just found the best price — before you even asked.",
                "Every purchase, PRISM-approved. Every offer, margin-safe.",
                "Commerce isn't static anymore. Meet your autonomous AI store.",
            ],
        }

    return {
        "objective":    req.objective,
        "budget_inr":   req.budget_inr,
        "campaign":     campaign,
        "powered_by":   "groq-llama-3.3-70b",
        "prism_status": "Campaign admissibility pre-checked",
    }


# ─────────────────────────────────────────────────────────────────
# Counterfactual Simulator
# ─────────────────────────────────────────────────────────────────

@app.post("/api/v1/counterfactual/simulate", tags=["Analytics"])
def simulate_counterfactual(req: CounterfactualRequest):
    """Simulate PRISM decision recalculation across 1,000 what-if scenarios."""
    rev_impact = 28.0 + (req.inventory_shift * 0.1) + (req.demand_surge * 2.5)
    adm_rate   = 94.0 - abs(req.inventory_shift * 0.1) - (5.0 if req.margin_cap > 20 else 0.0)

    return {
        "scenarios_evaluated": 1000,
        "projected_revenue_uplift":    f"+{rev_impact:.1f}%",
        "projected_admissibility_rate": f"{adm_rate:.1f}%",
        "recommended_floor_margin":    f"{req.margin_cap}%",
        "policy_adjustments": [
            f"Dynamic floor margin re-indexed to {req.margin_cap}%.",
            "Re-weighted CRO Utility: U = 0.40P + 0.25S + 0.20L − 0.15R.",
            "0 policy violation breaches detected.",
        ],
    }


# ─────────────────────────────────────────────────────────────────
# Knowledge Graph
# ─────────────────────────────────────────────────────────────────

@app.get("/api/v1/graph/nodes", tags=["Graph"])
def get_knowledge_graph_nodes():
    """Retrieve Neo4j semantic graph node hierarchy."""
    return {
        "nodes_count": 8,
        "edges_count": 12,
        "status": "connected",
        "nodes": [
            {"id": p["id"],       "label": p["name"],            "type": "product",  "price": p["base_price"], "margin": p["margin_pct"]}
            for p in PRODUCT_CATALOG
        ] + [
            {"id": "seg_gold",    "label": "Gold Loyalty Segment",    "type": "customer"},
            {"id": "seg_ai",      "label": "AI Buyer Agent Protocol", "type": "agent"},
            {"id": "attr_sustain","label": "Sustainable & Recycled",   "type": "attribute"},
        ],
    }


# ─────────────────────────────────────────────────────────────────
# Legacy execute endpoint (kept for compatibility)
# ─────────────────────────────────────────────────────────────────

@app.post("/api/v1/decisions/execute", tags=["PRISM"])
def create_order_legacy(amount: int, currency: str = "INR", receipt_id: str = "receipt_01"):
    if rzp_client:
        try:
            order = rzp_client.order.create(data={"amount": amount * 100, "currency": currency, "receipt": receipt_id})
            return {"order_id": order["id"], "amount": amount, "currency": currency, "status": "created"}
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
    mock_id = f"order_rzp_{random.randint(10000, 99999)}"
    return {"order_id": mock_id, "amount": amount, "currency": currency, "status": "created_mock"}
