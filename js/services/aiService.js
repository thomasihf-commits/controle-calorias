import { CONFIG } from "../config.js";
import { supabase } from "../supabase.js";

function normalizeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(number, 0) : 0;
}

function normalizeFoodItems(items = []) {
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    nome: String(item.nome || item.name || "Alimento").trim(),
    quantidade: String(item.quantidade || item.portion || item.peso || "").trim(),
    calorias: Math.round(normalizeNumber(item.calorias || item.calories)),
    proteinas: normalizeNumber(item.proteinas || item.protein),
    carboidratos: normalizeNumber(item.carboidratos || item.carbs || item.carbohydrates),
    gorduras: normalizeNumber(item.gorduras || item.fat),
    observacao: String(item.observacao || item.note || "").trim()
  }));
}

function normalizeAnalysis(data) {
  const items = normalizeFoodItems(data?.itens || data?.items || []);
  const totalFromItems = items.reduce((total, item) => total + item.calorias, 0);

  return {
    descricao: String(data?.descricao || data?.description || items.map((item) => item.nome).join(", ") || "Refeição analisada").trim(),
    calorias: Math.round(normalizeNumber(data?.calorias || data?.calories || totalFromItems)),
    proteinas: normalizeNumber(data?.proteinas || data?.protein),
    carboidratos: normalizeNumber(data?.carboidratos || data?.carbs || data?.carbohydrates),
    gorduras: normalizeNumber(data?.gorduras || data?.fat),
    fibras: normalizeNumber(data?.fibras || data?.fiber),
    acucar: normalizeNumber(data?.acucar || data?.sugar),
    sodio: normalizeNumber(data?.sodio || data?.sodium),
    confianca: Math.min(Math.max(normalizeNumber(data?.confianca || data?.confidence), 0), 1),
    itens: items,
    observacoes: String(data?.observacoes || data?.notes || "").trim()
  };
}

export async function analyzeMealImage({ imageDataUrl, mealType }) {
  if (!imageDataUrl) {
    throw new Error("Envie uma foto antes de analisar.");
  }

  const { data, error } = await supabase.functions.invoke(CONFIG.AI.EDGE_FUNCTION, {
    body: {
      imageDataUrl,
      mealType,
      locale: "pt-BR"
    }
  });

  if (error) {
    console.error("Erro na Edge Function:", error);
    throw new Error(error.message || "Não foi possível analisar a imagem agora.");
  }

  if (!data) {
    throw new Error("A IA não retornou dados para esta imagem.");
  }

  return normalizeAnalysis(data);
}
