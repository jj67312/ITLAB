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









