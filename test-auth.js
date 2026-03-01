const testAuth = async () => {
  try {
    console.log("Testing POST /register...");
    const regRes = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "testuser", password: "testpassword" })
    });
    const regData = await regRes.json();
    console.log("Register response:", regRes.status, regData);

    console.log("Testing POST /login...");
    const loginRes = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "testuser", password: "testpassword" })
    });
    const loginData = await loginRes.json();
    console.log("Login response:", loginRes.status, loginData);
  } catch (error) {
    console.error("Test failed:", error);
  }
};

testAuth();
