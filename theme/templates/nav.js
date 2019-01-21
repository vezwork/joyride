var navTitle = document.getElementsByClassName('nav-title')[0];

window.addEventListener('scroll', e => {
    if (window.scrollY > 100) {
      navTitle.classList.add("active");
    } else {
      navTitle.classList.remove("active");
    }
})