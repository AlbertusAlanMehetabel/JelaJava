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
            model = load_model("./model/JelaJava.h5")
        except Exception as e:
            return jsonify({"error": "Model gagal didapatkan", "message": str(e)}), 500
    return model


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


def get_rec_number():
    try:
        # Mendapatkan jumlah rekomendasi dari request body kalau tidak ada gunakan default
        rec_n = request.json.get("rec_n", 5)

        # Memastikan jumlah rekomendasi tersedia
        if rec_n is None:
            return (
                jsonify({"error": "Jumlah rekomendasi tidak lengkap"}),
                400,
            )
        elif rec_n <= 1 or rec_n > 437:
            return (
                jsonify({"error": "Jumlah rekomendasi tidak sesuai"}),
                400,
            )
        return rec_n
    except Exception as e:
        return (
            jsonify(
                {
                    "error": "Terjadi kesalahan saat memproses jumlah rekomendasi yang dapat diberikan"
                }
            ),
            500,
        )


def get_filtered_city_name():
    try:
        # Mendapatkan kota dari request body
        city = request.json.get("city")

        # Memastikan kota tersedia
        if city is None:
            return (
                jsonify({"error": "Kota tidak lengkap"}),
                400,
            )
        elif (
            city != "Jakarta"
            and city != "Bandung"
            and city != "Surabaya"
            and city != "Semarang"
            and city != "Yogyakarta"
        ):
            return (
                jsonify({"error": "Kota tidak terdaftar"}),
                400,
            )
        return city
    except Exception as e:
        return (
            jsonify({"error": "Terjadi kesalahan saat memproses nama kota"}),
            500,
        )


def preprocess_recommendations(user_input, recommendations, unrated_places):
    try:
        # Mendapatkan data tempat
        place = get_place_data()

        # Mengurutkan rekomendasi berdasarkan nilai prediksi
        top_indices = np.argsort(recommendations.flatten())
        top_recommendations = unrated_places[top_indices]

        # Mengambil nama tempat berdasarkan indeks rekomendasi
        place_names = place.loc[
            top_recommendations.flatten(), "Place_Name"
        ].values.reshape(top_recommendations.shape)

        place_names = []
        for i, place_id in enumerate(top_recommendations):
            place_names.append(
                place.loc[
                    place_id,
                    "Place_Name",
                ]
            )

        slicing = get_rec_number()

        place_names = place_names[:slicing]

        # Menyiapkan respons
        response = {
            "user_id": user_input,
            "recommendations": place_names,
            "total_recommendations": len(place_names),
        }

        # Memberikan respons jika berhasil
        return response
    except Exception as e:
        # Memberikan respons jika gagal
        return jsonify({"error": str(e)}), 500


@app.route("/recommendation", methods=["POST"])
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

        # Mendapatkan User ID
        user_id = user_input - 1

        # Membuat User Item Matrix
        user = pd.read_csv(
            "https://raw.githubusercontent.com/deltadv/JelaJava/main/Machine%20Learning/Datasets/user.csv"
        )
        rating = pd.read_csv(
            "https://raw.githubusercontent.com/deltadv/JelaJava/main/Machine%20Learning/Datasets/tourism_rating.csv"
        )
        df_data = pd.merge(rating, user, on="User_Id")
        df_data["User_Id"] = df_data["User_Id"].astype("category").cat.codes
        df_data["Place_Id"] = df_data["Place_Id"].astype("category").cat.codes
        num_users = df_data["User_Id"].nunique()
        num_places = df_data["Place_Id"].nunique()
        user_item_matrix = np.zeros((num_users, num_places))

        user_ratings = user_item_matrix[user_id]

        unrated_places = np.where(user_ratings == 0)[0]

        user_ids = np.full_like(unrated_places, user_id)
        input = [user_ids, unrated_places]
        recommendations = model.predict(input)

        # Proses sebelum pemberian rekomendasi
        recommendations = preprocess_recommendations(
            user_input, recommendations, unrated_places
        )

        # Memberikan respons jika berhasil
        return jsonify(recommendations), 200
    except Exception as e:
        # Memberikan respons jika gagal
        return jsonify({"error": str(e)}), 500


@app.route("/filter", methods=["GET"])
def filter():
    try:
        # Mendapatkan nama kota yang ingin difilter
        filtered_city_name = get_filtered_city_name()
        if isinstance(filtered_city_name, tuple):
            return filtered_city_name

        # Mendapatkan data tempat
        place = get_place_data()

        # Mendapatkan daftar kota yang sudah difilter
        filtered_place_names = []
        for i in range(len(place)):
            if (
                place.loc[
                    i,
                    "City",
                ]
                == filtered_city_name
            ):
                filtered_place_names.append(
                    place.loc[
                        i,
                        "Place_Name",
                    ]
                )

        # Menyiapkan respons
        response = {
            "filtered_city": filtered_place_names,
            "total_recommendations": len(filtered_place_names),
        }

        # Memberikan respons jika berhasil
        return response
    except Exception as e:
        # Memberikan respons jika gagal
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
