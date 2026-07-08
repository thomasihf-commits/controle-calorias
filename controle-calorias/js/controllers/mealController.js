import { navigateTo } from "../router.js";
import { saveMeal } from "../services/mealService.js";

let selectedPhotoDataUrl = "";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handlePhotoChange(event) {
  const file = event.target.files?.[0];
  const preview = document.getElementById("photoPreview");

  selectedPhotoDataUrl = "";

  if (!file || !preview) {
    preview?.classList.add("hidden");
    return;
  }

  selectedPhotoDataUrl = await readFileAsDataUrl(file);
  preview.innerHTML = `<img src="${selectedPhotoDataUrl}" alt="Prévia da refeição">`;
  preview.classList.remove("hidden");
}

function handleSave() {
  const type = document.getElementById("mealType").value;
  const description = document.getElementById("mealDescription").value;
  const calories = document.getElementById("mealCalories").value;
  const observation = document.getElementById("mealObservation").value;

  if (!description.trim()) {
    alert("Informe uma descrição da refeição.");
    return;
  }

  if (!calories || Number(calories) <= 0) {
    alert("Informe as calorias estimadas.");
    return;
  }

  saveMeal({
    type,
    description,
    calories,
    observation,
    photoDataUrl: selectedPhotoDataUrl
  });

  navigateTo("dashboard");
}

export function init() {
  selectedPhotoDataUrl = "";

  document.getElementById("btnBackDashboard")?.addEventListener("click", () => navigateTo("dashboard"));
  document.getElementById("mealPhoto")?.addEventListener("change", handlePhotoChange);
  document.getElementById("btnSaveMeal")?.addEventListener("click", handleSave);
}
