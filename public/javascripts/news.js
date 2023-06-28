const api_key = `b6648609e6dc43d8b134e6300e80c212`;
var url = `https://newsapi.org/v2/top-headlines?country=in&language=en&category=technology&apikey=${api_key} `;

function getNews() {
  fetch(url)
    .then((a) => a.json())
    .then((response) => {
      for (var i = 0; i < response.articles.length; i++) {
        document.getElementById("newsFeed").innerHTML +=
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
