const showPassword = document.querySelector(".fa-eye");

const form = document.querySelector("form");
const emailField = form.querySelector(".group2");
const passField = form.querySelector(".group3");
const pass = passField.querySelector(".password");
//const mail = emailField.querySelector(".email");

showPassword.addEventListener("click", function () {
  // toggle the type attribute to hide password
  const type = pass.getAttribute("type") === "password" ? "text" : "password";
  pass.setAttribute("type", type);

  // toggle the eye slash icon
  this.classList.toggle("fa-eye-slash");
});

