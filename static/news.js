const api_key = "eadeccef94e442f69bb28a13ed8b6975"
var url = `https://newsapi.org/v2/top-headlines?category=technology&apiKey=${api_key}`

var req = new Request(url)

async function getNews(){
    const resp = await fetch(req)
    const data = await resp.json()
    const list = data.articles

    list.map((item)=>{
        console.log(item);
        // use item.author etc to get specific data
    })
    //console.log(data);
}
getNews()

// fetch(req)
// .then((res)=>{
//     console.log(res);
// })