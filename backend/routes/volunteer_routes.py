from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.volunteer_service import register_volunteer, login_volunteer, list_volunteers

router = APIRouter()


class RegisterRequest(BaseModel):
    ngo_id: str
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/volunteers")
def register(body: RegisterRequest):
    try:
        return register_volunteer(body.ngo_id, body.name, body.email, body.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/volunteers/login")
def login(body: LoginRequest):
    try:
        return login_volunteer(body.email, body.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.get("/volunteers")
def list_all(ngo_id: Optional[str] = None):
    return list_volunteers(ngo_id)