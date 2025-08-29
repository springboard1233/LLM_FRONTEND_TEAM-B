const container = document.querySelector('.container');
const loginLink = document.querySelector('.SignInLink');
const registerLink = document.querySelector('.SignUpLink');

// Switch forms
registerLink.addEventListener('click', () => {
    container.classList.add('active');
});
loginLink.addEventListener('click', () => {
    container.classList.remove('active');
});

// REGISTER
document.querySelector(".form-box.Register form").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = this.querySelector("input[type='text']").value.trim();
    const email = this.querySelector("input[type='email']").value.trim();
    const password = this.querySelector("input[type='password']").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.username === username)) {
        alert("❌ Username already exists!");
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("✅ Registration successful! Please login.");
    container.classList.remove("active"); // back to login
});

// LOGIN
document.querySelector(".form-box.Login form").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = this.querySelector("input[type='text']").value.trim();
    const password = this.querySelector("input[type='password']").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("✅ Login successful!");
        window.location.href = "dashboard.html";
    } else {
        alert("❌ Invalid username or password!");
    }
});
