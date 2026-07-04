from config.settings import PROOFS_COLLECTION, TASKS_COLLECTION, NGOS_COLLECTION
from utils.firestore_helpers import get_all_documents, get_document


def get_impact_gallery(limit: int = 20) -> dict:
    proofs = get_all_documents(PROOFS_COLLECTION)
    approved = [p for p in proofs if p.get("status") == "approved"]
    approved.sort(key=lambda p: p.get("created_at", ""), reverse=True)

    gallery = []
    for p in approved[:limit]:
        task = get_document(TASKS_COLLECTION, p["task_id"])
        ngo = get_document(NGOS_COLLECTION, p["ngo_id"])
        gallery.append({
            "proof_id": p["id"],
            "photo_url": p["photo_url"],
            "story_text": p.get("story_text"),
            "impact_story": p.get("impact_story"),
            "ngo_name": ngo.get("name") if ngo else None,
            "district": ngo.get("district") if ngo else None,
            "need_type": task.get("need_type") if task else None,
            "quantity": task.get("total_quantity") if task else None,
            "unit": task.get("unit") if task else None,
            "created_at": p.get("created_at"),
        })

    return {"count": len(gallery), "gallery": gallery}


def get_ngo_directory() -> dict:
    ngos = get_all_documents(NGOS_COLLECTION)
    tasks = get_all_documents(TASKS_COLLECTION)

    directory = []
    for ngo in ngos:
        ngo_tasks = [t for t in tasks if any(st["ngo_id"] == ngo["id"] for st in t.get("sub_tasks", []))]
        completed = [t for t in ngo_tasks if t["status"] == "verified"]
        directory.append({
            "ngo_id": ngo["id"],
            "name": ngo["name"],
            "district": ngo["district"],
            "reliability_score": ngo.get("reliability_score"),
            "capabilities": list(ngo.get("capabilities", {}).keys()),
            "tasks_completed": len(completed),
            "tasks_total": len(ngo_tasks),
        })

    directory.sort(key=lambda n: n["tasks_completed"], reverse=True)
    return {"count": len(directory), "ngos": directory}