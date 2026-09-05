<div align="center">
  <img src="https://img.shields.io/badge/VIMMERSE-AGENTIC%20COMMERCE-7C3AED?style=for-the-badge&logo=shopify&logoColor=white" alt="Vimmerse Badge" />
  <img src="https://img.shields.io/badge/PRISM%20ENGINE-v2.4%20LIVE-10B981?style=for-the-badge&logo=fastapi&logoColor=white" alt="PRISM Badge" />
  <img src="https://img.shields.io/badge/RAZORPAY-TRUSTED%20EXECUTION-2563EB?style=for-the-badge&logo=razorpay&logoColor=white" alt="Razorpay Badge" />
  <img src="https://img.shields.io/badge/DEVELOPER-MEGA%20VARSHAN-F59E0B?style=for-the-badge&logo=vercel&logoColor=white" alt="Developer Badge" />

  <h1 align="center">Vimmerse</h1>
  <p align="center"><b>The Autonomous Commerce Agent Runtime for Modern Merchants</b></p>
  <p align="center"><i>Deterministic multi-turn negotiation, mathematical margin gating, zero-hallucination policy enforcement, and autonomous Razorpay checkout rails.</i></p>

  <p align="center">
    <a href="#-product-overview">Overview</a> •
    <a href="#-prism-cognitive-decision-architecture">PRISM Architecture</a> •
    <a href="#-the-bar-deterministic-gating">THE BAR™ Gating</a> •
    <a href="#-ai-to-ai-commerce-protocol">AI-to-AI Commerce</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-installation--setup">Setup</a> •
    <a href="#-about-the-developer">Developer</a>
  </p>
</div>

---

## 🚀 Product Overview

**Vimmerse** is an **Agentic Commerce Intelligence Layer** that equips online stores (Shopify, WooCommerce, custom storefronts) with autonomous AI merchants capable of:
- **Multimodal Customer Intent**: Interpreting natural voice input, product image scans, PDF invoice uploads, and text queries.
- **Deterministic Margin-Bounded Negotiation**: Evaluating real-time dynamic pricing strictly bounded by hard merchant cost floors (minimum 15% profit margin above wholesale cost).
- **Strict Policy Gating ("THE BAR™")**: Admissibility gates evaluate profit margins, catalog boundaries, inventory buffers, and fraud anomaly scores before authorizing any price concession.
- **Zero-Hallucination Rejection & Recovery**: Gracefully declining out-of-catalog inquiries without inventing phantom inventory, suggesting verified active categories instead.
- **Trusted Razorpay Financial Execution**: Direct generation of Razorpay Orders, automated webhooks, test payments, and post-transaction chat confirmations.
- **Machine-to-Machine Autonomous Commerce**: Providing an ACP/1.2 & AP2 compliant gateway for external AI buyer agents to negotiate and transact autonomously.

> **We are NOT building another consumer marketplace.**  
> We are building the **cognitive layer above commerce**.  
> - *Shopify hosts the catalog.*  
> - *Razorpay moves the money.*  
> - **Vimmerse provides the autonomous commercial brain.**

---

## 🏗 Architecture Diagram

```mermaid
graph TD
    subgraph Client Layer
        H[Human Shopper (Voice / OCR / Text)] -->|Natural Query| P(PRISM Pipeline)
        A[Autonomous AI Buyer (ACP/1.2 Protocol)] -->|Signed JSON-RPC Contract| P
    end

    subgraph PRISM 6-Stage Cognitive Engine
        P --> L1[Layer 1: Perception Agent (Groq Llama-3.3-70b)]
        L1 --> L2[Layer 2: Knowledge Agent (Semantic Catalog Graph)]
        L2 --> L3[Layer 3: Decision Admissibility Engine ⭐ THE BAR]
        L3 -->|Policy Breach / Lowball Floor Violation| R[Graceful Rejection & Inventory Guard]
        L3 -->|Out-of-Catalog Request| O[Refusal without Hallucination]
        L3 -->|ADMISSIBLE| L4[Layer 4: Uncertainty Engine]
        L4 --> L5[Layer 5: Economic Reasoner (CRO Utility Matrix)]
        L5 --> L6[Layer 6: Execution Gateway]
    end

    subgraph External Financial Rails
        L6 -->|Cryptographic Order Authorization| RZP[Razorpay Orders API]
        RZP -->|Webhook payment.captured| CONF[Agent Payment Receipt Dispatch]
    end
```

---

## 🧠 PRISM Cognitive Decision Architecture

PRISM executes every autonomous commerce transaction across 6 deterministic stages:

| Layer | Component | Engine / Model | Responsibility |
| :--- | :--- | :--- | :--- |
| **Layer 1** | **Perception Agent** | Groq Llama-3.3-70b / Fast JSON Mode | Parses raw text, speech transcripts, and OCR scans into structured intent slots (Category, Budget, Loyalty Tier, Sentiment). |
| **Layer 2** | **Knowledge Agent** | In-Memory Semantic Graph + Vector Tokens | Maps customer budget constraints and multi-word semantic anchors to the optimal catalog SKU while preserving profit viability. |
| **Layer 3** | **Decision Admissibility Engine ⭐** | Deterministic Floor Policy Gating | **"THE BAR"**. Enforces hard mathematical margin floors (`Price ≥ Cost × 1.15`), stock buffers (`Inventory > 5`), fraud ML threshold (<0.05), and catalog boundaries. |
| **Layer 4** | **Uncertainty Engine** | Entropy & Drift Analysis | Computes epistemic and aleatoric confidence bounds. Rejects transactions when drift or hallucination risks exceed tolerance. |
| **Layer 5** | **Economic Reasoner** | CRO Utility Matrix | Optimizes customer utility function $U = 0.35P + 0.30S + 0.20L - 0.15R$ (Margin, Sentiment, Loyalty, Risk) to calculate dynamic, margin-safe discounts. |
| **Layer 6** | **Execution Gateway** | Razorpay Orders API | Creates real Razorpay order payloads with cryptographic order IDs, payment links, and webhook listeners. |

---

## 🛡️ "THE BAR™" — Deterministic Gating & Failure Handling

Unlike typical chatbots that hallucinate discounts or sell below cost, Vimmerse implements strict policy guardrails:

1. **Margin Floor Protection**: If a customer lowballs (e.g. asking for ₹200 on a ₹4,999 item), PRISM **instantly rejects** the request, logs a `MARGIN_FLOOR_BREACH`, and protects merchant profitability.
2. **Catalog Boundary Enforcement**: If a user asks for items outside merchant inventory (e.g. *"I want to buy a luxury passenger helicopter"*), PRISM refuses gracefully without hallucination and directs them to verified categories.
3. **Budget-Aware Calibration**: When given a budget (e.g. *"white running shoes under 4000"*), the engine selects the exact compliant product (*CloudWhite AeroBoost Sprint X* at ₹3,824) rather than attempting to force a higher-tier SKU.
4. **Post-Payment Verification**: Once Razorpay payment succeeds or fails, the agent immediately issues an authenticated transaction receipt or reservation recovery message into the chat session.

---

## 🤖 AI-to-AI Commerce Protocol (ACP/1.2)

Autonomous buyer agents transact directly with Vimmerse using standardized JSON-RPC contracts:

```json
// Buyer Agent Request
POST /api/v1/decisions/process
{
  "agent_id": "buyer_gemini_09",
  "protocol": "ACP/1.2",
  "intent": {
    "category": "Running Shoes",
    "max_price": 4000,
    "loyalty_tier": "Gold"
  },
  "crypto_signature": "0x7f4e2...a9c"
}
```

```json
// Vimmerse PRISM Admissibility Response
{
  "admissibility": "ADMISSIBLE",
  "matched_product": {
    "name": "Vimmerse CloudWhite AeroBoost Sprint X",
    "base_price": 4499,
    "negotiated_price": 3824
  },
  "economic_score": 0.88,
  "negotiation_offer": "Offer authorized: Vimmerse CloudWhite AeroBoost Sprint X priced at ₹3,824 (Catalog: ₹4,499). Ready for Razorpay dispatch."
}
```

---

## 🛠 Tech Stack

### Frontend (`vimmerse-web`)
* **Framework**: Next.js 16 (App Router with Turbopack), React 19, TypeScript
* **Styling & HUD**: Tailwind CSS v4, Custom Obsidian Glassmorphism, Animated Cyber Radar Scanlines
* **Visuals & Canvas**: HTML5 Canvas Particle Telemetry, Lucide Icons, ConfidenceHalo Gauges
* **Payments**: Razorpay Checkout.js Integration with Bidirectional Webhook Callbacks

### Backend (`vimmerse-engine`)
* **Framework**: FastAPI (Python 3.11+)
* **Agentic Graph**: LangGraph Multi-Agent Workflow State Machine
* **LLM Engine**: Groq Cloud (Llama-3.3-70b-versatile with deterministic JSON schema mode)
* **Knowledge Graph**: In-memory semantic relation graph with optional Neo4j enterprise sync
* **Payment Rails**: Razorpay Python SDK (`razorpay.Client`)

---

## ⚙️ Installation & Setup

### Prerequisites
* Node.js 18+ & npm
* Python 3.10+
* (Optional) Razorpay Key ID & Secret (runs with deterministic test fallback if keys are omitted)
* (Optional) Groq API Key (included test key runs out-of-the-box)

### 1. Clone Repository
```bash
git clone https://github.com/Megavarshan/vimmerse.git
cd vimmerse
```

### 2. Run Backend Engine (`vimmerse-engine`)
```bash
cd vimmerse-engine
python -m venv .venv

# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --port 8000
```
Backend API docs available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Run Frontend Web App (`vimmerse-web`)
```bash
cd ../vimmerse-web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👨‍💻 About the Developer

<div align="center">
  <h3>Mega Varshan</h3>
  <p><b>AI Research Engineer</b> • Machine Learning, Big Data & Cloud Architectures</p>
  <p>
    <a href="https://megavarshan.vercel.app/"><b>🌐 Portfolio: megavarshan.vercel.app</b></a> •
    <a href="https://github.com/Megavarshan"><b>💻 GitHub: @Megavarshan</b></a>
  </p>
</div>

Developed independently for the **Razorpay AI Buildathon 2026**.

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
