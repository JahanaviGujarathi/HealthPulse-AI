"""
Model export script: converts trained scikit-learn model checkpoint to ONNX.
Saves the optimized .onnx model in public/models/ for direct web/server inference.
"""

import os
import joblib
import numpy as np
from skl2onnx import to_onnx
from skl2onnx.common.data_types import FloatTensorType

def export_onnx():
    checkpoint_path = "ml/checkpoints/outbreak_model.joblib"
    if not os.path.exists(checkpoint_path):
        raise FileNotFoundError("Train the model first using python ml/train.py")

    checkpoint = joblib.load(checkpoint_path)
    model = checkpoint["model"]

    # 12 float features schema
    initial_type = [('float_input', FloatTensorType([None, 12]))]
    onx = to_onnx(model, initial_types=initial_type)

    os.makedirs("public/models", exist_ok=True)
    onnx_file = "public/models/outbreak_model.onnx"
    with open(onnx_file, "wb") as f:
        f.write(onx.SerializeToString())

    file_size_kb = os.path.getsize(onnx_file) / 1024
    print(f"✓ ONNX model successfully serialized to: {onnx_file} ({file_size_kb:.1f} KB)")

if __name__ == "__main__":
    export_onnx()
