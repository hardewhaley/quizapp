const validUsername = "user"
const validMatricNumber = "CSC12345";

const form = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const matricInput = document.getElementById("matric-number");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", function (e) {
    e.preventDefault(); // Stop form from submitting immediately

    const username = usernameInput.value.trim();
    const matricNumber = matricInput.value.trim();

    if (
        username === validUsername &&
        matricNumber === validMatricNumber
    ) {
        // Clear error message
        errorMessage.classList.add("hidden");
        errorMessage.textContent = "";

        // Redirect to quiz page
        window.location.href = "/public/quiz.html";
    } else {
        // Show error message
        errorMessage.textContent =
            "Invalid username or matric number.";
        errorMessage.classList.remove("hidden");
    }
});