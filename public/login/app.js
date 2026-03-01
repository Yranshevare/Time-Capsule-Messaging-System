const server = "https://time-capsule-messaging-system.onrender.com";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop page reload

    const username = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${server}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Login successful ✅");

            // Example: store token (if your backend sends one)
            // if (data.token) {
            //     localStorage.setItem("token", data.token);
            // }

            // redirect (optional)
            window.location.href = "/dashboard/index.html";
        } else {
            alert(data.message || "Login failed ❌");
        }

    } catch (err) {
        console.error(err);
        alert("Server error 🚨");
    }
});