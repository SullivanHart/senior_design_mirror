from flask import Flask, request, jsonify, send_file
import os
from datetime import datetime
import logging
from io import BytesIO

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('ESP32-CAM Receiver')

# Create images directory if it doesn't exist
IMAGE_DIR = 'received_images'
os.makedirs(IMAGE_DIR, exist_ok=True)

# Variable to store the latest image data and metadata
latest_image = {
    'data': None,
    'filename': None,
    'timestamp': None,
    'size': None
}

@app.route('/hello')
def hello():
    logger.info("Hello endpoint accessed")
    return jsonify({"message": "Hello from ESP32-CAM receiver!", "status": "success"})

@app.route('/img', methods=['POST'])
def receive_image():
    global latest_image
    
    try:
        if not request.data:
            logger.warning("No image data received")
            return jsonify({"error": "No image data received"}), 400

        # Generate timestamped filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"esp32cam_{timestamp}.jpg"
        filepath = os.path.join(IMAGE_DIR, filename)

        # Save the image to file system
        with open(filepath, "wb") as f:
            f.write(request.data)
        
        file_size = os.path.getsize(filepath)
        
        # Update latest image in memory
        latest_image = {
            'data': request.data,
            'filename': filename,
            'timestamp': timestamp,
            'size': file_size
        }
        
        logger.info(f"Image saved successfully: {filename} ({file_size} bytes)")
        
        return jsonify({
            "status": "success",
            "filename": filename,
            "size_bytes": file_size,
            "message": "Image received and saved"
        }), 200

    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/read', methods=['GET'])
def serve_latest_image():
    try:
        if not latest_image['data']:
            logger.warning("No images available to serve")
            return jsonify({"error": "No images received yet"}), 404
            
        # Create in-memory file
        img_io = BytesIO(latest_image['data'])
        img_io.seek(0)
        
        logger.info(f"Serving latest image: {latest_image['filename']}")
        
        # Serve the image
        return send_file(
            img_io,
            mimetype='image/jpeg',
            as_attachment=False,
            download_name=latest_image['filename']
        )
        
    except Exception as e:
        logger.error(f"Error serving image: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Print startup information
    logger.info("Starting ESP32-CAM Image Receiver Server")
    logger.info(f"Images will be saved to: {os.path.abspath(IMAGE_DIR)}")
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=80, threaded=True)