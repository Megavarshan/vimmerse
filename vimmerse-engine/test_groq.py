import os
import json
import urllib.request
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GROQ_API_KEY")
print("Key exists:", bool(key))

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
}

for model in ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "openai/gpt-oss-120b"]:
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": "Return json: {\"ok\": true}"}],
        "response_format": {"type": "json_object"}
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            res = json.loads(r.read().decode("utf-8"))
            print(f"Model {model} SUCCESS:", res["choices"][0]["message"]["content"])
    except Exception as e:
        print(f"Model {model} FAILED:", e)
