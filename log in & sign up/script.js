const container = document.querySelector(".container");
const signUpLink = document.querySelector(".SignUpLink");
const signInLink = document.querySelector(".SignInLink");

signUpLink.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.add("active");
});

signInLink.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.remove("active");
});

// Validation functions
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(password);
}

function showError(inputElement, message) {
  let error = inputElement.parentNode.querySelector(".error-message");
  if (!error) {
    error = document.createElement("p");
    error.className = "error-message";
    inputElement.parentNode.appendChild(error);
  }
  error.textContent = message;
  error.style.display = "block";
  inputElement.classList.add("input-error");
  inputElement.classList.remove("input-success");
}

function clearError(inputElement) {
  const error = inputElement.parentNode.querySelector(".error-message");
  if (error) error.style.display = "none";
  inputElement.classList.remove("input-error");
}

function showSuccess(inputElement) {
  clearError(inputElement);
  inputElement.classList.add("input-success");
}

/* REGISTER FORM */
const registerForm = document.getElementById("registerForm");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const regRePassword = document.getElementById("regRePassword");

// Live validation
regEmail.addEventListener("input", () => {
  validateEmail(regEmail.value) ? showSuccess(regEmail) : showError(regEmail, "Invalid email format");
});

regPassword.addEventListener("input", () => {
  validatePassword(regPassword.value)
    ? showSuccess(regPassword)
    : showError(regPassword, "6+ chars, 1 uppercase, 1 number, 1 special char");
});

regRePassword.addEventListener("input", () => {
  regPassword.value === regRePassword.value && regRePassword.value !== ""
    ? showSuccess(regRePassword)
    : showError(regRePassword, "Passwords do not match");
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let valid = true;
  if (!validateEmail(regEmail.value)) {
    showError(regEmail, "Invalid email format");
    valid = false;
  }
  if (!validatePassword(regPassword.value)) {
    showError(regPassword, "Invalid password format");
    valid = false;
  }
  if (regPassword.value !== regRePassword.value) {
    showError(regRePassword, "Passwords do not match");
    valid = false;
  }

  if (!valid) return;

  try {
    const response = await fetch("https://your-api.com/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: regEmail.value,
        password: regPassword.value,
        firstName: document.getElementById("regfirstname").value,
        lastName: document.getElementById("reglastname").value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(`❌ ${data.message || "Registration failed"}`);
      return;
    }

    alert("✅ Registration successful! Now login.");
    registerForm.reset();
    [regEmail, regPassword, regRePassword].forEach((i) => {
      clearError(i);
      i.classList.remove("input-success");
    });

    container.classList.remove("active");
  } catch (error) {
    console.error("Registration error:", error);
    alert("❌ Server error. Try again later.");
  }
});

/* LOGIN FORM */
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

// Live validation
loginEmail.addEventListener("input", () => {
  validateEmail(loginEmail.value)
    ? showSuccess(loginEmail)
    : showError(loginEmail, "Enter a valid email");
});

loginPassword.addEventListener("input", () => {
  validatePassword(loginPassword.value)
    ? showSuccess(loginPassword)
    : showError(loginPassword, "Invalid password format");
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let valid = true;

  if (!validateEmail(loginEmail.value)) {
    showError(loginEmail, "Enter a valid email");
    valid = false;
  }

  if (!validatePassword(loginPassword.value)) {
    showError(loginPassword, "Invalid password format");
    valid = false;
  }

  if (!valid) return;

  try {
    const response = await fetch("https://your-api.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail.value,
        password: loginPassword.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(`❌ ${data.message || "Invalid email or password"}`);
      return;
    }

    // Store token and redirect
    localStorage.setItem("token", data.token); // Optional: save JWT
    alert("🎉 Login successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Login error:", error);
    alert("❌ Server error. Try again later.");
  }
});

/* Show/Hide Password Toggle */
document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", () => {
    const targetId = icon.getAttribute("data-target");
    const passwordField = document.getElementById(targetId);
    const type = passwordField.type === "password" ? "text" : "password";
    passwordField.type = type;
    icon.setAttribute("name", type === "text" ? "hide" : "show-alt");
  });
});

/* Forgot Password (API placeholder) */
document
  .querySelector(".form-box.Login .regi-link a")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const email = prompt("Enter your registered email:");
    if (!validateEmail(email)) return alert("❌ Invalid email format");

    try {
      const response = await fetch("https://your-api.com/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("📧 Password reset link sent to " + email);
      } else {
        alert(`❌ ${data.message || "Email not found"}`);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      alert("❌ Server error. Try again later.");
    }
  });
