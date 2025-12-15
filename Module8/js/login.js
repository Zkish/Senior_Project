    async function login() {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const errorMsg = document.getElementById("errorMsg");
  
      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
  
        const result = await response.json();
  
        if (result.success) {
          window.location.href = "main.html";
        } else {
          errorMsg.textContent = result.message || "Invalid credentials.";
        }
  
      } catch (err) {
        console.error("Login error:", err);
        errorMsg.textContent = "Server error — please try again.";
      }
    }