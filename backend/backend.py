from fastapi import FastAPI, Request
from check_connections.func.check_conn import get_conn
from pydantic import BaseModel

app = FastAPI()

@app.post("/check_connection")
async def check_connection(request: Request):
    data = await request.json()
    
    user_id = data.get("user_id")
    bot_id = data.get("db_id")
    
    message = await get_conn(bot_id,user_id)
    if message:
        return {
            "message": "Connection received 👌",
            "connection": message,
        }
    else:
        return {
            "message": "Something wrong",
            "connection": message,
        }


class PhoneNumber(BaseModel):
    user_id: int
    phone_number: str

@app.post("/phone")
async def receive_phone(data: PhoneNumber):
    print(f"[BACKEND] Received phone from user {data.user_id}: {data.phone_number}")
    return {"ok": True}