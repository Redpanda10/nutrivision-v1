from flask import Flask, request, jsonify
from ultralytics import YOLO
import numpy as np
import cv2
import base64

app = Flask(__name__)

model = YOLO("best.pt")

@app.route("/detect", methods=["POST"])
def detect():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    img_bytes = file.read()

    # Convert to OpenCV image
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # YOLO prediction
    results = model.predict(source=img, conf=0.25, save=False)
    result = results[0]

    # Annotated image
    annotated_frame = result.plot()

    _, buffer = cv2.imencode(".jpg", annotated_frame)
    encoded_image = base64.b64encode(buffer).decode("utf-8")

    detections = []
    for box in result.boxes:
        detections.append({
            "name": result.names[int(box.cls[0])],
            "confidence": float(box.conf[0])
        })

    return jsonify({
        "detections": detections,
        "annotated_image": encoded_image
    })

if __name__ == "__main__":
    app.run(port=5001, debug=True)


# from flask import Flask, request, jsonify
# from ultralytics import YOLO
# import numpy as np
# import cv2
# import base64
# import os
# import json
# import requests
# from dotenv import load_dotenv

# # =========================
# # INIT
# # =========================
# app = Flask(__name__)
# load_dotenv()

# model = YOLO("best.pt")

# HF_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")


# # =========================
# # IMAGE ENCODING
# # =========================
# def encode_image(img):
#     _, buffer = cv2.imencode(".jpg", img)
#     return base64.b64encode(buffer).decode("utf-8")


# # =========================
# # LLM (STABLE HF API CALL)
# # =========================
# def generate_food_description(food_name, confidence):

#     if confidence < 0.19:
#         return {
#             "description": "Low confidence detection. Try a clearer image.",
#             "ingredientsGuess": [],
#             "cuisineType": "",
#             "healthSummary": "",
#             "tags": [],
#             "nutritionHint": {}
#         }

#     prompt = f"""
# Return ONLY valid JSON (no text, no markdown).

# Food: {food_name}

# JSON format:
# {{
#   "description": "short explanation of the food",
#   "cuisineType": "Nepali / Global / Indian / etc",
#   "ingredientsGuess": ["ingredient1", "ingredient2"],
#   "healthSummary": "health benefits or risks",
#   "tags": ["tag1", "tag2"],
#   "nutritionHint": {{
#     "calories": "per 100g",
#     "protein": "g",
#     "carbs": "g",
#     "fat": "g"
#   }}
# }}
# """

#     try:
#         response = requests.post(
#             "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-V3.2",
#             headers={"Authorization": f"Bearer {HF_API_TOKEN}"},
#             json={"inputs": prompt},
#             timeout=30
#         )

#         output = response.json()

#         # HF returns list or dict depending on model
#         if isinstance(output, list):
#             text = output[0].get("generated_text", "")
#         else:
#             text = output.get("generated_text", "")

#         # Clean markdown if any
#         text = text.replace("```json", "").replace("```", "").strip()

#         # Extract JSON safely
#         start = text.find("{")
#         end = text.rfind("}") + 1
#         json_str = text[start:end]

#         return json.loads(json_str)

#     except Exception as e:
#         print("LLM ERROR:", e)

#         return {
#             "description": f"{food_name} is a detected food item.",
#             "ingredientsGuess": [],
#             "cuisineType": "",
#             "healthSummary": "AI summary not available.",
#             "tags": [],
#             "nutritionHint": {}
#         }


# # =========================
# # DETECT ROUTE
# # =========================
# @app.route("/detect", methods=["POST"])
# def detect():

#     if "file" not in request.files:
#         return jsonify({"success": False, "message": "No file provided"}), 400

#     file = request.files["file"]
#     img_bytes = file.read()

#     # Convert image
#     nparr = np.frombuffer(img_bytes, np.uint8)
#     img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#     # YOLO prediction
#     results = model.predict(source=img, conf=0.25, save=False)
#     result = results[0]

#     annotated = result.plot()
#     encoded_image = encode_image(annotated)

#     temp = {}

#     for box in result.boxes:
#         name = result.names[int(box.cls[0])]
#         conf = float(box.conf[0])

#         # keep best confidence only
#         if name not in temp or conf > temp[name]["confidence"]:

#             llm_data = generate_food_description(name, conf)

#             temp[name] = {
#                 "name": name,
#                 "confidence": round(conf * 100, 2),

#                 "nutrition": {
#                     "caloriesKcal": "",
#                     "proteinG": "",
#                     "carbsG": "",
#                     "fatG": "",
#                     "sugarG": ""
#                 },

#                 "safetyCheck": {
#                     "isSafe": True,
#                     "allergensMatched": [],
#                     "warnings": []
#                 },

#                 "llm": llm_data,

#                 "insights": {
#                     "summary": llm_data.get("healthSummary", ""),
#                     "healthScore": 0,
#                     "dietRecommendation": ""
#                 }
#             }

#     return jsonify({
#         "success": True,
#         "detectedFoods": list(temp.values()),
#         "annotatedImage": encoded_image
#     })


# # =========================
# # RUN SERVER
# # =========================
# if __name__ == "__main__":
#     app.run(port=5001, debug=True)