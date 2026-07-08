import { navigateTo } from "../router.js";
import { analyzeMealImage } from "../services/aiService.js";
import { saveMeal } from "../services/mealService.js";

let selectedPhotoDataUrl = "";
let latestAiAnalysis = null;

function setStatus(message = "", type = "info") {
  const status = document.getElementById("aiStatus");
  if (!status) return;

  status.textContent = message;
  status.dataset.type = type;
  status.classList.toggle("hidden", !message);
}

function setAnalyzing(isAnalyzing) {
  const button = document.getElementById("btnAnalyzeMeal");
  if (!button) return;

  button.disabled = isAnalyzing || !selectedPhotoDataUrl;
  button.textContent = isAnalyzing ? "Analisando..." : "🤖 Analisar com IA";
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeImage(dataUrl, maxSize = 1280, quality = 0.82) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
}

async function handlePhotoChange(event) {
  const file = event.target.files?.[0];
  const preview = document.getElementById("photoPreview");

  selectedPhotoDataUrl = "";
  latestAiAnalysis = null;
  document.getElementById("aiResultCard")?.classList.add("hidden");
  setStatus("");
  setAnalyzing(false);

  if (!file || !preview) {
    preview?.classList.add("hidden");
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Envie uma imagem válida.");
    return;
  }

  const originalDataUrl = await readFileAsDataUrl(file);
  selectedPhotoDataUrl = await resizeImage(originalDataUrl);
  preview.innerHTML = `<img src="${selectedPhotoDataUrl}" alt="Prévia da refeição">`;
  preview.classList.remove("hidden");
  setAnalyzing(false);
  setStatus("Foto carregada. Agora você pode analisar com IA.");
}

function fillInput(id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value || "";
}

function renderAiResult(analysis) {
  const card = document.getElementById("aiResultCard");
  const confidence = document.getElementById("confidencePill");
  const list = document.getElementById("aiItemsList");

  if (!card || !list) return;

  if (confidence) {
    confidence.textContent = analysis.confianca ? `${Math.round(analysis.confianca * 100)}% confiança` : "estimativa";
  }

  const itemsHtml = analysis.itens?.length
    ? analysis.itens.map((item) => `
      <div class="ai-item-row">
        <div>
          <strong>${item.nome}</strong>
          ${item.quantidade ? `<small>${item.quantidade}</small>` : ""}
        </div>
        <span>${item.calorias} kcal</span>
      </div>
    `).join("")
    : `<div class="empty-state">A IA retornou apenas o resumo da refeição.</div>`;

  list.innerHTML = `
    <div class="ai-total-line">
      <strong>${analysis.descricao}</strong>
      <span>${analysis.calorias} kcal</span>
    </div>
    ${itemsHtml}
  `;

  card.classList.remove("hidden");
}

async function handleAnalyzeMeal() {
  if (!selectedPhotoDataUrl) {
    alert("Envie ou tire uma foto primeiro.");
    return;
  }

  try {
    setAnalyzing(true);
    setStatus("Enviando imagem para análise da IA...");

    const analysis = await analyzeMealImage({
      imageDataUrl: selectedPhotoDataUrl,
      mealType: document.getElementById("mealType")?.value || "outro"
    });

    latestAiAnalysis = analysis;
    fillInput("mealDescription", analysis.descricao);
    fillInput("mealCalories", analysis.calorias);
    fillInput("mealProtein", analysis.proteinas || "");
    fillInput("mealCarbs", analysis.carboidratos || "");
    fillInput("mealFat", analysis.gorduras || "");

    if (analysis.observacoes) {
      fillInput("mealObservation", analysis.observacoes);
    }

    renderAiResult(analysis);
    setStatus("Análise concluída. Revise os dados antes de salvar.", "success");
  } catch (error) {
    console.error(error);
    setStatus(error.message || "Erro ao analisar a imagem.", "error");
    alert("Não consegui analisar a imagem. Confirme se a Edge Function já foi publicada no Supabase.");
  } finally {
    setAnalyzing(false);
  }
}

function handleSave() {
  const type = document.getElementById("mealType").value;
  const description = document.getElementById("mealDescription").value;
  const calories = document.getElementById("mealCalories").value;
  const observation = document.getElementById("mealObservation").value;
  const protein = document.getElementById("mealProtein").value;
  const carbs = document.getElementById("mealCarbs").value;
  const fat = document.getElementById("mealFat").value;

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
    photoDataUrl: selectedPhotoDataUrl,
    macros: {
      proteinas: Number(protein) || 0,
      carboidratos: Number(carbs) || 0,
      gorduras: Number(fat) || 0
    },
    aiAnalysis: latestAiAnalysis
  });

  navigateTo("dashboard");
}

export function init() {
  selectedPhotoDataUrl = "";
  latestAiAnalysis = null;

  document.getElementById("btnBackDashboard")?.addEventListener("click", () => navigateTo("dashboard"));
  document.getElementById("mealPhoto")?.addEventListener("change", handlePhotoChange);
  document.getElementById("btnAnalyzeMeal")?.addEventListener("click", handleAnalyzeMeal);
  document.getElementById("btnSaveMeal")?.addEventListener("click", handleSave);
  setAnalyzing(false);
}
