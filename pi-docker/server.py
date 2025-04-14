from flask import Flask, request

app = Flask(__name__)

@app.route('/hello', endpoint='hello_world')
def hello():
    return 'Hello, World!'

@app.route('/img', methods=['POST'])
def receive_image():
    if request.data:
        with open("received.jpg", "wb") as f:
            f.write(request.data)
        print("received")
        return "Image received", 200
    else:
        return "No image data received", 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
