import OpenAI from "npm:openai@4.69.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const systemPrompt = `Você é um nutricionista assistente para um app de controle de calorias.
Analise a foto da refeição e responda apenas em JSON válido, sem markdown.
A estimativa deve ser realista, conservadora e em português do Brasil.
Use este formato:
{
  "descricao": "resumo curto da refeição",
  "calorias": 0,
  "proteinas": 0,
  "carboidratos": 0,
  "gorduras": 0,
  "fibras": 0,
  "acucar": 0,
  "sodio": 0,
  "confianca": 0.0,
  "itens": [
    {
      "nome": "alimento",
      "quantidade": "porção estimada",
      "calorias": 0,
      "proteinas": 0,
      "carboidratos": 0,
      "gorduras": 0,
      "observacao": ""
    }
  ],
  "observacoes": "alertas de incerteza, se houver"
}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY não configurada no Supabase.");
    }

    const { imageDataUrl, mealType, locale } = await req.json();
    if (!imageDataUrl) {
      return new Response(JSON.stringify({ error: "imageDataUrl é obrigatório." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analise esta refeição. Tipo: ${mealType || "não informado"}. Idioma: ${locale || "pt-BR"}.`
            },
            {
              type: "image_url",
              image_url: { url: imageDataUrl, detail: "low" }
            }
          ]
        }
      ]
    });

    const content = response.choices?.[0]?.message?.content || "{}";

    return new Response(content, {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || "Erro ao analisar refeição." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
