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

const btnEdit = document.getElementById("btn-edit");

btnEdit.addEventListener("click", (e) => {
  const tabEl = document.querySelector('[data-bs-target="#new-key"]');
  const tabNewKey = new bootstrap.Tab(tabEl);
  tabNewKey.show();
});
