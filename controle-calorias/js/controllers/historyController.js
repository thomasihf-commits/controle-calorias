import { navigateTo } from "../router.js";
import { deleteMeal, getMeals, getMealsByDate, getMealTypeLabel, getTotalCalories } from "../services/mealService.js";

function renderHistory(dateFilter = "") {
  const meals = dateFilter ? getMealsByDate(dateFilter) : getMeals();
  const list = document.getElementById("historyList");
  const total = document.getElementById("historyTotal");
  const title = document.getElementById("historyTitle");

  if (total) total.textContent = `${getTotalCalories(meals)} kcal`;
  if (title) title.textContent = dateFilter ? "Refeições da data" : "Todas as refeições";
  if (!list) return;

  if (!meals.length) {
    list.innerHTML = `<div class="empty-state">Nenhuma refeição encontrada.</div>`;
    return;
  }

  list.innerHTML = meals.map((meal) => `
    <article class="meal-card">
      ${meal.photoDataUrl ? `<img src="${meal.photoDataUrl}" alt="Foto da refeição" class="meal-thumb">` : `<div class="meal-thumb placeholder">🍽️</div>`}
      <div class="meal-info">
        <strong>${meal.description}</strong>
        <span>${new Date(meal.date + "T00:00:00").toLocaleDateString("pt-BR")} • ${getMealTypeLabel(meal.type)}</span>
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
      renderHistory(document.getElementById("historyDate")?.value || "");
    });
  });
}

export function init(params = {}) {
  renderHistory();

  document.getElementById("btnBackDashboard")?.addEventListener("click", () => navigateTo("dashboard", params));
  document.getElementById("historyDate")?.addEventListener("change", (event) => renderHistory(event.target.value));

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => navigateTo(button.dataset.route, params));
  });
}
