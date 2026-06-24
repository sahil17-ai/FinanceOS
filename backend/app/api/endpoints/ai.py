from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List
import google.generativeai as genai
from app.core.config import settings
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

# Configure Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

@router.post("/chat")
async def chat_with_ai(request: ChatRequest, current_user: User = Depends(get_current_user)):
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        # Convert history
        formatted_history = []
        for msg in request.history:
            role = "user" if msg.role == "user" else "model"
            formatted_history.append({"role": role, "parts": [msg.content]})
            
        chat = model.start_chat(history=formatted_history)
        
        system_prompt = f"You are FinanceOS AI, a helpful personal finance assistant. Be concise and friendly. User email: {current_user.email}."
        prompt = system_prompt + "\n\nUser query: " + request.message
        
        response = chat.send_message(prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/scan")
async def scan_receipt(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")
        
    try:
        contents = await file.read()
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = "Analyze this receipt/bill image. Extract the total final amount, and categorize the spend into one of these: Family, Friend, Emergency, Travel, Food, Custom. Respond ONLY with a valid JSON object containing exactly two keys: 'amount' (a number, no currency symbols) and 'category' (a string). Do not include any other text."
        
        image_parts = [
            {
                "mime_type": file.content_type,
                "data": contents
            }
        ]
        
        response = model.generate_content([prompt, image_parts[0]])
        res_text = response.text.strip()
        if res_text.startswith("```json"):
            res_text = res_text[7:-3].strip()
        elif res_text.startswith("```"):
            res_text = res_text[3:-3].strip()
            
        import json
        try:
            data = json.loads(res_text)
            return data
        except:
            return {"amount": 0, "category": "Custom"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
