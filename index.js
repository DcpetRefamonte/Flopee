 document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault(); // stop the page from refreshing or redirecting

      const email = emailInput.value;
      const password = passwordInput.value;

      // Dummy credentials for demo purposes
      const validEmail = "user@example.com";
      const validPassword = "123456";

      if (email === validEmail && password === validPassword) {
        alert("Login successful!");
        window.location.href = "flopee.html"; // go to the main page
      } else {
        alert("Invalid email or password. Try again.");
      }
    });
  });

