"""
Seeds Firestore with test 'needs' data for Phase 2 (clustering) testing only.
Matches models/need.py exactly. No NGOs/Tasks — those come in later phases.

Run from your backend/ root (same folder as main.py):
    python seed_needs_phase2.py
"""

import random
from datetime import datetime, timedelta

from utils.firestore_helpers import add_document

random.seed(42)

NEED_TYPES = ["water", "food", "medical", "shelter", "education"]
SEVERITIES = ["low", "medium", "high", "critical"]
STATUSES_WEIGHTED = ["open"] * 55 + ["assigned"] * 25 + ["resolved"] * 20  # matches your model's allowed statuses

# 6 hotspot regions -> each gets a cluster of nearby points
HOTSPOTS = [
    {"lat": 16.3067, "lng": 80.4365, "dominant": "water"},     # Guntur drought belt
    {"lat": 16.6100, "lng": 80.7300, "dominant": "shelter"},   # Krishna flood relief
    {"lat": 15.6600, "lng": 79.9700, "dominant": "food"},      # Prakasam food scarcity
    {"lat": 14.4426, "lng": 79.9865, "dominant": "medical"},   # Nellore health crisis
    {"lat": 13.2172, "lng": 79.1003, "dominant": "education"}, # Chittoor school access
    {"lat": 16.4900, "lng": 80.6100, "dominant": "water"},     # Guntur secondary water
]

# Isolated points, far from any hotspot -> should each form a singleton cluster
NOISE_LOCATIONS = [
    (17.6868, 83.2185), (17.0005, 81.8040), (18.1667, 83.4167),
    (13.6288, 79.4192), (15.9129, 79.7400), (16.9891, 82.2475),
]

RAW_NOTES = {
    "water": ["Borewell dried up, nearest source 6km away",
              "Hand pump broken for 3 weeks, no repair yet",
              "Tanker supply irregular, families rationing"],
    "food": ["PDS shop out of stock for 2 weeks",
             "Crop failure due to drought, no stored grain",
             "Daily wage families unable to afford rations"],
    "medical": ["No doctor visit in primary health center for a month",
                "Seasonal fever outbreak, no medicine stock",
                "Pregnant women unable to reach nearest hospital"],
    "shelter": ["Homes damaged in recent flooding, families displaced",
                "Temporary shelter overcrowded, needs expansion",
                "Roof damage from storm, monsoon season approaching"],
    "education": ["School building damaged, classes held outdoors",
                  "No teacher assigned for past semester",
                  "Children dropping out due to long travel distance"],
}


def jitter(base, spread_km=2.5):
    deg_spread = spread_km / 111.0
    return base + random.uniform(-deg_spread, deg_spread)


def make_need(lat, lng, need_type):
    need_data = {
        "location": {"lat": round(lat, 6), "lng": round(lng, 6)},
        "need_type": need_type,
        "severity": random.choices(SEVERITIES, weights=[15, 35, 30, 20])[0],
        "status": random.choice(STATUSES_WEIGHTED),
        "source_ngo": None,
        "raw_notes": random.choice(RAW_NOTES[need_type]),
    }
    return add_document("needs", need_data)


created = 0
for hotspot in HOTSPOTS:
    count = random.randint(15, 22)
    for _ in range(count):
        need_type = hotspot["dominant"] if random.random() < 0.75 else random.choice(NEED_TYPES)
        lat = jitter(hotspot["lat"], spread_km=random.uniform(0.5, 4))
        lng = jitter(hotspot["lng"], spread_km=random.uniform(0.5, 4))
        make_need(lat, lng, need_type)
        created += 1

for lat, lng in NOISE_LOCATIONS:
    make_need(jitter(lat, 0.5), jitter(lng, 0.5), random.choice(NEED_TYPES))
    created += 1

print(f"Done. {created} need documents written to 'needs' collection.")