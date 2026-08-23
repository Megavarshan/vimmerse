from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import razorpay
import os
from dotenv import load_dotenv
from graph import prism_graph

load_dotenv()

app = FastAPI(title="Vimmerse - Agentic Commerce Intelligence Layer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")

rzp_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    rzp_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

class DemoRequest(BaseModel):
    query: str
    budget: float | None = None

@app.get("/")
def read_root():
    return {"status": "Vimmerse PRISM Engine is running"}

@app.post("/api/v1/decisions/process")
async def process_decision(request: DemoRequest):
    """Run the PRISM Cognitive Decision Architecture"""
    initial_state = {
        "input_data": request.query,
        "audit_trail": []
    }
    
    # Execute the LangGraph workflow
    try:
        final_state = prism_graph.invoke(initial_state)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    return {
        "status": "success",
        "result": final_state
    }

@app.post("/api/v1/decisions/execute")
def create_order(amount: int, currency: str = "INR"):
    if not rzp_client:
        raise HTTPException(status_code=500, detail="Razorpay not configured")
    
    data = {
        "amount": amount * 100, # paise
        "currency": currency,
        "receipt": "receipt_01"
    }
    
    try:
        order = rzp_client.order.create(data=data)
        return {"order_id": order["id"], "amount": amount, "currency": currency}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
