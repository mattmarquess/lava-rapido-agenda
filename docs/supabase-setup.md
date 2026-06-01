# Configurar Supabase

Use este guia para fazer os agendamentos aparecerem em qualquer celular ou computador.

## 1. Criar projeto

1. Acesse `https://supabase.com`.
2. Crie uma conta ou entre na sua conta.
3. Crie um novo projeto.
4. Guarde a senha do banco em local seguro.

## 2. Criar tabela

1. Abra o projeto no Supabase.
2. Vá em `SQL Editor`.
3. Rode o SQL de `docs/database.md`.

## 3. Copiar chaves públicas

No Supabase:

1. Vá em `Project Settings`.
2. Entre em `API`.
3. Copie `Project URL`.
4. Copie `anon public key`.

## 4. Colar no projeto

Abra `js/settings.js` e preencha:

```js
const supabaseConfig = {
  url: "SUA_SUPABASE_URL",
  anonKey: "SUA_SUPABASE_ANON_KEY",
  businessId: "brilhomax"
};
```

## 5. Publicar novamente

Depois de salvar o arquivo:

```powershell
git add .
git commit -m "Conecta agendamentos ao Supabase"
git push
```

O GitHub Pages atualiza automaticamente depois do push.

## Observação

A chave `anon public key` é pública e pode ficar no frontend. Ela trabalha junto com as políticas de segurança do Supabase.

As políticas deste protótipo são abertas para facilitar a demonstração. Para vender como produto real, vamos trocar por login/autenticação real.
