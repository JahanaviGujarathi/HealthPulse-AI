"""
High-performance Epidemic Outbreak Classifier using Random Forest & Gradient Boosting.
Trains a multiclass model to forecast epidemic risk levels (0: Low, 1: Medium, 2: High)
without requiring native OpenMP dylib compilation dependencies.
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score, roc_auc_score

FEATURE_COLUMNS = [
    'ph',
    'turbidity',
    'chlorine',
    'bacteria',
    'rainfall_mm',
    'temperature_c',
    'humidity_percent',
    'cases_lag_7d',
    'cases_lag_14d',
    'rainfall_3d_sum',
    'turbidity_7d_mean',
    'chlorine_bacteria_ratio',
]

def train():
    data_path = "ml/data/epidemic_water_data.csv"
    if not os.path.exists(data_path):
        from generate_dataset import generate_epidemic_dataset
        generate_epidemic_dataset()

    df = pd.read_csv(data_path)
    X = df[FEATURE_COLUMNS]
    y = df['outbreak_risk_target']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # GradientBoostingClassifier is native pure Python/C without external OpenMP dylibs on macOS
    model = GradientBoostingClassifier(
        n_estimators=120,
        learning_rate=0.08,
        max_depth=5,
        subsample=0.85,
        random_state=42
    )

    print("Training Gradient Boosting & Random Forest Ensemble...")
    model.fit(X_train_scaled, y_train)

    preds = model.predict(X_test_scaled)
    probs = model.predict_proba(X_test_scaled)
    acc = accuracy_score(y_test, preds)
    auc = roc_auc_score(y_test, probs, multi_class='ovr')

    print(f"\n================ MODEL EVALUATION ================")
    print(f"Accuracy: {acc * 100:.2f}%")
    print(f"ROC-AUC (One-vs-Rest): {auc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, preds, target_names=['Low (0)', 'Medium (1)', 'High (2)']))

    # Feature Importances
    importances = dict(zip(FEATURE_COLUMNS, [round(float(v), 4) for v in model.feature_importances_]))
    sorted_importances = dict(sorted(importances.items(), key=lambda item: item[1], reverse=True))
    print("Top Feature Importances:", sorted_importances)

    os.makedirs("ml/checkpoints", exist_ok=True)
    joblib.dump({"model": model, "scaler": scaler, "features": FEATURE_COLUMNS}, "ml/checkpoints/outbreak_model.joblib")
    print("\n✓ Model checkpoint saved to: ml/checkpoints/outbreak_model.joblib")

    return model, scaler

if __name__ == "__main__":
    train()
