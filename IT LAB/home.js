const modal = document.querySelector(".post_modal");
const modalOpenBtn = document.querySelector(".start-thread-btn");
const modalCloseBtn = document.querySelector(".post_close_btn");

modalOpenBtn.addEventListener("click", () => {
  modal.showModal();
});

modalCloseBtn.addEventListener("click", () => {
  modal.setAttribute("close", "");

  modal.addEventListener(
    "animationend",
    () => {
      modal.removeAttribute("close");
      modal.close();
    },
    { once: true }
  );
});
