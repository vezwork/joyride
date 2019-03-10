//email validation
const inputEmailEls = document.getElementsByClassName('mce-EMAIL');
const EMAIL_REGEXP =
    /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

[...inputEmailEls].forEach(el => {
    const btn = el.parentNode.querySelector('.mc-embedded-subscribe');
    el.addEventListener('input', () => {
        btn.disabled = !EMAIL_REGEXP.test(el.value)
  });
});


