const container = document.querySelector(".container");
const signUpLink = document.querySelector(".SignUpLink");
const signInLink = document.querySelector(".SignInLink");
const passwordError = document.getElementById("passwordError");

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

// Password match validation + Register
const registerForm = document.getElementById("registerForm");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const regRePassword = document.getElementById("regRePassword");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (regPassword.value !== regRePassword.value) {
    passwordError.style.display = "block";
    regPassword.classList.add("input-error");
    regRePassword.classList.add("input-error");
    return;
  }

  passwordError.style.display = "none";
  regPassword.classList.remove("input-error");
  regRePassword.classList.remove("input-error");

  // Save user data in localStorage
  const user = {
    email: regEmail.value,
    password: regPassword.value,
  };
  localStorage.setItem("user", JSON.stringify(user));

  alert("✅ Registration successful! Now login.");
  registerForm.reset();

  // Switch back to login screen
  container.classList.remove("active");
});

// Show/Hide password toggle
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

// Handle login form
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

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
    // Redirect to dashboard or another page
    window.location.href = "dashboard.html";
  } else {
    alert("❌ Invalid email or password");
  }
});
