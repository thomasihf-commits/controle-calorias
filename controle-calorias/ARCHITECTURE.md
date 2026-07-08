# Controle de Calorias - Arquitetura

## Objetivo

Aplicativo web/PWA para controle diário de calorias, com autenticação, histórico de refeições, upload de fotos e estimativa de calorias usando IA.

## Princípios

- Projeto multiusuário desde o início.
- Supabase Auth para login.
- RLS obrigatório em todas as tabelas.
- Nenhuma chave secreta no frontend.
- OpenAI sempre chamada por Edge Function.
- Código modular e separado por responsabilidade.
- Telas HTML separadas de JavaScript.
- Controllers específicos por tela.

## Estrutura

```text
controle-calorias/
├── index.html
├── views/
├── css/
├── js/
│   ├── controllers/
│   ├── services/
│   ├── app.js
│   ├── auth.js
│   ├── config.js
│   ├── router.js
│   └── supabase.js
├── assets/
├── icons/
├── manifest.json
├── sw.js
└── README.md