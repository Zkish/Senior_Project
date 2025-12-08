import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.utils import resample
from datetime import datetime
import numpy as np

df = pd.read_csv("home_repair_dataset_balanced.csv")

df["last_repair_date"] = pd.to_datetime(df["last_repair_date"])
today = pd.to_datetime(datetime.today())
df["days_since_last_repair"] = (today - df["last_repair_date"]).dt.days
df = df.drop(columns=["last_repair_date"])

X = pd.get_dummies(
    df.drop("target", axis=1),
    columns=["region", "season"],
    drop_first=True
)

y = df["target"]

data = pd.concat([X, y], axis=1)

majority = data[data.target == 1]
minority = data[data.target == 0]

minority_up = resample(
    minority,
    replace=True,
    n_samples=len(majority),
    random_state=42
)

data_balanced = pd.concat([majority, minority_up])

X = data_balanced.drop("target", axis=1)
y = data_balanced["target"]

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X, y)

joblib.dump(model, "risk_model.pkl")
joblib.dump(X.columns.tolist(), "train_columns.pkl")

scores = model.predict_proba(X)[:,1]
low, med, high = np.quantile(scores, [0.25, 0.50, 0.75])

joblib.dump((low, med, high), "score_thresholds.pkl")

print("Model trained and saved successfully.")
print("Balanced dataset size:", X.shape)
print("Score thresholds saved:")
print("Low:", low)
print("Med:", med)
print("High:", high)
