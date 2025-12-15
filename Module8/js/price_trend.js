    // Fake data / data not up to date for use case
    // Structure: fakeDatabase[city][material] = array of monthly prices
    const fakeDatabase = {
      "pittsburgh": {
        "lumber": [120, 130, 128, 140, 150, 160],
        "concrete": [90, 95, 100, 110, 115, 120],
        "steel": [200, 210, 215, 220, 230, 240]
      },
      "new york": {
        "lumber": [180, 190, 200, 210, 220, 240],
        "concrete": [140, 150, 160, 170, 180, 190],
        "steel": [260, 270, 280, 300, 320, 340]
      },
      "chicago": {
        "lumber": [140, 145, 150, 160, 170, 175],
        "concrete": [100, 105, 110, 115, 120, 125],
        "steel": [190, 195, 200, 205, 215, 225]
      },
      "los angeles": {
        "lumber": [200, 205, 210, 215, 230, 250],
        "concrete": [130, 135, 138, 142, 150, 160],
        "steel": [250, 260, 270, 280, 290, 310]
      }
    };

    // Labels for the demo months
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]; 

    let chart = null;

    function normalizeCityKey(city) {
      return city.trim().toLowerCase();
    }

    function findCityData(cityInput) {
      const key = normalizeCityKey(cityInput);
      // direct lookup
      if (fakeDatabase[key]) return { key, data: fakeDatabase[key] };
      // try approximate matching: check if any key starts with the same words
      const foundKey = Object.keys(fakeDatabase).find(k => k.startsWith(key) || key.startsWith(k));
      if (foundKey) return { key: foundKey, data: fakeDatabase[foundKey] };
      return null;
    }

    function loadCityData() {
      const city = document.getElementById("cityInput").value;
      const materialSelect = document.getElementById("materialSelect");
      if (!materialSelect) {
        alert('Internal error: material select not found.');
        return;
      }
      const material = materialSelect.value;

      if (!city || !city.trim()) return alert("Please enter a city name.");

      const found = findCityData(city);
      if (!found) {
        alert("No data found for this city. Try Pittsburgh, New York, Chicago, or Los Angeles.");
        return;
      }

      const cityData = found.data;
      if (!cityData[material]) {
        alert(`No data for material '${material}' in ${city}.`);
        return;
      }

      renderChart(found.key, material, cityData[material]);
    }

    // helper to call from test-case buttons
    function loadCityDataWith(city, material) {
      document.getElementById('cityInput').value = city;
      document.getElementById('materialSelect').value = material;
      loadCityData();
    }

    function clearChart() {
      if (chart) {
        chart.destroy();
        chart = null;
      }
    }

    function renderChart(cityKey, material, data) {
      clearChart();
      const ctx = document.getElementById('priceChart').getContext('2d');
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `${material.charAt(0).toUpperCase() + material.slice(1)} costs — ${toTitleCase(cityKey)}`,
            data: data,
            borderWidth: 3,
            tension: 0.3,
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                callback: function(value) { return `$${value}`; }
              }
            }
          },
          plugins: {
            legend: { display: true }
          }
        }
      });
    }

    function toTitleCase(str) {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    // Run a default sample on load to show the UI is working
    window.addEventListener('DOMContentLoaded', () => {
      // default sample
      loadCityDataWith('Pittsburgh','lumber');
    });