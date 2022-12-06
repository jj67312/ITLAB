// let btn = document.querySelector(".follow-btn");
// btn.style.transition= "all 300ms";

// // Change button text on click
// btn.addEventListener("click", ()=>{

//     if(btn.innerText === "Follow"){
//         btn.innerText = "Following";
//         btn.style.backgroundColor= '#f2f2f2';
//         btn.style.color= "#4285f4";
//         btn.style.border= "1px solid #4285f4";
//         btn.style.width= "95px";
//     }else{
//         btn.innerText= "Follow";
//         btn.style.backgroundColor= '#4285f4';
//         btn.style.color= "#f2f2f2";
//         btn.style.border= "none";
//         btn.style.width= "90px";
//     }
// });

const toggleToPosts = document.querySelector(".posts_toggle");
const toggleToComments = document.querySelector(".comments_toggle");

const div1 = document.getElementById("Posts");
const div2 = document.getElementById("Comments");

const hide = el => el.style.setProperty("display", "none");
const show = el => el.style.setProperty("display", "block");
toggleToPosts.classList.add("active");
toggleToPosts.addEventListener("click", ()=> {
    hide(div2);
    show(div1);
    toggleToPosts.classList.add("active");
    toggleToComments.classList.remove("active");
});

toggleToComments.addEventListener("click", ()=> {
    hide(div1);
    show(div2);
    toggleToPosts.classList.remove("active");
    toggleToComments.classList.add("active");
});

// let links = document.querySelectorAll(".links li");
// let bodyId = document.querySelector("posts_body").id;

// for(let link of links){
//     if(link.dataset.active == bodyId){
//         link.classList.add("active");
//     }
// }





