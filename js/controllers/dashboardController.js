import { logout } from "../auth.js";
import { navigateTo } from "../router.js";
import { getDailyGoal, getMealTypeLabel, getTodayMeals, getTotalCalories, deleteMeal } from "../services/mealService.js";

function formatDateLabel() {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit"
  }).format(new Date());
}

function getFirstName(user) {
  const name = user?.user_metadata?.full_name || user?.email || "";
  return name.split(" ")[0].split("@")[0] || "Thomas";
}

function renderMealList(meals) {
  const list = document.getElementById("todayMealsList");
  const count = document.getElementById("todayMealsCount");

  if (count) count.textContent = String(meals.length);
  if (!list) return;

  if (!meals.length) {
    list.innerHTML = `<div class="empty-state">Nenhuma refeição registrada hoje.</div>`;
    return;
  }

  list.innerHTML = meals.map((meal) => `
    <article class="meal-card">
      ${meal.photoDataUrl ? `<img src="${meal.photoDataUrl}" alt="Foto da refeição" class="meal-thumb">` : `<div class="meal-thumb placeholder">🍽️</div>`}
      <div class="meal-info">
        <strong>${meal.description}</strong>
        <span>${getMealTypeLabel(meal.type)}</span>
        ${meal.observation ? `<small>${meal.observation}</small>` : ""}
      </div>
      <div class="meal-actions">
        <strong>${meal.calories}</strong>
        <small>kcal</small>
        <button class="text-danger" data-delete-meal="${meal.id}" title="Excluir">Excluir</button>
      </div>
    </article>
  `).join("");

  list.querySelectorAll("[data-delete-meal]").forEach((button) => {
    button.addEventListener("click", () => {
      deleteMeal(button.dataset.deleteMeal);
      renderDashboard();
    });
  });
}

function renderDashboard(params = {}) {
  const meals = getTodayMeals();
  const total = getTotalCalories(meals);
  const goal = getDailyGoal();
  const remaining = Math.max(goal - total, 0);
  const percent = Math.min((total / goal) * 100, 100);

  document.getElementById("todayLabel").textContent = formatDateLabel();
  document.getElementById("dashboardTitle").textContent = `Olá, ${getFirstName(params.user)}`;
  document.getElementById("todayCalories").textContent = total;
  document.getElementById("dailyGoal").textContent = `Meta ${goal} kcal`;
  document.getElementById("remainingCalories").textContent = remaining > 0 ? `Restam ${remaining} kcal` : "Meta atingida";
  document.getElementById("progressFill").style.width = `${percent}%`;

  renderMealList(meals);
}

export function init(params = {}) {
  renderDashboard(params);

  document.getElementById("btnLogout")?.addEventListener("click", logout);
  document.getElementById("btnNewMeal")?.addEventListener("click", () => navigateTo("meal"));

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => navigateTo(button.dataset.route, params));
  });
}
