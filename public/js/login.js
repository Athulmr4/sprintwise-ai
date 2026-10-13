
"use strict";

const form = document.getElementById("login-form");
const errorMessage = document.getElementById("login-error");
const loginButton = document.getElementById("login-button");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify({
                email: form.email.value.trim(),
                password: form.password.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to sign in.");
        }

        // The browser stores the HttpOnly cookie from Set-Cookie.
        window.location.assign("/dashboard");
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove("hidden");
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Sign in";
    }
});
