 document.getElementById("changePasswordForm").addEventListener("submit", async function(event){
            event.preventDefault();
        
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmpassword").value;
            const email = localStorage.getItem("resetEmail"); // stored from previous step
        
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
        
            if (!email) {
                alert("No email found, Likely a System Error Restart Password Change Process");
                window.location.href = "forgotpassword.html";
                return;
            }
        
            try {
                const response = await fetch("/reset-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, newPassword: password })
                });
        
                const result = await response.json();
        
                if (result.success) {
                    alert("Password changed successfully");
                    localStorage.removeItem("resetEmail");
                    window.location.href = "main.html";
                } else {
                    alert("Error Changing Password: " + result.message);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Server error. Please try again.");
            }
        });