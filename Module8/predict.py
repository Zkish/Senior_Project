import sys
import json

data = json.loads(sys.stdin.read())

home_age = int(data["home_age"])
roof_age = int(data["roof_age"])
hvac_age = int(data["hvac_age"])
water_heater_age = int(data["water_heater_age"])
repairs = int(data["repairs_last_12m"])
maint = int(data["maint_check"])
region = int(data["region"])
season = int(data["season"])

risk = 0

# risk calculators added risk caps so one element isn't too damaging, and lowered some of the multipliers
risk += min(max(home_age - 30, 0) * 0.8, 40)

if roof_age > 5:
    risk += min((roof_age - 5) * 2.0, 50)

if hvac_age > 3:
    risk += min((hvac_age - 3) * 1.5, 40)
risk += min(water_heater_age * 1.2, 30)

risk += min(repairs * 2.0, 20)

if maint:
    risk *= 0.8

region_factor = {
    1: 1.2,
    2: 1.1,
    3: 1.0,
    4: 0.9,
    5: 1.0
}

season_factor = {
    1: 1.2,
    2: 1.0,
    3: 0.9,
    4: 1.1
}

risk *= region_factor.get(region, 1)
risk *= season_factor.get(season, 1)

if risk < 30:
    category = "Low Risk"
elif risk < 60:
    category = "Medium Risk"
elif risk < 90:
    category = "High Risk"
else:
    category = "Extreme Risk"

print(json.dumps({
    "risk_score": round(risk, 2),
    "risk_category": category
}))

sys.stdout.flush()
