import pandas as pd
import json

# Load JSON data
with open("userDataset.json", "r") as user_file:
    user_data = json.load(user_file)

with open("turfDataset.json", "r") as turf_file:
    turf_data = json.load(turf_file)

# Extract user IDs and turf names
user_ids = [user["user_id"] for user in user_data]
turf_names = [turf["name"] for turf in turf_data]

# Create an empty matrix with users as rows and turfs as columns
user_turf_matrix = pd.DataFrame(0, index=user_ids, columns=turf_names)

# Fill matrix with 1 if the user has booked the turf
for user in user_data:
    for booked_turf in user["booking_history"]:
        if booked_turf in turf_names:
            user_turf_matrix.loc[user["user_id"], booked_turf] = 1

# Save the matrix as a CSV file
user_turf_matrix.to_csv("user_turf_matrix.csv", index=True)

print("User-Turf Matrix generated successfully! Check user_turf_matrix.csv")
