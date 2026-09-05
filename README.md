<div align="center">
  <img src="https://img.shields.io/badge/VIMMERSE-AGENTIC%20COMMERCE-7C3AED?style=for-the-badge&logo=shopify&logoColor=white" alt="Vimmerse Badge" />
  <img src="https://img.shields.io/badge/PRISM%20ENGINE-v2.4%20LIVE-10B981?style=for-the-badge&logo=fastapi&logoColor=white" alt="PRISM Badge" />
  <img src="https://img.shields.io/badge/RAZORPAY-TRUSTED%20EXECUTION-2563EB?style=for-the-badge&logo=razorpay&logoColor=white" alt="Razorpay Badge" />
  <img src="https://img.shields.io/badge/DEVELOPER-MEGA%20VARSHAN-F59E0B?style=for-the-badge&logo=vercel&logoColor=white" alt="Developer Badge" />

  <h1 align="center">Vimmerse</h1>
  <p align="center"><b>Autonomous Commerce Agent Runtime for Modern Merchants</b></p>
  <p align="center"><i>Deterministic negotiation, mathematical margin gating, zero-hallucination inventory guardrails, and autonomous Razorpay payment rails.</i></p>
</div>

---

## 💡 What is Vimmerse?

**Vimmerse** is an **Agentic Commerce Runtime** that sits on top of existing e-commerce storefronts (Shopify, WooCommerce, custom webshops). Instead of forcing shoppers through static filters or brittle coupon codes, Vimmerse deploys an autonomous merchant agent that:
- **Negotiates Dynamically**: Calibrates discounts per customer based on loyalty and inventory without ever breaching merchant margin floors.
- **Enforces Policy Gates ("THE BAR™")**: Guarantees zero hallucination and hard profit protection (`Price ≥ Cost × 1.15`). Lowball exploit offers are deterministically rejected.
- **Executes via Razorpay**: Generates real Razorpay payment orders and webhooks, issuing cryptographic receipts directly into the chat session upon payment confirmation.
- **Supports AI Buyers**: Enables autonomous machine-to-machine commerce via standardized **ACP/1.2** (Agent Commerce Protocol) JSON contracts.

> **Shopify builds the store. Razorpay moves the money. Vimmerse gives the store an autonomous commercial brain.**

---

## 🧠 PRISM 6-Stage Decision Pipeline

Every customer interaction is processed deterministically through 6 layers:

```
[Customer Query / AI Buyer RPC]
             │
             ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ L1. Perception Agent    │ Groq Llama-3.3-70b Slot Extraction│
  ├─────────────────────────┼───────────────────────────────────┤
  │ L2. Knowledge Agent     │ Semantic Catalog & Budget Match   │
  ├─────────────────────────┼───────────────────────────────────┤
  │ L3. Decision Engine ⭐  │ THE BAR: Margin Floor & SKU Gating│
  ├─────────────────────────┼───────────────────────────────────┤
  │ L4. Uncertainty Engine  │ Entropy & Drift Risk Bounds       │
  ├─────────────────────────┼───────────────────────────────────┤
  │ L5. Economic Reasoner   │ CRO Utility Matrix Discounting    │
  ├─────────────────────────┼───────────────────────────────────┤
  │ L6. Execution Gateway   │ Razorpay Orders API Authorization │
  └─────────────────────────────────────────────────────────────┘
             │
             ▼
[Authorized Razorpay Checkout Link / Webhook Receipt]
```

### Core Policy Protections ("THE BAR™")
* **Floor Protection**: Rejects offers below cost + 15% margin (e.g. ₹200 for ₹4,999 shoes triggers `REJECTED_FLOOR_BREACH`).
* **Zero Hallucination**: Out-of-catalog inquiries (e.g. helicopters) trigger polite refusals without inventing ghost SKUs.
* **Budget Precision**: Matches queries like *"under ₹4000"* to qualifying catalog products (*CloudWhite AeroBoost at ₹3,824*) rather than overshooting.

---

## 🛠 Tech Stack

* **Frontend**: Next.js 16 (Turbopack, App Router), React 19, TypeScript, Tailwind CSS v4, HTML5 Canvas Particle Telemetry.
* **Backend**: FastAPI (Python 3.11+), LangGraph Multi-Agent State Machine.
* **Inference**: Groq Cloud (Llama-3.3-70b-versatile with deterministic JSON schema mode).
* **Payment Rails**: Razorpay Orders API, Checkout.js, and Webhooks.
---

## 👨‍💻 Developer & Author

<div align="center">
  <h3>Mega Varshan</h3>
  <p><b>AI Research Engineer</b> • Machine Learning, Big Data & Cloud Architectures</p>
  <p>
    <a href="https://megavarshan.vercel.app/"><b>🌐 Portfolio: megavarshan.vercel.app</b></a> •
    <a href="https://github.com/Megavarshan"><b>💻 GitHub: @Megavarshan</b></a>
  </p>
</div>

*Developed for the **Razorpay AI Buildathon 2026**.*

---

## 📜 License
MIT License.
