from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from geopy.distance import geodesic
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def fetch_turfs():
    turfs_ref = db.collection("turfs")
    docs = turfs_ref.stream()
    turfs = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        turfs.append(data)
    return turfs


def filter_turfs_by_location(user_location, turfs, radius_km=10):
    """
    Filters turfs that are within a given radius (default: 10 km) from the user.
    """
    nearby_turfs = []
    user_coords = (user_location[0], user_location[1])  # (latitude, longitude)
    
    print(f"🔍 Filtering turfs for user location: {user_coords}")
    print(f"🔍 Radius: {radius_km} km")
    print(f"🔍 Total turfs to check: {len(turfs)}")

    for turf in turfs:
        if "location" in turf and "lat" in turf["location"] and "lng" in turf["location"]:
            turf_coords = (turf["location"]["lat"], turf["location"]["lng"])
            distance = geodesic(user_coords, turf_coords).km  # Compute distance in km
            
            print(f"📍 Distance to {turf['name']}: {distance:.2f} km")  # Debugging output
            print(f"   User coords: {user_coords}")
            print(f"   Turf coords: {turf_coords}")
            
            if distance <= radius_km:  # ✅ Only include turfs within radius
                print(f"   ✅ Within radius!")
                nearby_turfs.append(turf)
            else:
                print(f"   ❌ Outside radius!")
    
    print(f"✅ Found {len(nearby_turfs)} turfs within {radius_km} km.")  # Debugging output

    return nearby_turfs



def filter_by_price_and_location(user_location, turfs, max_price, radius_km=10):
    nearby_turfs = filter_turfs_by_location(user_location, turfs, radius_km)
    affordable_turfs = [turf for turf in nearby_turfs if turf["price_per_hour"] <= max_price]
    return affordable_turfs

def recommend_turfs(user_id):
    bookings_ref = db.collection("bookings")
    bookings = bookings_ref.stream()
    
    data = []
    for doc in bookings:
        booking = doc.to_dict()
        data.append([booking["user_id"], booking["turf_id"]])
    
    if not data:
        print("⚠️ No bookings found! Showing top-rated turfs instead.")
        return get_top_rated_turfs()

    df = pd.DataFrame(data, columns=["user_id", "turf_id"])
    
    pivot_table = df.pivot_table(index="user_id", columns="turf_id", aggfunc=lambda x: 1, fill_value=0)
    
    similarity_matrix = cosine_similarity(pivot_table)
    similarity_df = pd.DataFrame(similarity_matrix, index=pivot_table.index, columns=pivot_table.index)
    
    if user_id not in similarity_df.index:
        return get_top_rated_turfs()

    similar_users = similarity_df[user_id].sort_values(ascending=False)[1:3].index
    recommended_turf_ids = df[df["user_id"].isin(similar_users)]["turf_id"].unique()
    
    return recommended_turf_ids.tolist()

def get_top_rated_turfs(limit=5):
    turfs_ref = db.collection("turfs").order_by("rating", direction=firestore.Query.DESCENDING).limit(limit)
    docs = turfs_ref.stream()
    
    top_turfs = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        top_turfs.append(data)
    
    return top_turfs

def get_liked_turfs(user_id):
    likes_ref = db.collection("likes").where("user_id", "==", user_id)
    docs = likes_ref.stream()
    
    liked_turfs = [doc.to_dict()["turf_id"] for doc in docs]
    
    if liked_turfs:
        return liked_turfs  # Return liked turfs
    else:
        return get_top_rated_turfs()  # Fallback to best-rated turfs

def filter_by_pricing(turfs, min_price, max_price):
    """
    Filters turfs by price within the specified range.
    """
    return [turf for turf in turfs if min_price <= turf["price_per_hour"] <= max_price]

@app.route("/get_turfs", methods=["GET"])
def get_turfs():
    user_lat = request.args.get("latitude", type=float)
    user_lon = request.args.get("longitude", type=float)
    filter_type = request.args.get("filter", default="location")
    min_price = request.args.get("min_price", default=0, type=float)
    max_price = request.args.get("max_price", default=5000, type=float)

    if user_lat is None or user_lon is None:
        return jsonify({"error": "Missing latitude or longitude"}), 400

    turfs = fetch_turfs()  # Get all turfs from Firestore

    if filter_type == "location":
        turfs = filter_turfs_by_location((user_lat, user_lon), turfs, radius_km=10)  # ✅ Corrected filtering
    elif filter_type == "price":
        turfs = filter_by_pricing(turfs, min_price, max_price)  # Filter by price range

    return jsonify({"turfs": turfs})



# 🔹 API: Save User Booking
@app.route("/save_booking", methods=["POST"])
def save_booking():
    data = request.json
    user_id = data.get("user_id")
    turf_id = data.get("turf_id")
    
    if not user_id or not turf_id:
        return jsonify({"error": "Missing user_id or turf_id"}), 400

    db.collection("bookings").add({"user_id": user_id, "turf_id": turf_id})
    return jsonify({"message": "Booking saved successfully"}), 200

# 🔹 API: Like a Turf
@app.route("/like_turf", methods=["POST"])
def like_turf():
    data = request.json
    user_id = data.get("user_id")
    turf_id = data.get("turf_id")
    
    if not user_id or not turf_id:
        return jsonify({"error": "Missing user_id or turf_id"}), 400

    db.collection("likes").add({"user_id": user_id, "turf_id": turf_id})
    return jsonify({"message": "Turf liked successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True)
