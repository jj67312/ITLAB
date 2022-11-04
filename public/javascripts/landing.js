var toggle_btn;
var final_wrapper;

function reset() {
  toggle_btn = document.querySelector(".toggle-btn");
  final_wrapper = document.querySelector(".final-wrapper");
}

const main = document.querySelector("main");

reset();
let dark = false;

function toggleAnimation() {
  
  // Clone the final-wrapper div
  dark = !dark;
  let clone = final_wrapper.cloneNode(true);
  if (dark) {
    clone.classList.remove("light");
    clone.classList.add("dark");
  } else {
    clone.classList.remove("dark");
    clone.classList.add("light");
  }
  clone.classList.add("copy");
  main.appendChild(clone);

  clone.addEventListener("animationend", () => {
    final_wrapper.remove();
    clone.classList.remove("copy");

    // Reset variables
    reset();
    events();
  });
}

function events() {
  toggle_btn.addEventListener("click", toggleAnimation);
}

events();

