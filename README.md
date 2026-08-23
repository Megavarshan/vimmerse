<div align="center">
  <img src="https://via.placeholder.com/1200x400/0B1020/7C3AED?text=Vimmerse" alt="Vimmerse Hero Banner" />

  <h1>Vimmerse</h1>
  <p><b>Immerse Intelligence into Commerce</b></p>
  <p><i>The Agentic Commerce Intelligence Layer powered by the PRISM Cognitive Decision Architecture.</i></p>

  <p>
    <a href="#product-overview">Overview</a> •
    <a href="#prism-architecture">PRISM Engine</a> •
    <a href="#multi-agent-workflow">Multi-Agent Workflow</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a>
  </p>
</div>

---

## 🚀 Product Overview

**Vimmerse** is an **Agentic Commerce Intelligence Layer** that plugs into existing e-commerce platforms (Shopify, WooCommerce, Magento, custom stores) and transforms them into autonomous AI merchants capable of understanding multimodal customer intent, negotiating intelligently, making explainable commercial decisions, and executing trusted Razorpay transactions.

**We are NOT building another Amazon. We are building the AI layer above commerce.**

Commerce today is designed for humans. Commerce tomorrow will involve AI buyers purchasing from AI merchants. Vimmerse enables that future by introducing a proprietary decision engine that reasons before money moves: **Every payment deserves intelligence before execution.**

## 💡 Why Vimmerse?

Merchants do not need another chatbot; they need an AI Chief Revenue Officer.

Ordinary commerce platforms can display products, accept payments, and show analytics. Vimmerse gives these platforms an **autonomous commercial brain**. When you plug in Vimmerse, you automatically get:
- A 24x7 AI Sales Executive.
- Multimodal Shopping (Voice, Image, Text, PDF).
- Dynamic, margin-aware negotiation.
- Personalized upselling and cross-selling.
- Full readiness for autonomous AI-to-AI Commerce.

---

## 🏗 Architecture Diagram

```mermaid
graph TD
    subgraph Customer Interactions
        A[Human Buyer] --> |Voice/Text/Image| B(Vimmerse Multimodal Agent)
        Z[AI Buyer Agent] --> |Structured Intent| B
    end

    subgraph Vimmerse Intelligence Layer
        B --> C[PRISM Cognitive Decision Engine]
        C <--> D[(Neo4j Semantic Commerce Graph)]
        C <--> E[(pgvector Embeddings)]
    end

    subgraph External Platforms
        C -->|Execute| F[Razorpay Checkout]
        C -->|Sync| G[Shopify / WooCommerce]
    end
```

---

## 🧠 PRISM Cognitive Decision Architecture

PRISM is the proprietary cognitive reasoning architecture that powers every autonomous decision inside Vimmerse. It operates in six distinct layers:

1. **Multimodal Perception**: Parses voice, text, product images, and PDFs into structured semantic entities (budget, delivery date, emotional intent).
2. **Semantic Commerce Graph**: Uses a Neo4j knowledge graph (not just SQL rows) to understand relationships between products (e.g., sustainable, luxury, frequently bundled).
3. **Decision Admissibility Engine ⭐**: The core innovation. Before executing any financial action, PRISM determines if the decision is **admissible** by evaluating merchant policy, minimum margins, loyalty, and inventory constraints.
4. **Uncertainty Intelligence**: Computes epistemic/aleatoric uncertainty and decision entropy. Only safe actions are executed.
5. **Economic Reasoner**: Optimizes multiple commercial objectives simultaneously (Profit, Customer Satisfaction, Conversion Probability, Lifetime Value).
6. **Trusted Execution**: Safely generates Razorpay Orders and Payment Links only after PRISM approval.

---

## 🤖 Multi-Agent Workflow

Vimmerse orchestrates specialized autonomous agents using **LangGraph**:

- 👁️ **Perception Agent**: Handles OCR, speech recognition, and image understanding.
- 📚 **Knowledge Agent**: Responsible for Neo4j queries, vector retrieval, and product reasoning.
- ⚖️ **Decision Agent**: Implements the PRISM admissibility logic.
- 🤝 **Negotiation Agent**: Counters offers, generates personalized discounts, and protects margins dynamically without hardcoded rules.
- 🛒 **Commerce Agent**: Handles product recommendations, inventory checks, and delivery estimations.
- 💳 **Execution Agent**: Solely responsible for interacting with Razorpay APIs and creating checkout links.
- 📜 **Audit Agent**: Creates a replayable, inspectable decision timeline.

---

## ✨ Feature Showcase

- **Intelligent Merchant Agent**: A 24/7 autonomous sales executive.
- **Multimodal Commerce**: Search and buy using voice, images, or PDFs.
- **Dynamic Negotiation**: Dynamically calculates discounts based on real-time margin, loyalty, and inventory data.
- **Decision Explorer**: A timeline showing every reasoning step, like Git history for AI cognition.
- **Merchant Brain Dashboard**: Premium analytics showing revenue uplift, AI conversions, and decision entropy.
- **Confidence Halo**: UI element that glows green/amber/red based on the AI's confidence in its recommendation.
- **Counterfactual Simulator**: Ask "What if inventory drops 50%?" and instantly see how PRISM adjusts its commercial decisions.

---

## 📸 Screenshots

*(Replace with actual screenshots of the Vimmerse platform)*

| Merchant Brain Dashboard | Live Commerce Studio |
| :---: | :---: |
| <img src="https://via.placeholder.com/600x400/0B1020/2563EB?text=Dashboard" alt="Dashboard" /> | <img src="https://via.placeholder.com/600x400/0B1020/10B981?text=Live+Commerce+Studio" alt="Studio" /> |

| Semantic Knowledge Graph | Decision Explorer Timeline |
| :---: | :---: |
| <img src="https://via.placeholder.com/600x400/0B1020/7C3AED?text=Neo4j+Graph" alt="Graph" /> | <img src="https://via.placeholder.com/600x400/0B1020/F8FAFC?text=Decision+Audit" alt="Decisions" /> |

---

## 🛠 Tech Stack

**Frontend**
- Next.js 15, React 19
- Tailwind CSS, Framer Motion
- Three.js, React Flow

**Backend / AI**
- Python, FastAPI
- LangGraph (Agent Orchestration)
- Qwen 3, Qwen VL, Whisper (Models)
- Celery, Redis

**Knowledge & Data**
- Neo4j (Semantic Graph)
- PostgreSQL & pgvector

**Payments**
- Razorpay Orders, Links & Webhooks

---

## ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/vimmerse.git
   cd vimmerse
   ```

2. **Backend Setup (PRISM Engine):**
   ```bash
   cd prism-aura-engine
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .\.venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. **Frontend Setup (Vimmerse Web):**
   ```bash
   cd ../prism-aura-web
   npm install
   npm run dev
   ```

4. **Infrastructure (Neo4j, Postgres, Redis):**
   ```bash
   cd ..
   docker-compose up -d
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the `prism-aura-engine` directory:

```env
# Razorpay Credentials
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# AI Models
OPENAI_API_KEY=your_openai_api_key

# Databases
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
POSTGRES_URL=postgresql://user:password@localhost:5432/vimmerse
REDIS_URL=redis://localhost:6379/0
```

---

## 📁 Folder Structure

```
vimmerse/
├── prism-aura-web/       # Next.js 15 Frontend
│   ├── src/app/          # Pages (Dashboard, Studio, Analytics, Graph)
│   ├── src/components/   # Premium UI components (Glassmorphism, Framer Motion)
│   └── public/           # Static assets
├── prism-aura-engine/    # FastAPI Backend
│   ├── agents/           # LangGraph Multi-Agent Workflows
│   ├── graph.py          # PRISM Engine Implementation
│   └── main.py           # Razorpay API integration
└── docker-compose.yml    # Database infrastructure
```

---

## 🌐 API Routes

- `POST /api/v1/decisions/process`: Accepts multimodal input and triggers the PRISM Cognitive Engine.
- `POST /api/v1/decisions/execute`: Generates a Razorpay Order upon successful agent negotiation.

---

## 🔮 Future Roadmap

- **Q4 2026**: General Availability of AI-to-AI Autonomous Transactions.
- **Q1 2027**: 1-Click Integrations with Shopify, WooCommerce, and Magento via OAuth.
- **Q2 2027**: Counterfactual Simulation Dashboard for real-time scenario testing.

---

## 🤝 Team & License

Built with ❤️ for the **Antigravity Razorpay Buildathon 2026**.

**License**: MIT
