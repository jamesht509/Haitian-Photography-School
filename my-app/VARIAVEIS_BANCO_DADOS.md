# 🗄️ Variáveis de Banco de Dados - Qual Usar?

## 📋 RESPOSTA RÁPIDA

O código aceita **AMBAS** as variáveis:
- ✅ `DATABASE_URL` (prioridade)
- ✅ `POSTGRES_URL` (fallback)

**Recomendação:** Use `POSTGRES_URL` porque:
- ✅ É mais específico para PostgreSQL
- ✅ É o que está no template (`ENV_TEMPLATE.txt`)
- ✅ É o padrão do Vercel para PostgreSQL

---

## 🔍 COMO O CÓDIGO FUNCIONA

Olhando no código (`app/api/leads/route.ts`, linha 6):

```typescript
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
```

**Ordem de prioridade:**
1. Primeiro tenta `DATABASE_URL`
2. Se não existir, usa `POSTGRES_URL`
3. Se nenhuma existir, dá erro

---

## ✅ CONFIGURAÇÃO RECOMENDADA NO VERCEL

Configure **`POSTGRES_URL`** no Vercel:

1. Vercel Dashboard → Settings → Environment Variables
2. Adicione:
   - **Key:** `POSTGRES_URL`
   - **Value:** Sua connection string do Neon
   - **Environments:** Production, Preview, Development

**Sua connection string:**
```
postgresql://neondb_owner:npg_jrsJu2S1aDmg@ep-proud-night-ad2ucb2w-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

---

## 🔄 SE VOCÊ JÁ TEM DATABASE_URL

Se você já configurou `DATABASE_URL` no Vercel, **também funciona!**

O código vai usar `DATABASE_URL` primeiro, então está tudo certo.

---

## 📊 COMPARAÇÃO

| Variável | Prioridade | Recomendado? | Motivo |
|----------|-----------|--------------|--------|
| `DATABASE_URL` | 1ª (primeira) | ⚠️ Funciona, mas genérico | Genérico para qualquer banco |
| `POSTGRES_URL` | 2ª (fallback) | ✅ **SIM** | Específico para PostgreSQL |

---

## 🎯 RESUMO

**Use `POSTGRES_URL`** porque:
- ✅ É mais específico
- ✅ Está no template do projeto
- ✅ É o padrão do Vercel para PostgreSQL
- ✅ Funciona perfeitamente (é a segunda opção, mas funciona)

**Mas se você já tem `DATABASE_URL` configurado:**
- ✅ Também funciona! (tem prioridade)
- ✅ Não precisa mudar nada

---

## ✅ CHECKLIST

- [ ] Configurei `POSTGRES_URL` no Vercel (ou `DATABASE_URL` se preferir)
- [ ] Marquei para Production, Preview e Development
- [ ] Fiz redeploy após configurar
- [ ] Testei o login

---

**Resumo: Use `POSTGRES_URL`, mas `DATABASE_URL` também funciona! ✅**

