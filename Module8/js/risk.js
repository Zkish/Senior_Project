    // mobile toggle
    function toggleMenu() {
      const navLinks = document.getElementById('nav-links');
      navLinks.classList.toggle('show');
    }

    // form handling
    document.getElementById("risk-form").addEventListener("submit", async function(e) {
      e.preventDefault();

      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      for (let key in data) {
        data[key] = Number(data[key]);
      }

      const response = await fetch("http://localhost:3001/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });

      const result = await response.json();

      // display results
      document.getElementById("results").innerHTML = `
        <p>Risk Score: ${result.risk_score}</p>
        <p>Risk Category: ${result.risk_category}</p>
      `;
    });