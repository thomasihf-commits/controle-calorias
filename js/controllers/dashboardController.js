import { navigateTo } from "../router.js";

export function init(params = {}) {
  const userEmail = document.getElementById("userEmail");
  const btnNewMeal = document.getElementById("btnNewMeal");

  if (userEmail && params.user) {
    userEmail.textContent = params.user.email || "";
  }

  if (btnNewMeal) {
    btnNewMeal.addEventListener("click", () => {
      navigateTo("meal");
    });
  }
}