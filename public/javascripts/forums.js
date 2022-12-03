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

const api_key = `b6648609e6dc43d8b134e6300e80c212`;
var url = `https://newsapi.org/v2/top-headlines?language=en&category=technology&apiKey=b6648609e6dc43d8b134e6300e80c212`;

function getNews() {
  fetch(url)
    .then((a) => a.json())
    .then((response) => {
      for (var i = 0; i < response.articles.length; i++) {
        document.getElementById("newsFeed").innerHTML +=
          "<div id='news-data'><img id='news-image' src='" +
          response.articles[i].urlToImage +
          "'><p id='news-headline'>" +
          response.articles[i].title +
          "</p>";
      }
    });
}

getNews();

const like_btn = Array.from(document.getElementsByClassName("like-btn"));
const cmnt_btn = document.getElementById("commentButton");

like_btn.forEach((like_btn) => {
  like_btn.style.transition = "all 300ms";

  //Change button text on click
  like_btn.addEventListener("click", () => {
    if (like_btn.classList.contains("active")) {
      like_btn.classList.remove("active");
    } else {
      like_btn.classList.add("active");
    }
  });
});
