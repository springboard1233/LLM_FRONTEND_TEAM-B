const container = document.querySelector(".container");
const signUpLink = document.querySelector(".SignUpLink");
const signInLink = document.querySelector(".SignInLink");

// Switch to Register
signUpLink.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.add("active");
});

// Switch to Login
signInLink.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.remove("active");
});

/* Helper Functions*/
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

/* Register Form */
const registerForm = document.getElementById("registerForm");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const regRePassword = document.getElementById("regRePassword");

// Live validation for Register
regEmail.addEventListener("input", () => {
  if (validateEmail(regEmail.value)) {
    showSuccess(regEmail);
  } else {
    showError(regEmail, "Invalid email format");
  }
});

regPassword.addEventListener("input", () => {
  if (validatePassword(regPassword.value)) {
    showSuccess(regPassword);
  } else {
    showError(
      regPassword,
      "6+ chars, 1 uppercase, 1 number, 1 special char"
    );
  }
});

regRePassword.addEventListener("input", () => {
  if (regPassword.value === regRePassword.value && regRePassword.value !== "") {
    showSuccess(regRePassword);
  } else {
    showError(regRePassword, "Passwords do not match");
  }
});

// On submit (final check)
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  if (!validateEmail(regEmail.value)) {
    showError(regEmail, "Invalid email format");
    valid = false;
  }

  if (!validatePassword(regPassword.value)) {
    showError(
      regPassword,
      "Password must be 6+ chars, 1 uppercase, 1 number, 1 special char"
    );
    valid = false;
  }

  if (regPassword.value !== regRePassword.value) {
    showError(regRePassword, "Passwords do not match");
    valid = false;
  }

  if (valid) {
    const user = {
    fullName: 
    document.getElementById("regfirstname").value + " " + 
    document.getElementById("reglastname").value,
      email: regEmail.value,
      password: regPassword.value,
      member_since: new Date().toLocaleString("default", { month: "long", year: "numeric" })
    };
    localStorage.setItem("user", JSON.stringify(user));

    alert("✅ Registration successful! Now login.");
    registerForm.reset();

    [regEmail, regPassword, regRePassword].forEach((i) => {
      clearError(i);
      i.classList.remove("input-success");
    });

    container.classList.remove("active");
  }
});

/* Login Form */
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

// Live validation for Login
loginEmail.addEventListener("input", () => {
  if (validateEmail(loginEmail.value)) {
    showSuccess(loginEmail);
  } else {
    showError(loginEmail, "Enter a valid email");
  }
});

loginPassword.addEventListener("input", () => {
  if (validatePassword(loginPassword.value)) {
    showSuccess(loginPassword);
  } else {
    showError(
      loginPassword,
      "Invalid password format"
    );
  }
});

loginForm.addEventListener("submit", (e) => {
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

  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser) {
    alert("❌ No user found. Please register first.");
    return;
  }

  if (
    loginEmail.value === storedUser.email &&
    loginPassword.value === storedUser.password
  ) {
    alert("🎉 Login successful!");

    localStorage.setItem("currentUser", JSON.stringify(storedUser));
   
    window.location.href = "dashboard.html";
  } else {
    alert("❌ Invalid email or password");
  }
});

/*Show/Hide Password Toggle */
document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", () => {
    const targetId = icon.getAttribute("data-target");
    const passwordField = document.getElementById(targetId);

    if (passwordField.type === "password") {
      passwordField.type = "text";
      icon.setAttribute("name", "hide");
    } else {
      passwordField.type = "password";
      icon.setAttribute("name", "show-alt");
    }
  });
});

/* Forgot Password */
document
  .querySelector(".form-box.Login .regi-link a")
  .addEventListener("click", (e) => {
    e.preventDefault();
    const email = prompt("Enter your registered email:");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.email === email) {
      alert("📧 Password reset link sent to " + email);
    } else {
      alert("❌ Email not found.");
    }
  });