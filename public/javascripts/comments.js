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

var x = document.querySelector(".profile-text1").innerHTML;
var y = document.querySelector(".profile-logo-text");

y.innerHTML= x[0];