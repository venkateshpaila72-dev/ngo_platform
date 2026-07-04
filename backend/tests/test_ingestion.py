import pandas as pd
from services.ingestion_service import _normalize_columns


def test_normalize_columns_maps_alternate_names():
    df = pd.DataFrame({
        "Latitude": [16.5],
        "Longitude": [80.6],
        "Required Supply": ["water"],
        "Urgency": ["high"],
    })
    normalized = _normalize_columns(df)

    assert "lat" in normalized.columns
    assert "lng" in normalized.columns
    assert "need_type" in normalized.columns
    assert "severity" in normalized.columns


def test_normalize_columns_handles_already_standard_names():
    df = pd.DataFrame({
        "lat": [16.5],
        "lng": [80.6],
        "need_type": ["water"],
        "severity": ["high"],
    })
    normalized = _normalize_columns(df)

    assert list(normalized.columns) == ["lat", "lng", "need_type", "severity"]