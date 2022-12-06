// const slides = document.querySelectorAll(".slide");

// var counter = 0;
// //console.log(slides);

// slides.forEach((slide, index) => {
//   slide.style.left = `${index * 100}%`;
// });

// const slideNews = () => {
//   slides.forEach((slide) => {
//     slide.style.transform = `translateX(-${counter * 100}%)`;
//   });
// };

// const goNext = () => {
//   if (counter <= 10) {
//     counter++;
//     slideNews();
//   }
// };

// const goPrev = () => {
//   counter--;
//   slideNews();
// };

const api_key = `b6648609e6dc43d8b134e6300e80c212`;
var url = `https://newsapi.org/v2/top-headlines?country=us&language=en&category=technology&apikey=${api_key} `;

function getNews() {
  fetch(url)
    .then((a) => a.json())
    .then((response) => {
      for (var i = 0; i < response.articles.length; i++) {
        document.getElementById('newsFeed').innerHTML +=
          "<div id='slide'><img id='news-image' src='" +
          response.articles[i].urlToImage +
          "'/><div id='news-content'><p id='news-heading'>" +
          response.articles[i].title +
          "</p><div id='headline-footer'><p id='author'>By " +
          response.articles[i].author +
          "</p><p id='date-time'>" +
          response.articles[i].publishedAt +
          "</p></div><p id='main-content'>" +
          response.articles[i].content +
          "</p><a id='read-more' href='" +
          response.articles[i].url +
          "'>Read More</a></div></div>";
      }
    });
}

getNews();
