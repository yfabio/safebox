const doNotLink = document.getElementById("do-not");
const alreadyHaveLink = document.getElementById("already-have");

const contents = document.querySelectorAll(".content");

doNotLink.addEventListener("click", (e) => {
  e.preventDefault();
  contents.forEach((content) => content.classList.remove("visually-hidden"));
  document.querySelector(".login").classList.add("visually-hidden");
});

alreadyHaveLink.addEventListener("click", (e) => {
  e.preventDefault();
  contents.forEach((content) => content.classList.remove("visually-hidden"));
  document.querySelector(".register").classList.add("visually-hidden");
});

const registerForm = document.querySelector(".register #form-register");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(registerForm);

  const usernameValue = formData.get("username");
  const passwordValue = formData.get("password");
  const emailValue = formData.get("email");
  const imageValue = formData.get("image");

  const obj = {
    username: usernameValue,
    password: passwordValue,
    email: emailValue,
    image: imageValue.path,
  };

  window.ctx.savePerson(
    obj,
    (message) => {
      console.log(message);
      alreadyHaveLink.click();
    },
    (error) => {
      console.log(error);
    }
  );
});
