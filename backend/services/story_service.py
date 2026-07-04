import google.generativeai as genai

from config.settings import GEMINI_API_KEY, PROOFS_COLLECTION, TASKS_COLLECTION, NEEDS_COLLECTION, NGOS_COLLECTION
from utils.firestore_helpers import get_document, update_document


def generate_impact_story(proof_id: str) -> dict:
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set in your .env file")

    proof = get_document(PROOFS_COLLECTION, proof_id)
    if proof is None:
        raise ValueError(f"Proof not found: {proof_id}")
    if proof["status"] != "approved":
        raise ValueError("Can only generate a story for an approved proof")

    task = get_document(TASKS_COLLECTION, proof["task_id"])
    need = get_document(NEEDS_COLLECTION, task["need_id"])
    ngo = get_document(NGOS_COLLECTION, proof["ngo_id"])

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = (
        "Write a short, professional, donor-facing impact story (3-4 sentences). "
        "Be warm but factual — do not exaggerate or invent details not given below.\n\n"
        f"NGO: {ngo.get('name')}\n"
        f"District: {ngo.get('district')}\n"
        f"Need type: {need.get('need_type')}\n"
        f"Quantity delivered: {task.get('total_quantity')} {task.get('unit') or ''}\n"
        f"Volunteer's field notes: {proof.get('story_text') or 'No notes provided.'}\n"
    )

    try:
        response = model.generate_content(prompt)
        story_text = response.text.strip()
    except Exception as e:
        raise ValueError(f"Story generation failed: {e}")

    update_document(PROOFS_COLLECTION, proof_id, {"impact_story": story_text})
    return {"proof_id": proof_id, "impact_story": story_text}