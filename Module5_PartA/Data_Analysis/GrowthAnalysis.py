import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

""" #Static Variables
StartPopulation = 1_000_000
PopulationGrowth = 0.0109  # 1.09% per year
SpendingYearBase = 62_000
SpendingIncreaseWithPopulation = 0.04  # 4% per year

#Simulation Years
GrowYears = 20
years = np.arange(GrowYears)

#Algorithms
population = StartPopulation * ((1 + PopulationGrowth) ** years)
spending = SpendingYearBase * ((1 + SpendingIncreaseWithPopulation) ** years)

#Regression Line
model = LinearRegression()
model.fit(population.reshape(-1, 1), spending)
spending_pred = model.predict(population.reshape(-1, 1))

#Graphing Config
plt.figure(figsize=(10, 6))
plt.scatter(spending, population, color='blue', label='Actual Data')
plt.plot(spending_pred, population, color='red', linewidth=2, label='Regression Line')
plt.title("Increase in Spending for Remodels as Population Grows")
plt.xlabel("Spending ($)")
plt.ylabel("Population")
plt.legend()
plt.grid(True)
plt.show()

print(f"Regression Equation: y = {model.coef_[0]:.6f}x + {model.intercept_:.2f}")   """


# ---------------------------------------------------------
# Additional Analysis for HomeKit DIY Project Estimation
# ---------------------------------------------------------

# Synthetic DIY project dataset
project_size = np.array([80, 120, 150, 200, 250, 300, 350, 400])  # square feet
project_cost = np.array([600, 850, 1100, 1450, 1700, 2100, 2450, 2800])  # dollars

# Regression: Cost vs Size
diy_model = LinearRegression()
diy_model.fit(project_size.reshape(-1, 1), project_cost)
diy_pred = diy_model.predict(project_size.reshape(-1, 1))

# Graph: DIY Cost as Size Increases
plt.figure(figsize=(10, 6))
plt.scatter(project_size, project_cost, color='purple', label='Actual DIY Costs')
plt.plot(project_size, diy_pred, color='black', linewidth=2, label='Regression Line')

plt.title("Estimated DIY Project Cost vs Project Size")
plt.xlabel("Project Size (sq ft)")
plt.ylabel("Estimated Cost ($)")
plt.grid(True)
plt.legend()
plt.show()

print("\nDIY Regression Equation:")
print(f"Cost = {diy_model.coef_[0]:.2f} * Size + {diy_model.intercept_:.2f}")

