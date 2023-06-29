const dropdownBtn = document.querySelector(".dropdown-btn");
const dropdownCaret = document.querySelector(".arrow");
const dropdownContent = document.querySelector(".dropdown-content");

// add click event to dropdown button
dropdownBtn.addEventListener("click", () => {
  // add rotate to caret element
  dropdownCaret.classList.toggle("arrow-rotate");
  // add open styles to menu element
  dropdownContent.classList.toggle("menu-open");
  dropdownBtn.setAttribute(
    "aria-expanded",
    dropdownBtn.getAttribute("aria-expanded") === "true" ? "false" : "true"
  );
});

function hamToogle() {
  document.getElementById("menu").classList.toggle("icon");
  document.querySelector(".hamMenu").classList.toggle('hamChange');
}

const productGrids = document.getElementsByClassName("product-grid");
productGrids[0].style.display="grid";
  for(let i = 1; i<productGrids.length; i++) {
    productGrids[i].style.display="none";
  }

function showProductGrid(categoryIndex) {
  const productGrids = document.getElementsByClassName("product-grid");

  for (let i = 0; i < productGrids.length; i++) {
    if (i === categoryIndex) {
      productGrids[i].style.display = "grid";
    } else {
      productGrids[i].style.display = "none";
    }
  }
}