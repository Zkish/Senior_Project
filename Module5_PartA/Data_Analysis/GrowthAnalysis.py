import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

#Static Variables
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

print(f"Regression Equation: y = {model.coef_[0]:.6f}x + {model.intercept_:.2f}")
