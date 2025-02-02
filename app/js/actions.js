/**
 * Toggle Password Mask
 */

let visible = false;
const inputGroups = document.querySelectorAll(".input-group");

inputGroups.forEach((inputGroup) => {
  const btn = inputGroup.querySelector(".btn");
  const pwd = inputGroup.querySelector('[type="password"]');
  const icon = btn.querySelector(".bi");
  btn.addEventListener("click", (e) => togglePassowrdMask(e, pwd, icon));
});

function togglePassowrdMask(e, pwd, icon) {
  e.preventDefault();
  visible = !visible;
  pwd.type = visible ? "text" : "password";
  if (visible) {
    icon.classList.add("bi-eye");
    icon.classList.remove("bi-eye-slash");
  } else {
    icon.classList.add("bi-eye-slash");
    icon.classList.remove("bi-eye");
  }
}

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
 * generic modal
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
  });

  bsModal = new bootstrap.Modal(modalEl, {
    backdrop: true,
    focus: true,
    keyboard: true,
  });

  bsModal.show();
}

const homeTabEl = document.querySelector('[data-bs-target="#home"]');

/**
 * Create new Key
 */

const formNewKey = document.getElementById("form-new-key");

formNewKey.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(formNewKey);

  const dateValue = formData.get("date");
  const titleValue = formData.get("title");
  const usernameValue = formData.get("username");
  const descValue = formData.get("desc");
  const passwordValue = formData.get("password");

  const key = {
    date: dateValue,
    title: titleValue,
    username: usernameValue,
    password: passwordValue,
    description: descValue,
  };

  window.ctx.createKey(
    key,
    (message) => {
      formNewKey.reset();
      showToast("text-bg-success", message);
      new bootstrap.Tab(homeTabEl).show();
    },
    (error) => {
      showToast("text-bg-dange", error.message);
    }
  );
});

/**
 * Getting keys from database
 */

const tableBody = document.getElementById("table-body");

homeTabEl.addEventListener("shown.bs.tab", loadKeys);

async function loadKeys() {
  const keys = await window.ctx.getAllKeys((error) => {
    showToast("text-bg-dange", error);
  });

  let content;
  tableBody.innerHTML = "";

  keys.forEach((key) => {
    content = `<tr id=row>
    <td>${key.date}</td>
    <td>${key.title}</td>
    <td>${key.username}</td>
    <td>${key.password}</td>
    <td>
      <button onclick="clipBoardKey(${key.id})" class="btn btn-sm btn-outline-dark"       
      data-bs-toggle="tooltip" 
      data-bs-title="copy to clipboard">
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

  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltips.forEach((tooltip) => new bootstrap.Tooltip(tooltip));
}

function clipBoardKey(id) {
  const title = "Type your password to allow this";

  const body = `
                <div class="input-group">
                  <input type="password" name="pwd" id="pwd" class="form-control">
                  <button onclick="confirmToClipBoard(${id})" id="pwd" class="btn btn-outline-dark">confirm</button>
                </div>
            `;

  showModal(title, body);
}

function confirmToClipBoard(id) {
  console.log("confirm to clipboard ", id);
  if (bsModal) {
    bsModal.hide();
  }
}

function editKey(id) {
  console.log(id);
}

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

function stopDeleting() {
  if (bsModal) {
    bsModal.hide();
  }
}

/**
 * Loading all key when window was ready
 */
(async () => loadKeys())();
