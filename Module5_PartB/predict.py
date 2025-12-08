import sys
import json

data = json.loads(sys.stdin.read())

home_age = data["home_age"]
roof_age = data["roof_age"]
hvac_age = data["hvac_age"]
water_heater_age = data["water_heater_age"]
repairs = data["repairs_last_12m"]
maint = data["maint_check"]
region = data["region"]
season = data["season"]

risk = 0

risk += home_age * 1.3
risk += roof_age * 2.0
risk += hvac_age * 1.8
risk += water_heater_age * 1.2
risk += repairs * 3.0

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
