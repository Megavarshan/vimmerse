import sys
import os
os.environ.setdefault("PYTHONUTF8", "1")
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

import operator
from typing import Annotated, Any, Dict, List, TypedDict, Union
from langgraph.graph import StateGraph, END
import time
import json
import urllib.request
from dotenv import load_dotenv
from pathlib import Path

ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=ENV_PATH, override=True)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
print(f"Loaded GROQ_API_KEY starts with: {GROQ_API_KEY[:15]}...")
GROQ_MODEL = "openai/gpt-oss-120b"  # Ultra-fast inference on Groq


def call_groq_llm(
    prompt: str,
    system_message: str = "You are Vimmerse PRISM AI Merchant Engine.",
    max_tokens: int = 512,
    temperature: float = 0.2,
    json_mode: bool = False,
) -> str:
    """Invokes Groq API for inference."""
    if not GROQ_API_KEY:
        return ""

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "Vimmerse-Engine/1.0",
    }
    payload: Dict[str, Any] = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt},
        ],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=12) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[Groq] API call error: {e}")
        return ""


# ─────────────────────────────────────────────────────────────────
# State schema for the 6-layer PRISM LangGraph workflow
# ─────────────────────────────────────────────────────────────────

class AgentState(TypedDict):
    input_data: str
    channel: str                          # "human" | "ai_buyer"
    parsed_intent: Dict[str, Any]
    semantic_knowledge: Dict[str, Any]
    admissibility_status: str             # "ADMISSIBLE" | "REJECTED"
    admissibility_reasoning: str
    rejection_reason: str                 # shown gracefully on REJECTED
    uncertainty_metrics: Dict[str, float]
    economic_score: float
    negotiation_offer: str
    upsell_offer: str                     # Groq-generated upsell
    payment_details: Dict[str, Any]
    campaign_signal: str                  # AI campaign hint
    audit_trail: Annotated[List[str], operator.add]


# ─────────────────────────────────────────────────────────────────
# LAYER 1 — Multimodal Perception Agent
# ─────────────────────────────────────────────────────────────────

def perception_agent(state: AgentState) -> Dict:
    print("▶ L1 Perception Agent")
    ts = time.strftime("%H:%M:%S")
    user_input = state.get("input_data", "")
    channel = state.get("channel", "human")

    # High-precision deterministic NLP extraction as ground truth
    extracted_max_price = None
    import re
    price_matches = re.findall(r'(?:under|below|less than|within|max|budget|₹|\bfor\b)\s*₹?\s*(\d{3,6})', user_input, re.IGNORECASE)
    if price_matches:
        try:
            extracted_max_price = float(price_matches[0])
        except Exception:
            pass
    if not extracted_max_price:
        num_matches = re.findall(r'₹?\s*(\d{3,6})\b', user_input)
        if num_matches:
            try:
                extracted_max_price = float(num_matches[0])
            except Exception:
                pass

    extracted_loyalty = "Gold" if re.search(r'\bgold\b', user_input, re.I) else \
                        "Silver" if re.search(r'\bsilver\b', user_input, re.I) else \
                        "Platinum" if re.search(r'\bplatinum\b', user_input, re.I) else "Standard"

    groq_res = call_groq_llm(
        prompt=(
            f"Extract structured JSON from this {'AI buyer contract' if channel == 'ai_buyer' else 'customer query'}:\n"
            f"'{user_input}'\n"
            "Return ONLY valid JSON with keys: category, product, max_price (number), "
            "loyalty_tier (string), sentiment (string), intent_type (inquiry|purchase|bulk_quote)"
        ),
        system_message=(
            "You are a multimodal perception parser. Return ONLY valid compact JSON. "
            "No markdown, no explanation — just the JSON object."
        ),
        max_tokens=1024,
        json_mode=True,
    )

    # Base parsed object with deterministic grounding
    parsed: Dict[str, Any] = {
        "intent_type": "purchase",
        "category": "Running Shoes" if re.search(r'shoe|sneaker|runner|footwear|kicks', user_input, re.I) else "Everyday Gear",
        "product": user_input,
        "max_price": extracted_max_price,
        "loyalty_tier": extracted_loyalty,
        "sentiment": "High Intent",
    }

    if groq_res:
        try:
            llm_json = json.loads(groq_res)
            parsed.update(llm_json)
        except Exception:
            pass

    # Ensure deterministic regex extraction always protects budget and loyalty
    if extracted_max_price is not None:
        parsed["max_price"] = extracted_max_price
    if extracted_loyalty != "Standard":
        parsed["loyalty_tier"] = extracted_loyalty

    price_str = f"₹{parsed.get('max_price'):,.0f}" if parsed.get('max_price') else 'None'
    return {
        "parsed_intent": parsed,
        "audit_trail": [
            f"[{ts}] 👁 Perception Agent (L1): Extracted intent — "
            f"category='{parsed.get('category')}', max_price={price_str}, "
            f"loyalty='{parsed.get('loyalty_tier')}', sentiment='{parsed.get('sentiment')}'."
        ],
    }


# ─────────────────────────────────────────────────────────────────
# LAYER 2 — Semantic Commerce Graph Agent
# ─────────────────────────────────────────────────────────────────

PRODUCT_CATALOG = [
    # ── Kids & Toys (STEM, Drones, Interactive, Creative) ────────
    {
        "id": "Prod_STEM_Bot",
        "name": "RoboKid AI STEM Robotics Kit",
        "category": "Toys & Kids",
        "base_price": 2999,
        "cost_price": 1400,
        "inventory": 64,
        "margin_pct": 53,
        "tags": ["toy", "toys", "kids", "robot", "stem", "education", "child", "children", "coding"],
    },
    {
        "id": "Prod_Drone_Mini",
        "name": "Nebula Stunt Drone Racer Mini",
        "category": "Toys & Kids",
        "base_price": 1999,
        "cost_price": 950,
        "inventory": 110,
        "margin_pct": 52,
        "tags": ["drone", "toy", "toys", "rc", "kids", "racer", "flying", "remote control"],
    },
    {
        "id": "Prod_Mag_Tiles",
        "name": "MagnoPlay 3D Magnetic Tiles (100 pcs)",
        "category": "Toys & Kids",
        "base_price": 1499,
        "cost_price": 600,
        "inventory": 85,
        "margin_pct": 60,
        "tags": ["blocks", "magnetic", "tiles", "toy", "toys", "kids", "puzzle", "toddler", "building"],
    },
    {
        "id": "Prod_Astro_Telescope",
        "name": "AstroScope Kids Optical Telescope (70mm)",
        "category": "Toys & Kids",
        "base_price": 2499,
        "cost_price": 1100,
        "inventory": 42,
        "margin_pct": 56,
        "tags": ["telescope", "space", "astronomy", "kids", "toy", "science", "stem", "stars"],
    },
    {
        "id": "Prod_Dino_Dig",
        "name": "Jurassic Dig & Discover Fossil Science Kit",
        "category": "Toys & Kids",
        "base_price": 899,
        "cost_price": 350,
        "inventory": 130,
        "margin_pct": 61,
        "tags": ["dinosaur", "fossil", "archaeology", "excavation", "kids", "toy", "stem"],
    },

    # ── Electronics & Consumer Tech ──────────────────────────────
    {
        "id": "Prod_Earbuds_Pro",
        "name": "SonicPod Pro ANC Wireless Earbuds",
        "category": "Electronics",
        "base_price": 3499,
        "cost_price": 1700,
        "inventory": 92,
        "margin_pct": 51,
        "tags": ["earbuds", "audio", "anc", "wireless", "headphones", "bluetooth", "music", "gadget", "sound"],
    },
    {
        "id": "Prod_Watch_Aero",
        "name": "AeroWatch Ultra Smartwatch (OLED)",
        "category": "Electronics",
        "base_price": 4999,
        "cost_price": 2700,
        "inventory": 48,
        "margin_pct": 46,
        "tags": ["watch", "smartwatch", "fitness tracker", "tech", "wearable", "oled", "heart rate"],
    },
    {
        "id": "Prod_MagCharge_3in1",
        "name": "MagCharge 3-in-1 Foldable Station",
        "category": "Electronics",
        "base_price": 1899,
        "cost_price": 850,
        "inventory": 120,
        "margin_pct": 55,
        "tags": ["charger", "wireless", "charging", "magsafe", "iphone", "dock", "apple", "stand"],
    },
    {
        "id": "Prod_Gamer_Mic",
        "name": "HyperBeam Studio Condenser USB Mic",
        "category": "Electronics",
        "base_price": 2999,
        "cost_price": 1300,
        "inventory": 55,
        "margin_pct": 57,
        "tags": ["mic", "microphone", "streaming", "podcast", "studio", "audio", "usb", "gaming"],
    },
    {
        "id": "Prod_Pocket_Power",
        "name": "TitanVolt 20,000mAh 65W GaN Power Bank",
        "category": "Electronics",
        "base_price": 2299,
        "cost_price": 1050,
        "inventory": 140,
        "margin_pct": 54,
        "tags": ["power bank", "battery", "fast charging", "gan", "portable charger", "usb-c"],
    },

    # ── Fitness & Running ─────────────────────────────────────────
    {
        "id": "Prod_UltraBoost_White",
        "name": "Vimmerse CloudWhite AeroBoost Sprint X",
        "category": "Running Shoes",
        "base_price": 4499,
        "cost_price": 2400,
        "inventory": 115,
        "margin_pct": 46,
        "tags": ["white", "shoes", "running", "sneakers", "white running shoes", "white shoes", "aeroboost", "sports", "footwear", "jogging", "trainers"],
    },
    {
        "id": "Prod_UltraBoost_X",
        "name": "Vimmerse UltraBoost Sprint X (Midnight Edition)",
        "category": "Running Shoes",
        "base_price": 4999,
        "cost_price": 2800,
        "inventory": 142,
        "margin_pct": 44,
        "tags": ["shoes", "running", "sneakers", "ultraboost", "sports", "footwear", "jogging", "gym", "trainers"],
    },
    {
        "id": "Prod_Trail_Blazer",
        "name": "ApexGrip All-Terrain Trail Running Shoes",
        "category": "Running Shoes",
        "base_price": 5499,
        "cost_price": 3100,
        "inventory": 60,
        "margin_pct": 43,
        "tags": ["trail", "hiking", "all terrain", "outdoor", "grip", "shoes", "running"],
    },
    {
        "id": "Prod_Protein_Vegan",
        "name": "Vegan Power Protein (2kg)",
        "category": "Nutrition",
        "base_price": 2700,
        "cost_price": 1500,
        "inventory": 88,
        "margin_pct": 44,
        "tags": ["protein", "whey", "vegan", "nutrition", "workout", "powder", "supplements", "diet"],
    },
    {
        "id": "Prod_Creatine_Pure",
        "name": "Creapure Micronized Creatine Monohydrate (500g)",
        "category": "Nutrition",
        "base_price": 1199,
        "cost_price": 500,
        "inventory": 175,
        "margin_pct": 58,
        "tags": ["creatine", "strength", "preworkout", "muscle", "nutrition", "powder", "supplements"],
    },
    {
        "id": "Prod_Yoga_Mat",
        "name": "Eco Grip Yoga Mat (6mm)",
        "category": "Fitness Accessories",
        "base_price": 1299,
        "cost_price": 550,
        "inventory": 95,
        "margin_pct": 58,
        "tags": ["yoga", "mat", "exercise", "pilates", "fitness", "eco", "workout mat"],
    },

    # ── Everyday Accessories & Gear ───────────────────────────────
    {
        "id": "Prod_Flask_Hydro",
        "name": "Smart Hydration Flask (1.5L)",
        "category": "Equipment",
        "base_price": 1499,
        "cost_price": 700,
        "inventory": 212,
        "margin_pct": 53,
        "tags": ["flask", "bottle", "water bottle", "hydration", "thermos", "smart bottle", "insulated"],
    },
    {
        "id": "Prod_Socks_Pro",
        "name": "Pro Seamless Wool Socks (3-Pack)",
        "category": "Accessories",
        "base_price": 499,
        "cost_price": 200,
        "inventory": 430,
        "margin_pct": 60,
        "tags": ["socks", "wool", "clothing", "seamless", "running socks", "apparel", "feet"],
    },
    {
        "id": "Prod_Urban_Pack",
        "name": "CyberShield Waterproof EDC Commuter Backpack (22L)",
        "category": "Accessories",
        "base_price": 3299,
        "cost_price": 1450,
        "inventory": 78,
        "margin_pct": 56,
        "tags": ["backpack", "bag", "laptop bag", "waterproof", "travel", "commute", "edc"],
    },
]

def knowledge_agent(state: AgentState) -> Dict:
    print("▶ L2 Knowledge Agent")
    ts = time.strftime("%H:%M:%S")
    intent = state.get("parsed_intent", {})
    category = (intent.get("category") or "").lower()
    user_query = (state.get("input_data") or "").lower()
    intent_product = (intent.get("product") or "").lower()
    full_text = f"{user_query} {category} {intent_product}".lower()

    # Enhanced Semantic Commerce Graph Scorer
    STOPWORDS = {
        "need", "want", "give", "show", "have", "with", "from", "under", "below",
        "less", "than", "over", "best", "good", "real", "like", "price", "order",
        "buy", "purchase", "for", "my", "me", "i", "the", "a", "an", "right", "now"
    }

    import re
    query_words = set(re.findall(r'[a-z0-9]+', user_query.lower())) - STOPWORDS
    budget = intent.get("max_price")

    best_match = None
    best_score = 0

    for p in PRODUCT_CATALOG:
        score = 0
        cat_lower = p["category"].lower()
        name_lower = p["name"].lower()
        name_words = set(re.findall(r'[a-z0-9]+', name_lower)) - STOPWORDS
        tags = [t.lower() for t in p.get("tags", [])]

        # 1. Multi-word phrase tag match (highest precision semantic anchor)
        for tag in tags:
            if " " in tag and tag in full_text:
                score += 25
            elif tag in query_words:
                score += 8

        # 2. Direct & substring word matches in product name
        for qw in query_words:
            if len(qw) > 2:
                for nw in name_words:
                    if qw == nw:
                        score += 12
                    elif qw in nw:  # e.g., 'white' matches inside 'cloudwhite'
                        score += 10

        # 3. Category match
        if category and (category in cat_lower or cat_lower in category):
            score += 6

        # 4. Budget & merchant margin fit bonus
        cost = float(p.get("cost_price", 0))
        base = float(p.get("base_price", 0))
        floor = cost * 1.15
        if budget is not None and budget > 0:
            if floor <= budget <= base:
                score += 15  # Optimal product: fits customer budget while preserving profit
            elif budget > base:
                score += 8   # Affordably under budget

        if score > best_score:
            best_score = score
            best_match = p

    # If the user explicitly asks for items outside merchant categories, or score is too weak
    out_of_domain_words = [r"\bairplane\b", r"\bhelicopter\b", r"\bboeing\b", r"\baircraft\b", r"\bcar\b", r"\bbmw\b", r"\bhouse\b", r"\bvilla\b", r"\bpet\b", r"\bdog\b", r"\bcat\b", r"\bgold coin\b", r"\bcrypto\b", r"\bweapon\b"]
    explicit_out_of_domain = any(re.search(pat, full_text) for pat in out_of_domain_words)
    is_out_of_catalog = explicit_out_of_domain or best_score < 6 or best_match is None

    if is_out_of_catalog:
        matched = PRODUCT_CATALOG[0]
        knowledge = {
            **matched,
            "out_of_catalog": True,
            "query_requested": user_query,
            "relationships": ["Item not present in merchant verified inventory"],
            "bundle_product": PRODUCT_CATALOG[1],
        }
        return {
            "semantic_knowledge": knowledge,
            "audit_trail": [
                f"[{ts}] 📚 Knowledge Agent (L2): Query '{user_query}' out of merchant catalog (score={best_score}, out_of_domain={explicit_out_of_domain}). "
                f"Flagged for Admissibility Engine policy check."
            ],
        }

    # Best matched product
    # Bundle pairing: Pick a complementary product from a different category
    bundle = next((b for b in PRODUCT_CATALOG if b["id"] != best_match["id"] and b["category"] != best_match["category"]), PRODUCT_CATALOG[-1])

    knowledge = {
        **best_match,
        "out_of_catalog": False,
        "relationships": [
            f"Frequently Bundled with {bundle['name']}",
            "Repeat Purchase Rate: 91%",
            "Authenticity: Verified Razorpay Merchant Stock",
        ],
        "bundle_product": bundle,
    }

    return {
        "semantic_knowledge": knowledge,
        "audit_trail": [
            f"[{ts}] 📚 Knowledge Agent (L2): Matched '{best_match['name']}' in '{best_match['category']}' "
            f"(Catalog ₹{best_match['base_price']:,}, Margin {best_match['margin_pct']}%, "
            f"Inventory: {best_match['inventory']} units, match_score={best_score})."
        ],
    }


# ─────────────────────────────────────────────────────────────────
# LAYER 3 — Decision Admissibility Engine ⭐ (THE BAR)
# ─────────────────────────────────────────────────────────────────

FLOOR_MARGIN_PCT = 15.0   # Merchant policy: minimum 15% margin above cost

def decision_admissibility_engine(state: AgentState) -> Dict:
    print("▶ L3 Decision Admissibility Engine ⭐")
    ts = time.strftime("%H:%M:%S")
    intent  = state.get("parsed_intent", {})
    product = state.get("semantic_knowledge", {})

    # Check 1: Out of Catalog check
    if product.get("out_of_catalog", False):
        user_req = state.get('input_data', 'item')
        reason = (
            f"Requested item '{user_req}' is not in Vimmerse catalog. "
            f"Active merchant categories: Toys & Kids STEM, Electronics & Tech, Fitness & Running, and Everyday Accessories."
        )
        return {
            "admissibility_status": "OUT_OF_CATALOG",
            "admissibility_reasoning": reason,
            "rejection_reason": reason,
            "audit_trail": [
                f"[{ts}] ⛔ Decision Engine (L3 ⭐): OUT_OF_CATALOG — {reason}"
            ],
        }

    raw_max_price = intent.get("max_price")
    budget = float(raw_max_price) if raw_max_price is not None else float(product.get("base_price", 9999))
    cost_price = float(product.get("cost_price", 2800))
    inventory  = int(product.get("inventory", 100))

    floor_price = cost_price * (1 + FLOOR_MARGIN_PCT / 100)

    # Policy checks
    margin_ok   = budget >= floor_price
    stock_ok    = inventory > 5
    fraud_score = 0.02   # Simulated ML model
    fraud_ok    = fraud_score < 0.05

    if not margin_ok:
        reason = (
            f"Buyer offered/budgeted ₹{budget:.0f} which breaches the strict floor price ₹{floor_price:.0f} "
            f"(Cost ₹{cost_price:.0f} + minimum {FLOOR_MARGIN_PCT}% margin). "
            f"Transaction rejected to protect merchant profitability."
        )
        return {
            "admissibility_status": "REJECTED",
            "admissibility_reasoning": reason,
            "rejection_reason": reason,
            "audit_trail": [
                f"[{ts}] ⛔ Decision Engine (L3 ⭐): REJECTED (MARGIN_BREACH) — {reason}"
            ],
        }

    if not stock_ok:
        reason = f"Inventory critically depleted ({inventory} units). Order cannot be fulfilled safely."
        return {
            "admissibility_status": "REJECTED",
            "admissibility_reasoning": reason,
            "rejection_reason": reason,
            "audit_trail": [
                f"[{ts}] ⛔ Decision Engine (L3 ⭐): REJECTED (STOCK_DEPLETED) — {reason}"
            ],
        }

    reasoning = (
        f"Budget ₹{budget:.0f} ≥ floor ₹{floor_price:.0f} | "
        f"Stock {inventory} > 5 | Fraud score {fraud_score:.2f} < 0.05 → All checks PASSED."
    )
    return {
        "admissibility_status": "ADMISSIBLE",
        "admissibility_reasoning": reasoning,
        "rejection_reason": "",
        "audit_trail": [
            f"[{ts}] ✅ Decision Engine (L3 ⭐): ADMISSIBLE — {reasoning}"
        ],
    }


# ─────────────────────────────────────────────────────────────────
# LAYER 4 — Uncertainty Intelligence
# ─────────────────────────────────────────────────────────────────

def uncertainty_engine(state: AgentState) -> Dict:
    print("▶ L4 Uncertainty Engine")
    ts = time.strftime("%H:%M:%S")
    metrics = {
        "epistemic_uncertainty":  0.04,
        "aleatoric_uncertainty":  0.08,
        "predictive_entropy":     0.12,
        "action_verdict":         "SAFE_TO_NEGOTIATE",
        "confidence_score":       0.96,
    }
    return {
        "uncertainty_metrics": metrics,
        "audit_trail": [
            f"[{ts}] 🧮 Uncertainty Engine (L4): epistemic=0.04, aleatoric=0.08, "
            f"entropy=0.12 → verdict=SAFE_TO_NEGOTIATE (confidence 96%)."
        ],
    }


# ─────────────────────────────────────────────────────────────────
# LAYER 5 — Economic Reasoner (CRO Utility)
# ─────────────────────────────────────────────────────────────────

def economic_reasoner(state: AgentState) -> Dict:
    print("▶ L5 Economic Reasoner")
    ts = time.strftime("%H:%M:%S")
    intent  = state.get("parsed_intent", {})
    product = state.get("semantic_knowledge", {})

    loyalty_val = intent.get("loyalty_tier") or "Standard"
    loyalty = str(loyalty_val).lower()
    L = 0.90 if "gold" in loyalty else 0.70 if "silver" in loyalty else 0.55

    base  = float(product.get("base_price",  4999))
    cost  = float(product.get("cost_price",  2800))
    stock = int(product.get("inventory",     100))

    P = min((base - cost) / base, 1.0)        # profit ratio
    S = 0.95 if "high intent" in str(intent.get("sentiment", "")).lower() else 0.75
    R = 0.02                                   # risk score

    U = round(0.35 * P + 0.30 * S + 0.20 * L - 0.15 * R, 4)

    # Compute negotiated price based on utility & loyalty
    loyalty_discount = 0.10 if "gold" in loyalty else 0.05
    stock_discount   = 0.05 if stock > 100 else 0.0
    total_discount   = loyalty_discount + stock_discount

    # Standard formulaic discounted price
    calculated_price = int(base * (1 - total_discount))

    # Strict floor enforcement (minimum 15% margin)
    floor_price = int(cost * 1.15)
    max_discount_allowed = 0.25  # Merchant max discount cap (25%)
    hard_min_price = max(floor_price, int(base * (1 - max_discount_allowed)))

    # Customer budget awareness (e.g., 'under 4000')
    raw_budget = intent.get("max_price")
    if raw_budget is not None and raw_budget > 0:
        budget = int(raw_budget)
        if budget >= hard_min_price and budget < calculated_price:
            # Respect customer budget if it's within merchant profit floor!
            # E.g., customer asked under 4000; product 4499 with 15% discount is 3824 <= 4000.
            # If calculated price is above budget but budget is above floor, offer the budget or a sweet spot!
            negotiated_price = max(hard_min_price, min(calculated_price, budget - 1))
        elif calculated_price <= budget:
            negotiated_price = calculated_price
        else:
            negotiated_price = calculated_price
    else:
        negotiated_price = max(hard_min_price, calculated_price)

    return {
        "economic_score":  U,
        "semantic_knowledge": {**product, "negotiated_price": negotiated_price},
        "audit_trail": [
            f"[{ts}] 💰 Economic Reasoner (L5): U={U} "
            f"(P={P:.2f}·0.35 + S={S:.2f}·0.30 + L={L:.2f}·0.20 − R={R:.2f}·0.15). "
            f"Calculated discount {round((1 - negotiated_price/base)*100)}% (Floor ₹{floor_price}) → Final Price ₹{negotiated_price}."
        ],
    }


# ─────────────────────────────────────────────────────────────────
# Negotiation Agent (Groq-powered counter-offer generation)
# ─────────────────────────────────────────────────────────────────

def negotiation_agent(state: AgentState) -> Dict:
    print("▶ Negotiation Agent")
    ts    = time.strftime("%H:%M:%S")
    intent   = state.get("parsed_intent", {})
    product  = state.get("semantic_knowledge", {})
    channel  = state.get("channel", "human")
    u_score  = state.get("economic_score", 0.88)

    name       = product.get("name", "the product")
    cat_price  = product.get("base_price", 4999)
    neg_price  = product.get("negotiated_price", int(cat_price * 0.88))
    loyalty    = intent.get("loyalty_tier") or "Standard"

    if channel == "ai_buyer":
        prompt = (
            f"You are a Vimmerse AI Merchant Agent responding to an autonomous AI buyer. "
            f"Generate a terse JSON-structured commercial response (max 2 sentences) "
            f"offering '{name}' at ₹{neg_price} (from catalog ₹{cat_price}). "
            f"Utility score: {u_score:.2f}. Mention PRISM decision code."
        )
        system = "You are a machine-to-machine API merchant. Reply concisely, reference the PRISM engine."
    else:
        prompt = (
            f"You are Vimmerse, an elite AI merchant. A {loyalty} tier customer asked: "
            f"'{state.get('input_data', '')}'. "
            f"Offer them '{name}' at ₹{neg_price} (catalog ₹{cat_price}, saving ₹{cat_price - neg_price}). "
            f"Write one friendly, excited sentence that closes the deal. Include the savings. "
            f"End with 'Ready to process via Razorpay?' — max 40 words."
        )
        system = "You are a world-class AI sales executive. Be persuasive, warm, and precise."

    groq_offer = call_groq_llm(prompt, system_message=system, max_tokens=512, temperature=0.4)
    if not groq_offer:
        groq_offer = (
            f"As a {loyalty} member with high stock availability, I'm excited to offer you "
            f"the {name} for ₹{neg_price:,} — saving ₹{cat_price - neg_price:,} off catalog! "
            f"Ready to process via Razorpay?"
        )

    return {
        "negotiation_offer": groq_offer,
        "audit_trail": [
            f"[{ts}] 🤝 Negotiation Agent: Groq {GROQ_MODEL} generated {'M2M contract' if channel == 'ai_buyer' else 'personalised counter-offer'} "
            f"at ₹{neg_price:,} (−{round((1 - neg_price/cat_price)*100)}% off ₹{cat_price:,})."
        ],
    }


# ─────────────────────────────────────────────────────────────────
# Upsell Agent (Groq-powered cross-sell / bundle offer)
# ─────────────────────────────────────────────────────────────────

def upsell_agent(state: AgentState) -> Dict:
    print("▶ Upsell Agent")
    ts      = time.strftime("%H:%M:%S")
    product = state.get("semantic_knowledge", {})
    bundle  = product.get("bundle_product", PRODUCT_CATALOG[2])

    prompt = (
        f"A customer just agreed to buy '{product.get('name')}'. "
        f"Suggest adding '{bundle['name']}' (₹{bundle['base_price']}) as a bundle. "
        f"Write one compelling upsell sentence, max 25 words."
    )
    upsell = call_groq_llm(
        prompt,
        system_message="You are a conversion-obsessed upsell agent. Be short and compelling.",
        max_tokens=256,
        temperature=0.5,
    )
    if not upsell:
        upsell = f"⚡ Bundle Alert: Add {bundle['name']} for just ₹{bundle['base_price']} — customers who bought this saved ₹200 on returns."

    return {
        "upsell_offer": upsell,
        "audit_trail": [
            f"[{ts}] 📦 Upsell Agent: Generated cross-sell offer for '{bundle['name']}' (₹{bundle['base_price']})."
        ],
    }


# ─────────────────────────────────────────────────────────────────
# LAYER 6 — Trusted Execution Agent (Razorpay payload preparation)
# ─────────────────────────────────────────────────────────────────

def execution_agent(state: AgentState) -> Dict:
    print("▶ L6 Execution Agent")
    ts      = time.strftime("%H:%M:%S")
    product = state.get("semantic_knowledge", {})

    amount = product.get("negotiated_price") or product.get("base_price", 4999)

    payment = {
        "status":    "authorized",
        "amount":    amount,
        "currency":  "INR",
        "order_id":  f"prism_ord_{int(time.time())}",
        "product_id": product.get("id", ""),
        "prism_admissibility": "ADM_PASSED_OK",
    }

    return {
        "payment_details": payment,
        "audit_trail": [
            f"[{ts}] 🔐 Execution Agent (L6): Razorpay Order payload authorized — "
            f"₹{amount:,} INR | Order: {payment['order_id']} | PRISM Code: ADM_PASSED_OK."
        ],
    }


# ─────────────────────────────────────────────────────────────────
# Router — branches ADMISSIBLE vs REJECTED at Layer 3
# ─────────────────────────────────────────────────────────────────

def admissibility_router(state: AgentState) -> str:
    return "continue" if state.get("admissibility_status") == "ADMISSIBLE" else "end"


# ─────────────────────────────────────────────────────────────────
# Build LangGraph Workflow
# ─────────────────────────────────────────────────────────────────

workflow = StateGraph(AgentState)

workflow.add_node("perception",  perception_agent)
workflow.add_node("knowledge",   knowledge_agent)
workflow.add_node("decision",    decision_admissibility_engine)
workflow.add_node("uncertainty", uncertainty_engine)
workflow.add_node("economic",    economic_reasoner)
workflow.add_node("negotiation", negotiation_agent)
workflow.add_node("upsell",      upsell_agent)
workflow.add_node("execution",   execution_agent)

workflow.set_entry_point("perception")
workflow.add_edge("perception",  "knowledge")
workflow.add_edge("knowledge",   "decision")

workflow.add_conditional_edges(
    "decision",
    admissibility_router,
    {"continue": "uncertainty", "end": END},
)

workflow.add_edge("uncertainty", "economic")
workflow.add_edge("economic",    "negotiation")
workflow.add_edge("negotiation", "upsell")
workflow.add_edge("upsell",      "execution")
workflow.add_edge("execution",   END)

prism_graph = workflow.compile()
