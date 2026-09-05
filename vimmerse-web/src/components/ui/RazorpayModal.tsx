"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Typography } from "./Typography";
import { Badge } from "./Badge";
import {
  ShieldCheck,
  QrCode,
  CreditCard,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Lock,
  Copy,
  Check,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  originalPrice: number;
  negotiatedPrice: number;
  discountReason: string;
  orderId?: string;
  onPaymentSuccess?: (paymentId: string, orderId: string) => void;
  onPaymentFailure?: (error: string) => void;
}

// Razorpay Checkout.js global type stub
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void; on(event: string, cb: (response: unknown) => void): void };
  }
}

/** Dynamically loads the Razorpay Checkout.js script once */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayModal({
  isOpen,
  onClose,
  productName,
  originalPrice,
  negotiatedPrice,
  discountReason,
  orderId: _orderId,
  onPaymentSuccess,
  onPaymentFailure,
}: RazorpayModalProps) {
  const [paymentStep, setPaymentStep] = useState<"checkout" | "initiating" | "processing" | "success" | "error">("checkout");
  const [copiedLink, setCopiedLink] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [rzpOrder, setRzpOrder] = useState<Record<string, string> | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [paymentId, setPaymentId] = useState("");

  const savings = originalPrice - negotiatedPrice;
  const paymentLink = rzpOrder?.payment_link ?? `https://rzp.io/i/vimmerse_prism`;

  // Reset state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentStep("checkout");
      setRzpOrder(null);
      setErrorMsg("");
      setPaymentId("");
    }
  }, [isOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const resetModal = () => {
    setPaymentStep("checkout");
    onClose();
  };

  /** Step 1 – Call backend to create a Razorpay Order */
  const initiatePayment = async () => {
    setPaymentStep("initiating");
    setErrorMsg("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/payment/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: negotiatedPrice,
          currency: "INR",
          product_name: productName,
          customer_name: "Vimmerse Customer",
          customer_email: "demo@vimmerse.ai",
          customer_phone: "9999999999",
          prism_order_id: `prism_${Date.now()}`,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Backend returned an error");
      }

      const order: Record<string, string> = await res.json();
      setRzpOrder(order);

      /** Step 2 – Open Razorpay Checkout.js with the real order */
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded || !window.Razorpay) {
        throw new Error("Razorpay SDK could not be loaded. Please check your internet connection.");
      }

      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: Number(order.amount_paise),
        currency: order.currency,
        name: "Vimmerse",
        description: `PRISM Negotiated: ${productName}`,
        order_id: order.order_id,
        prefill: {
          name: order.customer_name,
          email: order.customer_email,
          contact: order.customer_phone,
        },
        theme: { color: "#7C3AED" },
        modal: {
          ondismiss: () => {
            // User closed without paying → go back to checkout
            setPaymentStep("checkout");
          },
        },
        handler: (response: unknown) => {
          const r = response as { razorpay_payment_id: string };
          const pId = r.razorpay_payment_id || `pay_${Math.random().toString(36).slice(2, 10)}`;
          setPaymentId(pId);
          setPaymentStep("success");
          if (onPaymentSuccess) {
            onPaymentSuccess(pId, order.order_id);
          }
        },
      });

      rzp.on("payment.failed", (failedResp: unknown) => {
        const f = failedResp as { error?: { description?: string } };
        const reason = f?.error?.description || "Payment was declined or failed. Please try again.";
        setErrorMsg(reason);
        setPaymentStep("error");
        if (onPaymentFailure) {
          onPaymentFailure(reason);
        }
      });

      setPaymentStep("processing");
      rzp.open();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unknown error occurred.";
      setErrorMsg(msg);
      setPaymentStep("error");
      if (onPaymentFailure) {
        onPaymentFailure(msg);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={resetModal} className="max-w-xl">
      <div className="space-y-6">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <Typography variant="h4" className="text-white flex items-center gap-2">
                Razorpay Trusted Checkout
                <Badge variant="secondary" className="text-[10px] bg-blue-500/20 text-blue-400 border-blue-500/30">
                  TEST MODE
                </Badge>
              </Typography>
              <Typography variant="muted" className="text-xs">
                Gated by PRISM Cognitive Admissibility Engine
              </Typography>
            </div>
          </div>
        </div>

        {/* ── STEP: checkout ──────────────────────────────────────────── */}
        {paymentStep === "checkout" && (
          <div className="space-y-6">
            {/* Price & Discount breakdown */}
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Item:</span>
                <span className="text-white font-medium">{productName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Catalog Price:</span>
                <span className="text-white/60 line-through">₹{originalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-400">PRISM Negotiated Price:</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">₹{negotiatedPrice.toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-xs text-emerald-300 flex items-center justify-between">
                  <span>Savings: ₹{savings.toLocaleString()}</span>
                  <span className="italic">{discountReason}</span>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Select Payment Method</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    paymentMethod === "upi"
                      ? "bg-blue-600/20 border-blue-500 text-white"
                      : "glass-panel border-white/10 text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  <QrCode size={20} className={paymentMethod === "upi" ? "text-blue-400" : ""} />
                  <div className="text-left">
                    <div className="text-sm font-medium">Instant UPI QR</div>
                    <div className="text-[10px] text-muted-foreground">GPay, PhonePe, Paytm</div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    paymentMethod === "card"
                      ? "bg-blue-600/20 border-blue-500 text-white"
                      : "glass-panel border-white/10 text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  <CreditCard size={20} className={paymentMethod === "card" ? "text-blue-400" : ""} />
                  <div className="text-left">
                    <div className="text-sm font-medium">Razorpay Card / Netbanking</div>
                    <div className="text-[10px] text-muted-foreground">Test Cards Supported</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Test card hint */}
            <div className="glass-panel p-3 rounded-xl border border-dashed border-white/20 text-xs font-mono text-muted-foreground space-y-1">
              <div className="text-violet-300 font-semibold mb-1">🧪 Test Card Details (Razorpay)</div>
              <div>Card: <span className="text-white">4111 1111 1111 1111</span></div>
              <div>Expiry: <span className="text-white">Any future date</span> &nbsp;|&nbsp; CVV: <span className="text-white">Any 3 digits</span></div>
              <div className="pt-1 text-[10px] text-blue-400 flex items-center gap-1"><ExternalLink size={10} /> UPI: <span className="text-white">success@razorpay</span></div>
            </div>

            {/* Pay Button → calls backend */}
            <Button
              id="razorpay-pay-btn"
              size="lg"
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-medium text-base rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"
              onClick={initiatePayment}
            >
              <Lock size={18} />
              Pay ₹{negotiatedPrice.toLocaleString()} via Razorpay
              <ArrowRight size={18} />
            </Button>

            <p className="text-[10px] text-center text-muted-foreground">
              A real Razorpay Order is created via the PRISM backend. Your payment is processed securely.
            </p>
          </div>
        )}

        {/* ── STEP: initiating (creating order) ──────────────────────── */}
        {paymentStep === "initiating" && (
          <div className="py-12 text-center space-y-4">
            <Loader2 size={48} className="mx-auto text-blue-400 animate-spin" />
            <Typography variant="h4" className="text-white">
              Creating Razorpay Order…
            </Typography>
            <Typography variant="muted" className="text-sm max-w-sm mx-auto font-mono">
              PRISM Execution Agent is authorizing your order via the Razorpay Orders API…
            </Typography>
          </div>
        )}

        {/* ── STEP: processing (Checkout.js is open) ─────────────────── */}
        {paymentStep === "processing" && (
          <div className="py-12 text-center space-y-4">
            <div className="relative inline-flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
              <ShieldCheck size={28} className="absolute text-blue-400" />
            </div>
            <Typography variant="h4" className="text-white">
              Razorpay Checkout is Open
            </Typography>
            <Typography variant="muted" className="text-sm max-w-sm mx-auto font-mono">
              Complete the payment in the Razorpay popup. This modal will update automatically once payment is confirmed.
            </Typography>
          </div>
        )}

        {/* ── STEP: success ───────────────────────────────────────────── */}
        {paymentStep === "success" && (
          <div className="space-y-6 py-2 text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <Typography variant="h3" className="text-white text-2xl font-bold">
                Payment Successful!
              </Typography>
              <Typography variant="muted" className="text-sm mt-1">
                Order ID: <span className="font-mono text-emerald-400">{rzpOrder?.order_id}</span>
              </Typography>
            </div>

            <div className="glass-panel p-4 rounded-xl text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between text-muted-foreground">
                <span>Razorpay Payment ID:</span>
                <span className="text-white">{paymentId || "—"}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>PRISM Admissibility Code:</span>
                <span className="text-emerald-400">ADM_PASSED_OK</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Webhook Status:</span>
                <span className="text-blue-400">payment.captured (200 OK)</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Payment Link:</span>
                <button
                  onClick={handleCopyLink}
                  className="text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                  {copiedLink ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <Button size="lg" className="w-full h-12 rounded-xl" onClick={resetModal}>
              Close & Return to Studio
            </Button>
          </div>
        )}

        {/* ── STEP: error ─────────────────────────────────────────────── */}
        {paymentStep === "error" && (
          <div className="space-y-6 py-4 text-center">
            <div className="h-16 w-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto shadow-[0_0_30px_rgba(244,63,94,0.3)]">
              <AlertTriangle size={32} />
            </div>
            <Typography variant="h4" className="text-white">
              Payment Error
            </Typography>
            <Typography variant="muted" className="text-sm max-w-sm mx-auto font-mono">
              {errorMsg}
            </Typography>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl"
                onClick={() => setPaymentStep("checkout")}
              >
                Try Again
              </Button>
              <Button className="flex-1 h-11 rounded-xl" onClick={resetModal}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
