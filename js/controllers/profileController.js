import { navigateTo } from "../router.js";
import { getDailyGoal, setDailyGoal } from "../services/mealService.js";

export function init(params = {}) {
  const input = document.getElementById("dailyGoalInput");
  const btnSaveGoal = document.getElementById("btnSaveGoal");

  if (input) input.value = getDailyGoal();

  btnSaveGoal?.addEventListener("click", () => {
    setDailyGoal(input.value);
    alert("Meta diária salva.");
    navigateTo("dashboard", params);
  });

  document.getElementById("btnBackDashboard")?.addEventListener("click", () => navigateTo("dashboard", params));

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => navigateTo(button.dataset.route, params));
  });
}
