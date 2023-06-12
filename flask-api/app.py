from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import pandas as pd
import numpy as np

app = Flask(__name__)

model = None


def get_model():
    global model
    if model is None:
        try:
            model = load_model("./JelaJava.h5")
        except Exception as e:
            return jsonify({"error": "Model gagal didapatkan", "message": str(e)}), 500
    return model


def get_user_input():
    try:
        # Mendapatkan user input dari request body
        user_input = request.json.get("user_input")

        # Memastikan user_input tersedia
        if user_input is None:
            return (
                jsonify({"error": "User input tidak lengkap"}),
                400,
            )
        elif user_input < 0 or user_input >= 300:
            return (
                jsonify({"error": "Model error"}),
                400,
            )
        return user_input
    except Exception as e:
        return (
            jsonify({"error": "Terjadi kesalahan saat memproses user input"}),
            500,
        )


def get_user_preferences():
    try:
        # Mendapatkan user preferences dari request body
        preferences = request.json.get("preferences")

        # Memastikan user_input tersedia
        if preferences is None:
            return (
                jsonify({"error": "User preferences tidak lengkap"}),
                400,
            )
        elif preferences < 0 or preferences >= 300:
            return (
                jsonify({"error": "Model error"}),
                400,
            )
        return preferences
    except Exception as e:
        return (
            jsonify({"error": "Terjadi kesalahan saat memproses user preferences"}),
            500,
        )


def get_place_data():
    try:
        # Membaca file CSV
        place = pd.read_csv(
            "https://storage.googleapis.com/datasets-c23-ps222/tourism_with_id.csv"
        )

        if place is None or place.empty:
            return jsonify({"error": "Data tidak ditemukan"}), 400

        place.drop(
            ["Time_Minutes", "Coordinate", "Lat", "Long", "Unnamed: 11", "Unnamed: 12"],
            axis=1,
            inplace=True,
        )

        return place
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# def preprocess_recommendations(recommendations, unrated_places):
#     try:
#         # Mendapatkan data tempat
#         place = get_place_data()

#         # Mengurutkan rekomendasi berdasarkan nilai prediksi
#         top_indices_all = recommendations.flatten().argsort()[::-1]
#         top_recommendations = unrated_places[top_indices_all]

#         # Mengambil nama tempat berdasarkan indeks rekomendasi
#         place_names = place.loc[top_recommendations, "Place_Name"].values
#         recommended_places = []
#         for i, place_id in enumerate(top_recommendations):
#             recommended_places.append(place_names[i])

#         # Memberikan respons jika berhasil
#         return recommended_places
#     except Exception as e:
#         # Memberikan respons jika gagal
#         return jsonify({"error": str(e)}), 500


def preprocess_recommendations(recommendations, unrated_places):
    try:
        # Mendapatkan data tempat
        place = get_place_data()

        # Mengurutkan rekomendasi berdasarkan nilai prediksi
        top_indices_all = np.argsort(recommendations)[::-1]
        top_recommendations = unrated_places[top_indices_all]
        # Mengambil nama tempat berdasarkan indeks rekomendasi
        place_names = place.loc[
            top_recommendations.flatten(), "Place_Name"
        ].values.reshape(top_recommendations.shape)
        recommended_places = place_names.tolist()

        # Memberikan respons jika berhasil
        return recommended_places
    except Exception as e:
        # Memberikan respons jika gagal
        return jsonify({"error": str(e)}), 500


@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Mendapatkan model
        model = get_model()
        if isinstance(model, tuple):
            return model

        # Mendapatkan user input
        user_input = get_user_input()
        if isinstance(user_input, tuple):
            return user_input

        print(" * User Input =", user_input)

        preferences = request.json.get("preferences")

        preferences = np.array(preferences) - 1  # place id
        place_id = np.arange(0, 437)
        unrated_places = np.setdiff1d(place_id, preferences)

        user_ids = np.full_like(unrated_places, user_input)  # user input

        print(" * Preferences: ", preferences)
        print(" * place id: ", place_id)
        print(" * unrated places: ", unrated_places)

        # Melakukan prediksi dengan model
        recommendations = model.predict([user_ids, unrated_places])

        # Proses sebelum pemberian rekomendasi
        recommendations = preprocess_recommendations(recommendations, unrated_places)

        # Menyiapkan respons
        response = {
            "user_id": user_input,
            "recommendations": recommendations,
            "total_recommendations": len(recommendations),
        }

        # Memberikan respons jika berhasil
        return jsonify(response), 200
    except Exception as e:
        # Memberikan respons jika gagal
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
