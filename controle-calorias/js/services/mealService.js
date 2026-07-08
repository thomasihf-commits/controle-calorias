const STORAGE_KEY = "controle_calorias_refeicoes";
const DAILY_GOAL_KEY = "controle_calorias_meta_diaria";

function readMeals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    console.error("Erro ao ler refeições:", error);
    return [];
  }
}

function writeMeals(meals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
}

export function getDailyGoal() {
  return Number(localStorage.getItem(DAILY_GOAL_KEY)) || 2000;
}

export function setDailyGoal(value) {
  const goal = Math.max(1, Number(value) || 2000);
  localStorage.setItem(DAILY_GOAL_KEY, String(goal));
  return goal;
}

export function getMeals() {
  return readMeals().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getMealsByDate(dateString) {
  return getMeals().filter((meal) => meal.date === dateString);
}

export function getTodayMeals() {
  const today = new Date().toISOString().slice(0, 10);
  return getMealsByDate(today);
}

export function getTotalCalories(meals) {
  return meals.reduce((total, meal) => total + (Number(meal.calories) || 0), 0);
}

export function saveMeal(meal) {
  const meals = readMeals();
  const now = new Date();

  const newMeal = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    type: meal.type,
    date: meal.date || now.toISOString().slice(0, 10),
    calories: Number(meal.calories) || 0,
    description: meal.description?.trim() || "Refeição",
    observation: meal.observation?.trim() || "",
    photoDataUrl: meal.photoDataUrl || "",
    createdAt: now.toISOString()
  };

  meals.push(newMeal);
  writeMeals(meals);
  return newMeal;
}

export function deleteMeal(id) {
  const meals = readMeals().filter((meal) => meal.id !== id);
  writeMeals(meals);
}

export function clearMeals() {
  writeMeals([]);
}

export function getMealTypeLabel(type) {
  const labels = {
    cafe: "Café da manhã",
    almoco: "Almoço",
    lanche: "Lanche",
    jantar: "Jantar",
    outro: "Outro"
  };

  return labels[type] || "Refeição";
}
