const doNotLink = document.getElementById("do-not");
const alreadyHaveLink = document.getElementById("already-have");

const contents = document.querySelectorAll(".content");

const registerForm = document.querySelector(".register #form-register");
const loginForm = document.querySelector(".login #form-login");

doNotLink.addEventListener("click", (e) => {
  e.preventDefault();
  contents.forEach((content) => content.classList.remove("visually-hidden"));
  document.querySelector(".login").classList.add("visually-hidden");
  loginForm.classList.remove("was-validated");
});

alreadyHaveLink.addEventListener("click", (e) => {
  e.preventDefault();
  contents.forEach((content) => content.classList.remove("visually-hidden"));
  document.querySelector(".register").classList.add("visually-hidden");
  registerForm.classList.remove("was-validated");
});

/**
 * Register user
 */
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
    path: imageValue.path,
  };

  if (!registerForm.checkValidity()) {
    e.preventDefault();
    registerForm.classList.add("was-validated");
  } else {
    window.ctx.savePerson(
      obj,
      (message) => {
        registerForm.classList.remove("was-validated");
        showToast("text-bg-success", message);
        registerForm.reset();
      },
      (error) => {
        showToast("text-bg-danger", error);
      }
    );
  }
});

/**
 * Login
 */

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);

  const usernameValue = formData.get("username");
  const passwordValue = formData.get("password");

  const credential = {
    username: usernameValue,
    password: passwordValue,
  };

  if (!loginForm.checkValidity()) {
    e.preventDefault();
    loginForm.classList.add("was-validated");
  } else {
    window.ctx.login(
      credential,
      (result) => {
        if (!result.success) {
          showToast("text-bg-warning", result.message);
        } else {
          loginForm.classList.remove("was-validated");
          loginForm.reset();
        }
      },
      (error) => {
        showToast("text-bg-danger", error);
        loginForm.reset();
      }
    );
  }
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
