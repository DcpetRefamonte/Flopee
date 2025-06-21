document.getElementById('closeModal').onclick = function () {
  document.getElementById('signUpModal').style.display = 'none';
};

window.onclick = function (event) {
  const modal = document.getElementById('signUpModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

document.getElementById('openSignUpLink').onclick = function (e) {
  e.preventDefault();
  document.getElementById('signUpModal').style.display = 'block';
};

document.querySelector('#signUpModal form').onsubmit = function (e) {
  e.preventDefault();

  const username = e.target[0].value.trim();
  const password = e.target[1].value;
  const confirmPassword = e.target[2].value;

  if (username.includes("_")) {
    alert("Username must not contain underscores.");
    return;
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const exists = users.some(user => user.username === username);
  if (exists) {
    alert("Username already exists. Please choose another.");
    return;
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created successfully!");

  e.target[0].value = '';
  e.target[1].value = '';
  e.target[2].value = '';
  document.getElementById('signUpModal').style.display = 'none';
};

document.querySelector('.login-input form').onsubmit = function (e) {
  e.preventDefault();

  const inputUsername = e.target[0].value.trim();
  const inputPassword = e.target[1].value;
  const rememberMe = document.querySelector('.remember-forgot input[type="checkbox"]').checked;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const found = users.find(user => user.username === inputUsername && user.password === inputPassword);

  if (found) {
    if (rememberMe) {
      localStorage.setItem("rememberedUsername", inputUsername);
      localStorage.setItem("rememberedPassword", inputPassword);
    } else {
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberedPassword");
    }

    alert("Login successful!");
    window.location.href = "flopee.html";
  } else {
    alert("Incorrect username or password.");
  }
};

window.onload = function () {
  const rememberedUsername = localStorage.getItem("rememberedUsername");
  const rememberedPassword = localStorage.getItem("rememberedPassword");

  if (rememberedUsername && rememberedPassword) {
    const loginForm = document.querySelector('.login-input form');
    loginForm[0].value = rememberedUsername;
    loginForm[1].value = rememberedPassword;
    document.querySelector('.remember-forgot input[type="checkbox"]').checked = true;
  }
};
