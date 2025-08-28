
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const signUpLink = document.querySelector(".SignUpLink");
  const signInLink = document.querySelector(".SignInLink");


  const openRegister = (e) => {
    if (e) e.preventDefault();
    container.classList.add("active");
  };

  const openLogin = (e) => {
    if (e) e.preventDefault();
    container.classList.remove("active");
  };

  if (signUpLink) signUpLink.addEventListener("click", openRegister);
  if (signInLink) signInLink.addEventListener("click", openLogin);

  
  const loginForm = document.querySelector(".form-box.Login form");
  const registerForm = document.querySelector(".form-box.Register form");

 
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const [usernameEl, emailEl, passwordEl] = registerForm.querySelectorAll("input");
      const username = usernameEl?.value?.trim() || "";
      const email = emailEl?.value?.trim() || "";
      const password = passwordEl?.value || "";

      if (!username) return alert("Please enter a username.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Please enter a valid email address.");
      if (password.length < 6) return alert("Password must be at least 6 characters.");

      
      localStorage.setItem(
        username,
        JSON.stringify({ email, password })
      );

      alert("Registration successful! Please log in.");
      openLogin();
    });
  }

 
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const [usernameEl, passwordEl] = loginForm.querySelectorAll("input");
      const username = usernameEl?.value?.trim() || "";
      const password = passwordEl?.value || "";

      if (!username || !password) {
        return alert("Please enter both username and password.");
      }

    
      const storedUser = localStorage.getItem(username);
      if (!storedUser) {
        return alert("User not found. Please register first.");
      }

      const { password: storedPassword } = JSON.parse(storedUser);

      if (password === storedPassword) {
        console.log("Login success:", username);

        window.location.href = "dashboard.html";
      } else {
        alert("Incorrect password. Try again.");
      }
    });
  }
});
