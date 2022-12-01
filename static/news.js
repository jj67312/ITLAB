// newsdata.org

const api_key2 ="pub_1404774f461cbc59740fa28662636ad82491f"
var url2 = "https://newsdata.io/api/1/news?apikey="+ api_key2 +"&category=technology&language=en"

async function getTechNews(){
    const resp = await fetch(url2)
    console.log(resp);
    const data = await resp.json()
    console.log(data);
    const newsList = data.results
    newsList.map((item)=>{
        console.log(item);
    })
}

getTechNews()

// news api.org

const api_key = "eadeccef94e442f69bb28a13ed8b6975"
var url = `https://newsapi.org/v2/top-headlines?category=technology&apiKey=${api_key}`

var req = new Request(url)

async function getNews(){
    const resp = await fetch(req)
    const data = await resp.json()
    console.log(data);
    const list = data.articles

    list.map((item)=>{
        console.log(item);
        // use item.author etc to get specific data
    })
    //console.log(data);
}
//getNews()

// fetch(req)
// .then((res)=>{
//     console.log(res);
// })