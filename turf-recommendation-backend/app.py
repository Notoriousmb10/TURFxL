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


@app.route('/create_user', methods=['POST'])
def create_user():
    user_data = request.json
    user_id = str(user_data.get("user_id"))
        
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    user_ref = db.collection("users").document(user_id)
    user_doc = user_ref.get()

    if user_doc.exists:
        return jsonify({"message": "User already exists"}), 200

    user_ref.set(user_data)
    return jsonify({"message": "User created successfully"}), 201

@app.route('/handle_booking', methods=['POST'])
def handle_booking():
    try:
        turf_data = request.json
        print("Received Turf Data:", turf_data)  # ✅ Debugging log

        user_id = str(turf_data.get("user_id"))
        turf_name = turf_data.get("name")
        amount = turf_data.get("amount")

        # ✅ Improved error handling
        if not user_id:
            return jsonify({"error": "Missing user_id"}), 400
        if not turf_name:
            return jsonify({"error": "Missing turf name"}), 400
        if amount is None:
            return jsonify({"error": "Missing amount"}), 400

        # Firestore references
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        user_data = user_doc.to_dict()

        # ✅ Append booking history
        if "booking_history" not in user_data:
            user_data["booking_history"] = []
        user_data["booking_history"].append(turf_name)

        # ✅ Update preferred price range if it exists
        if "preferred_price_range" in user_data:
            user_data["preferred_price_range"][1] = amount
        else:
            user_data["preferred_price_range"] = [0, amount]

        # ✅ Update Firestore
        user_ref.update(user_data)

        return jsonify({"message": "User data updated successfully"}), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

    


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


def get_similar_users(user_id):
    """
    Finds users who have similar booking history using Jaccard Similarity.
    Returns a list of top 5 similar user IDs.
    """
    users_ref = db.collection("users")
    users_docs = users_ref.stream()
    
    user_doc = users_ref.document(user_id).get()
    if not user_doc.exists:
        return []

    user_data = user_doc.to_dict()
    user_bookings = set(user_data.get("booking_history", []))

    similar_users = []

    for doc in users_docs:
        other_user = doc.to_dict()
        other_user_id = doc.id

        if other_user_id != user_id and "booking_history" in other_user:
            other_bookings = set(other_user["booking_history"])
            intersection = len(user_bookings.intersection(other_bookings))
            union = len(user_bookings.union(other_bookings))

            # Calculate Jaccard Similarity
            if union > 0:
                similarity_score = intersection / union
                if similarity_score > 0:  # Ignore completely dissimilar users
                    similar_users.append((other_user_id, similarity_score))

    # Sort by similarity score in descending order
    similar_users.sort(key=lambda x: x[1], reverse=True)

    return [user[0] for user in similar_users[:10]]  # Get top 5 similar users

@app.route("/recommend_turfs_based_on_booking_history", methods=["GET"])
def recommend_based_on_booking_history():
    user_id = request.args.get("user_id")
    """
    Recommend turfs based on similar users' booking history.
    """
    similar_users = get_similar_users(user_id)
    if not similar_users:
        return get_top_rated_turfs()  # If no similar users, return popular turfs

    # Get the current user's bookings
    user_ref = db.collection("users").document(user_id)
    user_data = user_ref.get().to_dict()
    user_bookings = set(user_data.get("booking_history", []))

    turf_recommendations = {}

    for similar_user_id in similar_users:
        similar_user_ref = db.collection("users").document(similar_user_id)
        similar_user_data = similar_user_ref.get().to_dict()

        if "booking_history" in similar_user_data:
            for turf in similar_user_data["booking_history"]:
                if turf not in user_bookings:  # Recommend only unbooked turfs
                    if turf in turf_recommendations:
                        turf_recommendations[turf] += 1  # Increase score if multiple similar users booked it
                    else:
                        turf_recommendations[turf] = 1

    # Sort turfs by most frequently booked by similar users
    recommended_turfs = sorted(turf_recommendations, key=turf_recommendations.get, reverse=True)[:10]

    # Get full details of turfs
    return [{"name": turf, "details": get_turf_details(turf)} for turf in recommended_turfs]


    

@app.route('/recommend_turfs_location_based', methods=['GET'])
def handle_for_new_users():
    user_ref = db.collection('users')
    user_docs = user_ref.stream()
    latitude = request.args.get("latitude", type=float)
    longitude = request.args.get("longitude", type=float)
    user_location = (latitude, longitude)
    
    nearby_users = []
    for doc in user_docs:
        user_data = doc.to_dict()
        if "location" in user_data:
            user_cords = (user_data["location"]["lat"], user_data["location"]["lng"])
            distance = geodesic(user_location, user_cords).km
            
            if distance <= 10:
                nearby_users.append(user_data)
                
    if not nearby_users:
        return get_top_rated_turfs()
    
    turf_count = {}
    for user in nearby_users:
        if "booking_history" in user:
            for turf in user["booking_history"]:
                if turf in turf_count:
                    turf_count[turf] += 1
                else:
                    turf_count[turf] = 1
    top_turfs = sorted(turf_count, key=turf_count.get, reverse=True)[:15]
    top_turf_details = [{"name": turf, "details": get_turf_details(turf)} for turf in top_turfs]
    return top_turf_details


def get_turf_details(turf_name):
    turf_ref = db.collection('turfs').where("name", "==", turf_name).stream()  # Search by name field
    for doc in turf_ref:
        return doc.to_dict()  # Return first match

    # If no match found, return default
    return {"name": turf_name, "price": "Unknown", "location": "Unknown", "amenities": []}
     
            
            
    
    


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
