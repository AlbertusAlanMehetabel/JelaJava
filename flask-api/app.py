from flask import Flask, request, jsonify
from google.cloud import storage

app = Flask(__name__)

storage_client = storage.Client()


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    # Melakukan prediksi model Machine Learning
    # Disini

    # Contoh respons prediksi
    response = {"prediction": "...", "confidence": "..."}

    return jsonify(response), 200


@app.route("/upload", methods=["POST"])
def upload():
    file = request.files["file"]

    bucket_name = "app-data-c23-ps222"
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(file.filename)
    blob.upload_from_file(file)

    response = {"message": "File uploaded successfully"}

    return jsonify(response), 200


if __name__ == "__main__":
    app.run(debug=True)


from flask import Flask

app = Flask(__name__)


@app.route("/")
def helloWorld():
    return "<h1>Hello, World!<h1>"


@app.route("/sample")
def running():
    return "Flask is running"
