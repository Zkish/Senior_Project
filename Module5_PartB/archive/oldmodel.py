import pandas as pd
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
import numpy as np
import matplotlib.pyplot as plt
import joblib

# dataset utilized
df = pd.read_csv('home_repair_dataset_balanced.csv')

# data processing (converting data to number)
df['last_repair_date'] = pd.to_datetime(df['last_repair_date'])
df['days_since_last_repair'] = (datetime.today() - df['last_repair_date']).dt.days
df.drop('last_repair_date', axis=1, inplace=True)


X = pd.get_dummies(df.drop('target', axis=1), columns=['region','season'], drop_first=True)
y = df['target']

# machine training (random forest model)
model = RandomForestClassifier(random_state=42)
model.fit(X, y)

from sklearn.preprocessing import MinMaxScaler

#risk scores
scores = model.predict_proba(X)[:, 1]

# creating noise (data spread is pretty low so it helps ensure the results are varied)
noise = np.random.normal(0, 0.01, len(scores))
scores = scores + noise
scores = np.clip(scores, 0, 1)

scaler = MinMaxScaler()
scores = scaler.fit_transform(scores.reshape(-1,1)).flatten()

df['risk_score'] = scores

# segmentations based on risk
ranks = pd.qcut(
    df['risk_score'].rank(method='first'),
    4,
    labels=['Low Risk','Medium Risk','High Risk','Extreme Risk']
)

df['risk_category'] = ranks


# display sample results
print(df[['home_age','hvac_age','roof_age','risk_score','risk_category']].head())

print("\nRisk Category Counts:")
print(df['risk_category'].value_counts())

print("\nAverage values by risk category:")
print(df.groupby('risk_category')[['home_age','hvac_age','roof_age','repairs_last_12m']].mean())

# bar chart (should look even)
df['risk_category'].value_counts().plot(kind='bar', title='Home Risk Segmentation')
plt.show()

# creates document for application uses
model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, "risk_model.pkl")
