from surprise import SVD, Dataset, Reader
from surprise.model_selection import train_test_split
import pandas as pd

# Load the User-Turf Matrix
user_turf_matrix = pd.read_csv("user_turf_matrix.csv", index_col=0)

# Convert matrix into AI-readable format
data = []
for user_id in user_turf_matrix.index:
    for turf_id in user_turf_matrix.columns:
        rating = user_turf_matrix.loc[user_id, turf_id]
        if rating > 0:
            user_turf_matrix.loc[user_id, turf_id] += 1  # Increase rating for repeat bookings
            data.append((user_id, turf_id, user_turf_matrix.loc[user_id, turf_id]))  # Append correct ratings

# Save updated matrix
user_turf_matrix.to_csv("user_turf_matrix_updated.csv")

# Convert data into Surprise dataset format
reader = Reader(rating_scale=(1, 5))  # Use correct rating scale
df = pd.DataFrame(data, columns=["user_id", "turf_id", "rating"])
dataset = Dataset.load_from_df(df, reader)

# Split dataset properly
trainset, testset = train_test_split(dataset, test_size=0.2)

# Train SVD model
model = SVD()
model.fit(trainset)

# Predict rating for a specific user and turf
user_id = "user_101"
turf_id = "Urban Sports Zone Thakur Kandivali"

predicted_rating = model.predict(user_id, turf_id).est
print(f"Predicted rating for {user_id} on {turf_id}: {predicted_rating:.2f}")

# Function to recommend top N turfs for a user
def recommend_turfs(user_id, model, user_turf_matrix, top_n=5):
    turfs = user_turf_matrix.columns
    predictions = []

    for turf_id in turfs:
        if user_turf_matrix.loc[user_id, turf_id] == 0:  # Only predict for unbooked turfs
            prediction = model.predict(user_id, turf_id)
            predictions.append((turf_id, prediction.est))

    # Sort predictions by highest rating
    predictions.sort(key=lambda x: x[1], reverse=True)
    
    return predictions[:top_n]

# Get top 5 recommended turfs for user_101
recommended_turfs = recommend_turfs("user_101", model, user_turf_matrix, top_n=5)

# Print recommendations
print("\nTop 5 Recommended Turfs for user_101:")
for turf, rating in recommended_turfs:
    print(f"{turf}: {rating:.2f}")
