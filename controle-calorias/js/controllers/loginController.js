import { loginWithGoogle } from "../auth.js";

export function init() {
  const btnLoginGoogle = document.getElementById("btnLoginGoogle");

  if (btnLoginGoogle) {
    btnLoginGoogle.addEventListener("click", loginWithGoogle);
  }
}