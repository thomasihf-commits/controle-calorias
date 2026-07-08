import { logout } from "../auth.js";

export function init(params = {}) {
  const userEmail = document.getElementById("userEmail");
  const btnLogout = document.getElementById("btnLogout");
  const btnNewMeal = document.getElementById("btnNewMeal");

  if (userEmail && params.user) {
    userEmail.textContent = params.user.email || "";
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", logout);
  }

  if (btnNewMeal) {
    btnNewMeal.addEventListener("click", () => {
      alert("Cadastro de refeição será implementado na próxima etapa.");
    });
  }
}