        (async () => {
          try {
            const res = await fetch("/auth-check");
            const data = await res.json();
        
            if (!data.loggedIn) {
              window.location.href = "login.html";
            }
          } catch (err) {
            console.error("Auth check failed:", err);
            window.location.href = "login.html";
          }
        })();