async function createAccount(event) {
    event.preventDefault(); // won't allow default form submittion

    // data handling
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMsg = document.getElementById("errorMsg");

    errorMsg.textContent = "";

    // validation (empty or non-matched fields)
    if (!username || !email || !password) {
        errorMsg.textContent = "All fields are required.";
        return;
      }

      if (password !== confirmPassword) {
        errorMsg.textContent = "Passwords do not match.";
        return;
      }

      // fetch route to post new account to database (or return that it cant occur)

      try {
        const response = await fetch("/create-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        });

        const result = await response.json();

        if (result.success) {
          window.location.href = "login.html";
        } else {
          errorMsg.textContent = result.message || "Account creation failed.";
        }
      } catch (err) {
        console.error("Account creation error:", err);
        errorMsg.textContent = "Server error. Please try again.";
      }
    }