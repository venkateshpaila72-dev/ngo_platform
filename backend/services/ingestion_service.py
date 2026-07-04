import pandas as pd
from io import BytesIO
from config.settings import NEEDS_COLLECTION
from utils.firestore_helpers import add_document

COLUMN_MAP = {
    "latitude": "lat", "lat": "lat",
    "longitude": "lng", "long": "lng", "lng": "lng",
    "need": "need_type", "need_type": "need_type",
    "required_supply": "need_type", "resource_gap": "need_type",
    "urgency": "severity", "severity": "severity", "priority": "severity",
    "notes": "raw_notes", "remarks": "raw_notes",
}

VALID_SEVERITIES = {"low", "medium", "high", "critical"}


def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    normalized = {}
    for col in df.columns:
        key = col.strip().lower().replace(" ", "_")
        normalized[col] = COLUMN_MAP.get(key, key)
    return df.rename(columns=normalized)


def _validate_row(row, row_index: int) -> tuple[bool, str]:
    try:
        lat = float(row["lat"])
        lng = float(row["lng"])
    except (ValueError, TypeError):
        return False, f"Row {row_index}: lat/lng is not a valid number"

    if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
        return False, f"Row {row_index}: lat/lng out of valid range"

    need_type = str(row.get("need_type", "")).strip().lower()
    if not need_type or need_type == "nan":
        return False, f"Row {row_index}: need_type is empty"

    severity = str(row.get("severity", "")).strip().lower()
    if severity not in VALID_SEVERITIES:
        return False, f"Row {row_index}: severity '{severity}' is not one of {VALID_SEVERITIES}"

    return True, ""


def ingest_csv(file_bytes: bytes) -> dict:
    if not file_bytes:
        raise ValueError("Uploaded file is empty.")

    try:
        df = pd.read_csv(BytesIO(file_bytes))
    except pd.errors.EmptyDataError:
        raise ValueError("CSV file has no data.")
    except pd.errors.ParserError:
        raise ValueError("CSV file is malformed and could not be parsed.")

    if df.empty:
        raise ValueError("CSV file has no rows.")

    df = _normalize_columns(df)

    required_cols = {"lat", "lng", "need_type", "severity"}
    missing = required_cols - set(df.columns)
    if missing:
        raise ValueError(f"CSV is missing required columns: {missing}")

    ingested_ids = []
    skipped_rows = []
    sample_record = None

    for idx, row in df.iterrows():
        is_valid, reason = _validate_row(row, idx + 1)
        if not is_valid:
            skipped_rows.append(reason)
            continue

        need_data = {
            "location": {"lat": float(row["lat"]), "lng": float(row["lng"])},
            "need_type": str(row["need_type"]).strip().lower(),
            "severity": str(row["severity"]).strip().lower(),
            "status": "open",
            "raw_notes": str(row.get("raw_notes", "")) if "raw_notes" in df.columns and pd.notna(row.get("raw_notes")) else None,
        }

        try:
            doc_id = add_document(NEEDS_COLLECTION, need_data)
        except Exception as e:
            skipped_rows.append(f"Row {idx + 1}: Firestore write failed — {e}")
            continue

        ingested_ids.append(doc_id)
        if sample_record is None:
            sample_record = {**need_data, "id": doc_id}

    if not ingested_ids:
        raise ValueError(f"No valid rows could be ingested. Issues: {skipped_rows}")

    return {
        "status": "success",
        "records_ingested": len(ingested_ids),
        "records_skipped": len(skipped_rows),
        "skip_reasons": skipped_rows,
        "sample_record": sample_record,
    }