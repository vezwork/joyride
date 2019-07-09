//email validation
const buttonEmailEls = document.getElementsByClassName('mc-embedded-subscribe');
const inputEmailEls = document.getElementsByClassName('mce-EMAIL');
const EMAIL_REGEXP =
    /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

inputEmailEls.forEach(el => {
    el.addEventListener('input', () => {
      toggleDisabled(!EMAIL_REGEXP.test(inputEmail.value));
  });
});


function toggleDisabled(state) {
  buttonEmailEls.forEach(el => {
    el.disabled = state;
});
}

