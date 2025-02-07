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
      registerForm.reset();
      showToast("text-bg-success", message);
      alreadyHaveLink.click();
    },
    (error) => {
      showToast("text-bg-danger", error);
    }
  );
});

const loginForm = document.querySelector(".login #form-login");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);

  const usernameValue = formData.get("username");
  const passwordValue = formData.get("password");

  const credential = {
    username: usernameValue,
    password: passwordValue,
  };

  window.ctx.login(
    credential,
    (result) => {
      if (result.success) {
        showToast("text-bg-danger", result.message);
      } else {
        showToast("text-bg-warning", result.message);
      }
      loginForm.reset();
    },
    (error) => {
      showToast("text-bg-danger", error);
    }
  );
});

const toast = document.getElementById("toast");
const toastBody = document.querySelector(".toast-body");

function showToast(className, content) {
  toastBody.classList.add(className);
  toastBody.textContent = content;
  toast.addEventListener("hidden.bs.toast", () =>
    toastBody.classList.remove(className)
  );
  new bootstrap.Toast(toast, {
    animation: true,
    autohide: true,
    delay: 2000,
  }).show();
}
