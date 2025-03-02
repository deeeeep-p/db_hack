from flask import Flask, request, jsonify, send_file
import re
import cv2
import numpy as np
import pandas as pd
import faiss
from sentence_transformers import SentenceTransformer
from PIL import Image
import google.generativeai as genai
import os
import requests
from bs4 import BeautifulSoup
import json
from dotenv import load_dotenv
import pdfplumber

load_dotenv()

# Retrieve API key from environment variable
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY is missing! Set it in the .env file.")

# Configure Gemini AI API
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel(model_name='gemini-1.5-pro')

# Initialize Flask app
app = Flask(__name__)

# Load FAISS Search Data
df = pd.read_csv("item.csv")
encoder = SentenceTransformer("all-mpnet-base-v2")
vectors = encoder.encode(df.text.tolist(), convert_to_numpy=True)
dim = vectors.shape[1]
index = faiss.IndexFlatL2(dim)
index.add(vectors)

# Label colors dictionary
label_colors = {}

def parse_bounding_box(response_text):
    """Parse bounding box coordinates and labels from the Gemini response."""
    bounding_boxes = re.findall(r'\[(\d+,\s*\d+,\s*\d+,\s*\d+,\s*[\w\s]+)\]', response_text)
    parsed_boxes = []

    for box in bounding_boxes:
        parts = box.split(',')
        numbers = list(map(int, parts[:-1]))  # Extract coordinates
        label = parts[-1].strip()  # Extract object name
        parsed_boxes.append((numbers, label))

    return parsed_boxes

def draw_bounding_boxes(image, bounding_boxes_with_labels):
    """Draw bounding boxes with labels on the image."""
    if image.mode != 'RGB':
        image = image.convert('RGB')

    image = np.array(image)  # Convert to NumPy array

    for bounding_box, label in bounding_boxes_with_labels:
        height, width = image.shape[:2]
        ymin, xmin, ymax, xmax = bounding_box

        # Convert normalized coordinates (0-1000) to actual image dimensions
        x1 = int(xmin / 1000 * width)
        y1 = int(ymin / 1000 * height)
        x2 = int(xmax / 1000 * width)
        y2 = int(ymax / 1000 * height)

        # Increase bounding box size slightly
        x1, y1, x2, y2 = max(0, x1 - 5), max(0, y1 - 5), min(width, x2 + 5), min(height, y2 + 5)

        # Assign random colors to labels
        if label not in label_colors:
            label_colors[label] = np.random.randint(0, 256, (3,)).tolist()
        color = label_colors[label]

        # Draw bounding box
        cv2.rectangle(image, (x1, y1), (x2, y2), color, 3)

        # Text label
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale, thickness = 0.8, 2
        text_size = cv2.getTextSize(label, font, font_scale, thickness)[0]
        text_x, text_y = x1, max(0, y1 - 10)

        # Label background
        cv2.rectangle(image, (text_x, text_y - text_size[1] - 10), (text_x + text_size[0] + 10, text_y), color, -1)
        cv2.putText(image, label, (text_x + 5, text_y - 5), font, font_scale, (255, 255, 255), thickness)

    return Image.fromarray(image)
@app.route('/detect_objects', methods=['POST'])
def detect_objects():
    """Detect objects in an uploaded image using Gemini AI and return detected object labels and annotated image."""
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file uploaded"}), 400

        image_file = request.files['image']
        img = Image.open(image_file)

        response = model.generate_content([
            img,
            "Return bounding boxes for all objects (no living beings) in the image as a list."
            "Format: [ymin, xmin, ymax, xmax, object_name]."
        ])

        bounding_boxes = parse_bounding_box(response.text)
        output_image = draw_bounding_boxes(img, bounding_boxes)

        # Save the annotated image
        output_path = "output_image.jpg"
        output_image.save(output_path)

        # Extract unique object labels
        unique_labels = list(set(label for _, label in bounding_boxes))

        return jsonify({
            "objects": ",".join(unique_labels),
            # "image_url": request.host_url + output_path  # Provide image URL
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/query', methods=['POST'])
def search():
    """Search for similar items in the dataset using FAISS and return the top matches for a single query."""
    try:
        data = request.get_json()
        query = data.get('query', '')
        print(query)
        if not query or not isinstance(query, str):
            return jsonify({"error": "A single query string is required"}), 400

        # Encode the query
        query_vector = encoder.encode([query], convert_to_numpy=True)  # Encode as a single query

        # Search FAISS index
        k = min(len(df), 15)  # Top 10 matches
        distances, indices = index.search(query_vector, k=k)

        # Prepare response
        results = [
            {
                **df.iloc[idx].to_dict(),
                "similarity_score": float(dist)
            }
            for idx, dist in zip(indices[0], distances[0])
        ]
        results.sort(key=lambda x: x["similarity_score"])  # Sort results by similarity score

        return jsonify({"query": query, "matches": results})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

def scrape_google_news(query, count=5):
    try:
        url = f"https://www.google.com/search?q={query.replace(' ', '+')}&tbm=nws&tbs=qdr:w"  # Last week filter
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        articles = []
        seen_urls = set()
        
        for container in soup.select("div.SoaBEf"):
            if len(articles) >= count:
                break
                
            link = container.find("a", href=True)
            if not link:
                continue
                
            full_link = link["href"]
            if full_link in seen_urls:
                continue
                
            title_div = container.select_one("div.MBeuO")
            source_div = container.select_one(".NUnG9d span")
            
            if title_div and full_link:
                seen_urls.add(full_link)
                articles.append({
                    "title": title_div.text.strip(),
                    "url": full_link,
                    "source": source_div.text if source_div else "Unknown",
                    "timestamp": container.select_one(".ZE0LJd span").text if container.select_one(".ZE0LJd span") else None
                })
        
        return {"data": articles[:count]}, 200
    
    except Exception as e:
        return {"error": str(e)}, 500

@app.route('/news', methods=['GET'])
def get_news():
    keyword = request.args.get('keyword', default='Latest updates on renewable energy, carbon footprint reduction, and sustainable investments in India.')
    count = request.args.get('count', default=5, type=int)
    
    result, status_code = scrape_google_news(keyword, count)
    return jsonify(result), status_code

@app.route('/verify', methods=['POST'])
def verify():
    """Verify the uploaded PDF against a reference PDF using Gemini AI."""
    try:
        # Check if the request contains a PDF file
        if 'pdf' not in request.files:
            return jsonify({"error": "No PDF file uploaded"}), 400

        # Save the uploaded PDF
        uploaded_pdf = request.files['pdf']
        uploaded_pdf_path = "uploaded.pdf"
        uploaded_pdf.save(uploaded_pdf_path)

        # Extract text from the uploaded PDF
        uploaded_text = ""
        with pdfplumber.open(uploaded_pdf_path) as pdf:
            for page in pdf.pages:
                uploaded_text += page.extract_text() or ""

        # Extract text from the reference PDF
        reference_text = ""
        with pdfplumber.open("reference.pdf") as pdf:
            for page in pdf.pages:
                reference_text += page.extract_text() or ""
        print(uploaded_text)
        print(reference_text)
        # Send both texts to Gemini for comparison
        prompt = f"""
        Compare the following two solar project reports and determine if the uploaded document is legitimate or not.

        **Reference Document (Correct)**:
        {reference_text}

        **Uploaded Document**:
        {uploaded_text}

        Analyze the attached PDF document and determine whether it is a legitimate solar project proposal or a fraudulent one. Examine the document based on the following verification parameters: technical feasibility, financial viability, regulatory compliance, energy generation estimates, and project transparency. Provide a final verdict as 'LEGITIMATE' or 'NOT LEGITIMATE' without any extra text.
        """

        response = model.generate_content(prompt)
        verdict = response.text.strip().upper()

        # Clean up uploaded PDF
        os.remove(uploaded_pdf_path)
        print(verdict)
        return jsonify({"verdict": verdict})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)