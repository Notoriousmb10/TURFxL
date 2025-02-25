import pandas as pd

# Load the User-Turf Matrix
user_turf_matrix = pd.read_csv("user_turf_matrix.csv", index_col=0)

# Display the first few rows
print(user_turf_matrix.head())
