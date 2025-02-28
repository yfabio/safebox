/**
 * Generate Password
 */

const lengthEl = document.querySelector("#length");
const uppercaseEl = document.querySelector("#uppercase");
const lowercaseEl = document.querySelector("#lowercase");
const numbersEl = document.querySelector("#numbers");
const symbolsEl = document.querySelector("#symbols");
const inputPwdGen = document.querySelector('[data-pwd-gen="pwd"]');

const btnGeneratePwd = document.querySelector(".d-grid .btn");

btnGeneratePwd.addEventListener("click", (e) => {
  e.preventDefault();
  const length = +lengthEl.value;
  const hasLower = lowercaseEl.checked;
  const hasUpper = uppercaseEl.checked;
  const hasNumber = numbersEl.checked;
  const hasSymbol = symbolsEl.checked;

  inputPwdGen.value = generatePassword(
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol,
    length
  );
});

const randomFunc = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol,
};

function generatePassword(lower, upper, number, symbol, length) {
  let generatedPassword = "";

  // count the arguments
  const typesCount = lower + upper + number + symbol;

  // take the value of each object.
  const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
    (item) => Object.values(item)[0]
  );

  if (typesCount === 0) {
    return "";
  }

  for (let i = 0; i < length; i += typesCount) {
    typesArr.forEach((type) => {
      const funcName = Object.keys(type)[0];
      generatedPassword += randomFunc[funcName]();
    });
  }

  const finalPassword = generatedPassword.slice(0, length);

  return finalPassword;
}

function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
  const symbols = "!@#$%^&*(){}[]=<>/,.";
  return symbols[Math.floor(Math.random() * symbols.length)];
}

/**
 *
 * example of switching tabs
 *
 * const btnEdit = document.getElementById("btn-edit");
btnEdit.addEventListener("click", (e) => {
  const tabEl = document.querySelector('[data-bs-target="#new-key"]');
  const tabNewKey = new bootstrap.Tab(tabEl);
  tabNewKey.show();
});
 * 
 */

/**
 *
 * Generic Toast
 *
 */

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

/**
 *
 * Generic modal
 *
 */

const modalEl = document.getElementById("mymodal");

let bsModal;

function showModal(modalTitle, modalBody) {
  const modalTitleEl = document.getElementById("modal-title");
  modalTitleEl.textContent = modalTitle;

  const modalBodyEl = document.getElementById("modal-body");

  modalBodyEl.innerHTML += modalBody;

  modalEl.addEventListener("hidden.bs.modal", () => {
    modalTitleEl.textContent = "";
    modalBodyEl.innerHTML = "";
    bsModal = null;
  });

  bsModal = new bootstrap.Modal(modalEl, {
    backdrop: true,
    focus: true,
    keyboard: true,
  });

  bsModal.show();
}

/**
 *  Confirm Modal
 *
 */

function displayModal(result) {
  const title = "Type your password to allow this";
  const body = `
                <div class="input-group">
                  <input type="password" name="confirmPassowrd" id="confirmPassowrd" class="form-control">
                  <button id="btnConfirmPassword" class="btn btn-outline-dark">confirm</button>
                </div>
            `;
  showModal(title, body);
  const btn = document.getElementById("btnConfirmPassword");
  document
    .getElementById("confirmPassowrd")
    .addEventListener("keydown", (e) => {
      if (e.code.toLowerCase() === "enter") {
        btn.click();
      }
    });

  btn.addEventListener("click", () => {
    const value = document.getElementById("confirmPassowrd").value;
    result(value);
  });
}

const homeTabEl = document.querySelector('[data-bs-target="#home"]');

const formNewKey = document.getElementById("form-new-key");

const btnSaveNewKey = document.getElementById("btn-save-new-key");

const btnCancelNewKey = document.getElementById("btn-cancel-new-key");

btnCancelNewKey.addEventListener("click", () => {
  formNewKey.reset();
  btnSaveNewKey.textContent = "Save";
  formNewKey.classList.remove("was-validated");
  new bootstrap.Tab(homeTabEl).show();
});

/**
 * Creating new key
 */

let visibleNewKey = false;
const inputGroupNewKey = document.querySelector(".input-group.new-key");

const btnNewKey = inputGroupNewKey.querySelector(".btn");
const pwdNewKey = inputGroupNewKey.querySelector('[type="password"]');
const iconNewKey = btnNewKey.querySelector(".bi");
btnNewKey.addEventListener("click", (e) =>
  togglePassowrdMaskNewKey(e, pwdNewKey, iconNewKey)
);

function togglePassowrdMaskNewKey(e, pwd, icon) {
  e.preventDefault();
  visibleNewKey = !visibleNewKey;
  pwd.type = visibleNewKey ? "text" : "password";
  if (visibleNewKey) {
    icon.classList.add("bi-eye");
    icon.classList.remove("bi-eye-slash");
  } else {
    icon.classList.add("bi-eye-slash");
    icon.classList.remove("bi-eye");
  }
}

formNewKey.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(formNewKey);

  const idValue = +formData.get("id");

  const dateValue = formData.get("date");
  const titleValue = formData.get("title");
  const usernameValue = formData.get("username");
  const descValue = formData.get("description");
  const passwordValue = formData.get("password");

  const key = {
    date: dateValue,
    title: titleValue,
    username: usernameValue,
    password: passwordValue,
    description: descValue,
  };

  if (!formNewKey.checkValidity()) {
    e.preventDefault();
    formNewKey.classList.add("was-validated");
  } else {
    if (idValue) {
      key.id = idValue;
      window.ctx.updateKey(
        key,
        (message) => {
          formNewKey.reset();
          showToast("text-bg-success", message);
          formNewKey.classList.remove("was-validated");
          new bootstrap.Tab(homeTabEl).show();
        },
        (error) => {
          showToast("text-bg-dange", error);
        }
      );
      btnSaveNewKey.textContent = "Save";
    } else {
      window.ctx.createKey(
        key,
        (message) => {
          formNewKey.reset();
          showToast("text-bg-success", message);
          formNewKey.classList.remove("was-validated");
          new bootstrap.Tab(homeTabEl).show();
        },
        (error) => {
          showToast("text-bg-dange", error);
        }
      );
    }
  }
});

/**
 * Getting keys from database
 */

const tableBody = document.getElementById("table-body");
const pagination = document.getElementById("pagination");

const alertKeysEl = document.getElementById("content-keys-alert");
const contentKeysEl = document.getElementById("content-keys");

/**
 *  Switch event home tab
 */
homeTabEl.addEventListener("shown.bs.tab", () => {
  loadKeys();
  formNewKey.classList.remove("was-validated");
});

async function loadKeys(page = 1, filter = "") {
  const result = await window.ctx.getAllKeys(page, filter, (error) => {
    showToast("text-bg-dange", error);
  });

  if (result !== null && result?.keys.length === 0 && filter.length === 0) {
    alertKeysEl.classList.remove("visually-hidden");
    contentKeysEl.classList.add("visually-hidden");
    return;
  } else {
    alertKeysEl.classList.add("visually-hidden");
    contentKeysEl.classList.remove("visually-hidden");
  }

  if (result !== null && result?.keys) {
    let content;
    tableBody.innerHTML = "";

    result.keys.forEach((key) => {
      content = `<tr id=row>
      <td>${key.date}</td>
      <td>${key.title}</td>
      <td>${key.username}</td>
      <td>${key.password.substring(0, 20)}</td>
      <td>
        <button 
                class="btn btn-sm btn-outline-dark" 
                data-bs-toggle="tooltip"
                data-bs-title="copy to clipboard"
                onclick="copyToclipboard(${key.id})">
          <i class="bi bi-clipboard"></i>
        </button>
      </td>
      <td>
        <button  onclick="editKey(${key.id})" class="btn btn-sm btn-primary">
          <i class="bi bi-pencil"></i>
        </button>
      </td>
      <td>
        <button onclick="deleteKey(${key.id})" class="btn btn-sm btn-danger">
          <i class="bi bi-trash"></i>
        </button>
      </td>  
    </tr>`;

      tableBody.innerHTML += content;
    });

    let listPages = "";

    for (let i = 1; i <= result?.numPages; i++) {
      listPages += `<li class="page-item"><button onclick="nextPage(${i})" class="page-link ${
        i === result?.currentPage ? "active" : ""
      }">${i}</button></li>`;
    }

    paginationContent = `
                          <ul class="pagination justify-content-center">
  
                            <li class="page-item ${
                              !result.hasPreviousPage ? "disabled" : ""
                            }">
                              <button onclick="previousPage(${
                                result.previousPage
                              })" class="page-link" aria-label="previous">Previous</button>
                            </li>
  
                            ${listPages}                       
                                                                              
                            <li class="page-item ${
                              !result.hasNextPage ? "disabled" : ""
                            }">
                              <button onclick="nextPage(${
                                result.nextPage
                              })" class="page-link" aria-label="next">Next</button>
                            </li>
  
                          </ul>
                    
                       `;

    pagination.innerHTML = paginationContent;
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach((tooltip) => new bootstrap.Tooltip(tooltip));
  }
}

function previousPage(index) {
  loadKeys(index);
}

function nextPage(index) {
  loadKeys(index);
}

/**
 * Copy to clipboard function
 *
 * @param {Number} id
 */
function copyToclipboard(id) {
  displayModal(async (value) => {
    const isPasswordValid = await window.ctx.confirmPassword(value);
    if (isPasswordValid) {
      window.ctx.copyToClipboard(
        id,
        (success) => {
          showToast("text-bg-success", success);
        },
        (error) => {
          showToast("text-bg-danger", error);
        }
      );
      bsModal.hide();
    } else {
      showToast("text-bg-warning", "password was invalid");
      bsModal.hide();
    }
  });
}

/**
 * Editing a key
 * @param {Number} id
 */
async function editKey(id) {
  const dbKey = await window.ctx.getKeyById(id, (error) => {
    showToast("text-bg-danger", error);
  });

  for (let key in dbKey) {
    formNewKey.elements[key].value = dbKey[key];
  }

  btnSaveNewKey.textContent = "Edit";

  const tabEl = document.querySelector('[data-bs-target="#new-key"]');
  const tabNewKey = new bootstrap.Tab(tabEl);
  tabNewKey.show();
}

/**
 * Dialog  to confirm removal of a key
 * @param {Number} id
 */
function deleteKey(id) {
  const title = "Are you sure (y/n)?";

  const body = `
                  <div class="d-flex justify-content-end">
                    <button onclick="proceedDeleting(${id})" class="btn btn-outline-primary me-2">Yes</button>
                    <button onclick="stopDeleting()" class="btn btn-outline-danger">No</button>
                  </div>
                `;

  showModal(title, body);
}

/**
 *  Deleting a key
 *
 * @param {Number} id
 */
function proceedDeleting(id) {
  window.ctx.deleteKey(
    id,
    (message) => {
      stopDeleting();
      showToast("text-bg-success", message);
      loadKeys();
    },
    (error) => {
      showToast("text-bg-dange", error);
    }
  );
}

/**
 * Closing modal
 */
function stopDeleting() {
  if (bsModal) {
    bsModal.hide();
  }
}

/**
 * Searing for keys
 */
const searchEl = document.getElementById("search");

searchEl.addEventListener("input", (e) => {
  loadKeys(1, e.target.value);
});

/**
 * Login button and logged user
 */

const btnLogoutEl = document.getElementById("btn-logout");

btnLogoutEl.addEventListener("click", (e) => {
  e.preventDefault();
  window.ctx.logout();
});

window.ctx.loadImage((obj) => {
  const imgUserEl = document.getElementById("img-user");
  const userLoggedEl = document.getElementById("user-logged");
  userLoggedEl.textContent = `Logged user ${obj.username}`;
  if (obj.img64) {
    imgUserEl.classList.remove("visually-hidden");
    imgUserEl.src = `data:image/png;base64,${obj.img64}`;
  } else {
    imgUserEl.classList.add("visually-hidden");
  }
  loadKeys();
});

/**
 * Settings
 */

const settingsTabEl = document.querySelector('[data-bs-target="#settings"]');
const formSettingsEl = document.getElementById("form-settings");
const btnCancelSettionsEL = document.getElementById("btn-settings");

btnCancelSettionsEL.addEventListener("click", (e) => {
  formSettingsEl.classList.remove("was-validated");
  new bootstrap.Tab(homeTabEl).show();
});

settingsTabEl.addEventListener("shown.bs.tab", async () => {
  const obj = await window.ctx.loggedUser();
  const { username, email } = obj.dataValues;
  formSettingsEl.elements["username"].value = username;
  formSettingsEl.elements["email"].value = email;
});

formSettingsEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(formSettingsEl);

  if (!formSettingsEl.checkValidity()) {
    e.preventDefault();
    formSettingsEl.classList.add("was-validated");
  } else {
    const usernameValue = formData.get("username");
    const emailValue = formData.get("email");
    const imageValue = formData.get("image");

    const obj = {
      username: usernameValue,
      email: emailValue,
      path: imageValue.path,
    };

    const person = await window.ctx.updatePerson(
      obj,
      (success) => {
        formSettingsEl.reset();
        formSettingsEl.classList.remove("was-validated");
        showToast("text-bg-success", success);
      },
      (error) => {
        showToast("text-bg-danger", error);
      }
    );
    updatePersonDetails(person);
  }
});

/**
 * Function to update the logged user username and image
 *
 * @param {Object} person
 */

function updatePersonDetails(person) {
  if (person !== null) {
    const imgUserEl = document.getElementById("img-user");
    const userLoggedEl = document.getElementById("user-logged");
    userLoggedEl.textContent = `Logged user ${person.username}`;
    imgUserEl.src = `data:image/png;base64,${person.img64}`;
    imgUserEl.classList.remove("visually-hidden");
  }
}

// let visibleSettings = false;
// const inputGroup = document.querySelector(".input-group.settings");

// const btnSettings = inputGroup.querySelector(".btn");
// const pwdSettings = inputGroup.querySelector('[type="password"]');
// const iconSettings = btnSettings.querySelector(".bi");
// btnSettings.addEventListener("click", (e) => {
//   e.preventDefault();
//   const hasDisplayed = inputGroup.getAttribute("displayed");

//   if (hasDisplayed === null && hasDisplayed !== true) {
//     displayModal(async (value) => {
//       const isPasswordValid = await window.ctx.confirmPassword(value);
//       if (isPasswordValid) {
//         togglePassowrdMaskSettings(e, pwdSettings, iconSettings);
//         inputGroup.setAttribute("displayed", true);
//         bsModal.hide();
//       } else {
//         showToast("text-bg-warning", `password was invalid ${value}`);
//       }
//     });
//   } else {
//     togglePassowrdMaskSettings(e, pwdSettings, iconSettings);
//     inputGroup.removeAttribute("displayed");
//   }
// });

// function togglePassowrdMaskSettings(e, pwd, icon) {
//   e.preventDefault();
//   visibleSettings = !visibleSettings;
//   pwd.type = visibleSettings ? "text" : "password";
//   if (visibleSettings) {
//     icon.classList.add("bi-eye");
//     icon.classList.remove("bi-eye-slash");
//   } else {
//     icon.classList.add("bi-eye-slash");
//     icon.classList.remove("bi-eye");
//   }
// }

/**
 * Loading all key when window was ready
 */
(async () => loadKeys())();

/**
 * Initializing all topltips
 */

const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
tooltips.forEach((tooltip) => new bootstrap.Tooltip(tooltip));
