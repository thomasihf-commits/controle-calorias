# Sprint 3 — IA para análise de refeições

## O que foi incluído

- Upload/captura de foto na tela Nova Refeição.
- Preview da imagem.
- Botão **Analisar com IA**.
- Serviço `js/services/aiService.js` chamando a Supabase Edge Function `analyze-meal`.
- Campos editáveis para descrição, calorias, proteínas, carboidratos e gorduras.
- Card com resultado da IA e lista de alimentos identificados.
- Persistência local dos dados nutricionais e do retorno da IA.
- Service Worker atualizado para cache `controle-calorias-v3`.
- Edge Function em `supabase/functions/analyze-meal/index.ts`.

## Publicação da Edge Function

No terminal, dentro da pasta do projeto:

```bash
supabase login
supabase link --project-ref didokpppybtbtfambwns
supabase secrets set OPENAI_API_KEY="sua-chave-openai"
supabase functions deploy analyze-meal
```

Depois faça commit/push dos arquivos do app para o GitHub Pages.

## Observação importante

O botão **Analisar com IA** só funcionará depois que a Edge Function estiver publicada e a secret `OPENAI_API_KEY` estiver configurada no Supabase.
