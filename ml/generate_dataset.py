"""
Dataset generation pipeline for HealthPulse AI.
Simulates multi-district historical epidemiological, water quality, and climate records
aligned with Indian environmental conditions (e.g. Assam, West Bengal, Maharashtra).
"""

import os
import numpy as np
import pandas as pd

def generate_epidemic_dataset(n_samples=5000, random_seed=42):
    np.random.seed(random_seed)
    
    villages = [
        {"id": "VIL-001", "name": "Kamalabari", "district": "Majuli", "state": "Assam", "risk_factor": 1.3},
        {"id": "VIL-002", "name": "Garamur", "district": "Majuli", "state": "Assam", "risk_factor": 1.1},
        {"id": "VIL-003", "name": "Diamond Harbour", "district": "South 24 Parganas", "state": "West Bengal", "risk_factor": 1.4},
        {"id": "VIL-004", "name": "Canning", "district": "South 24 Parganas", "state": "West Bengal", "risk_factor": 1.2},
        {"id": "VIL-005", "name": "Karjat", "district": "Raigad", "state": "Maharashtra", "risk_factor": 0.9},
        {"id": "VIL-006", "name": "Alibag", "district": "Raigad", "state": "Maharashtra", "risk_factor": 0.8},
        {"id": "VIL-007", "name": "Najafgarh", "district": "South West Delhi", "state": "Delhi", "risk_factor": 1.0},
        {"id": "VIL-008", "name": "Mehrauli", "district": "South Delhi", "state": "Delhi", "risk_factor": 0.7},
    ]

    dates = pd.date_range(start="2024-01-01", periods=n_samples // len(villages), freq="D")
    records = []

    for v in villages:
        base_cases = np.random.poisson(lam=2 * v["risk_factor"], size=len(dates))
        
        # Environmental factors
        ph = np.random.normal(loc=7.1, scale=0.6, size=len(dates))
        turbidity = np.random.exponential(scale=2.8 * v["risk_factor"], size=len(dates))
        chlorine = np.clip(np.random.normal(loc=0.35, scale=0.18, size=len(dates)), 0.0, 1.2)
        bacteria = np.random.exponential(scale=65 * v["risk_factor"], size=len(dates))
        
        # Weather
        rainfall = np.random.exponential(scale=18.0, size=len(dates))
        rainfall[np.random.rand(len(dates)) > 0.4] = 0.0 # Dry days
        temperature = np.random.normal(loc=29.0, scale=4.0, size=len(dates))
        humidity = np.clip(np.random.normal(loc=75.0, scale=12.0, size=len(dates)), 30.0, 99.0)

        for i, dt in enumerate(dates):
            records.append({
                "date": dt,
                "village_id": v["id"],
                "village_name": v["name"],
                "district": v["district"],
                "state": v["state"],
                "ph": round(float(ph[i]), 2),
                "turbidity": round(float(max(0.2, turbidity[i])), 2),
                "chlorine": round(float(chlorine[i]), 3),
                "bacteria": round(float(max(0, bacteria[i])), 1),
                "rainfall_mm": round(float(rainfall[i]), 1),
                "temperature_c": round(float(temperature[i]), 1),
                "humidity_percent": round(float(humidity[i]), 1),
                "daily_cases": int(base_cases[i]),
            })

    df = pd.DataFrame(records)
    df = df.sort_values(by=["village_id", "date"]).reset_index(drop=True)

    # Calculate lag features
    df["cases_lag_7d"] = df.groupby("village_id")["daily_cases"].shift(7).fillna(0).astype(int)
    df["cases_lag_14d"] = df.groupby("village_id")["daily_cases"].shift(14).fillna(0).astype(int)
    df["rainfall_3d_sum"] = df.groupby("village_id")["rainfall_mm"].transform(lambda x: x.rolling(3, min_periods=1).sum()).round(1)
    df["turbidity_7d_mean"] = df.groupby("village_id")["turbidity"].transform(lambda x: x.rolling(7, min_periods=1).mean()).round(2)
    df["chlorine_bacteria_ratio"] = (df["chlorine"] / (df["bacteria"] + 1.0)).round(5)

    # Target calculation: Outbreak Risk Target (0: Low, 1: Medium, 2: High)
    # Ground truth formula based on clinical epidemiology:
    risk_score = (
        (df["bacteria"] > 100) * 35 +
        (df["turbidity"] > 4.0) * 25 +
        (df["chlorine"] < 0.2) * 20 +
        (df["rainfall_3d_sum"] > 50.0) * 15 +
        (df["cases_lag_7d"] > 5) * 20 +
        (df["chlorine_bacteria_ratio"] < 0.001) * 15
    )

    df["risk_score"] = risk_score
    df["outbreak_risk_target"] = 0
    df.loc[df["risk_score"] >= 65, "outbreak_risk_target"] = 2  # High
    df.loc[(df["risk_score"] >= 35) & (df["risk_score"] < 65), "outbreak_risk_target"] = 1  # Medium

    os.makedirs("ml/data", exist_ok=True)
    csv_path = "ml/data/epidemic_water_data.csv"
    df.to_csv(csv_path, index=False)
    print(f"✓ Synthetic dataset created: {csv_path} with {len(df)} samples.")
    print("Class distribution:\n", df["outbreak_risk_target"].value_counts(normalize=True))
    return df

if __name__ == "__main__":
    generate_epidemic_dataset()
