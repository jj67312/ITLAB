const showPassword = document.querySelector(".fa-eye");

const form = document.querySelector("form");
const emailField = form.querySelector(".group2");
const passField = form.querySelector(".group3");
const pass = passField.querySelector(".password");
const mail = emailField.querySelector(".email");

showPassword.addEventListener("click", function () {
  // toggle the type attribute to hide password
  const type = pass.getAttribute("type") === "password" ? "text" : "password";
  pass.setAttribute("type", type);

  // toggle the eye slash icon
  this.classList.toggle("fa-eye-slash");
});

function checkPass() {
  const passPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!pass.value.match(passPattern)) {
    return passField.classList.add("invalid");
  }
  passField.classList.remove("invalid");
}

function checkEmail() {
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!mail.value.match(emailPattern)) {
    return emailField.classList.add("invalid");
  }
  emailField.classList.remove("invalid");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkPass();
  checkEmail();

  mail.addEventListener("keyup", checkEmail);
  pass.addEventListener("keyup", checkPass);

  if (
    !emailField.classList.contains("invalid") &&
    !passField.classList.contains("invalid")
  ) {
    location.href = form.getAttribute("action");
  }
});
