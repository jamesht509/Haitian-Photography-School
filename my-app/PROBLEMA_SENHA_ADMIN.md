# 🔐 Problema com Senha do Admin - SOLUÇÃO

## ❌ Problema Identificado

A senha **"Zoe509"** não funciona no admin em produção porque a variável de ambiente `ADMIN_PASSWORD` não está configurada corretamente no Vercel.

## 🔍 O que está acontecendo

Olhando no código `app/api/leads/route.ts`, linha 124:

```typescript
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
```

Se a variável `ADMIN_PASSWORD` não estiver definida no Vercel, o sistema usa a senha padrão **"admin123"**.

## ✅ SOLUÇÃO: Configure a Variável no Vercel

### Passo 1: Acesse o Dashboard do Vercel

1. Vá para: https://vercel.com
2. Faça login na sua conta
3. Selecione o projeto: **haitian-photography-school** (ou o nome do seu projeto)

### Passo 2: Adicione a Variável de Ambiente

1. Clique em **"Settings"** (Configurações)
2. No menu lateral, clique em **"Environment Variables"** (Variáveis de Ambiente)
3. Clique em **"Add New"** (Adicionar Nova)
4. Preencha os campos:
   - **Key (Nome):** `ADMIN_PASSWORD`
   - **Value (Valor):** `Zoe509`
   - **Environment:** Selecione **Production**, **Preview**, e **Development** (todas as três)
5. Clique em **"Save"** (Salvar)

### Passo 3: Re-deploy do Projeto

Depois de adicionar a variável, você precisa fazer um novo deploy:

**Opção A - Re-deploy pelo Dashboard:**
1. Vá para a aba **"Deployments"**
2. Encontre o último deployment
3. Clique nos três pontinhos (⋯) ao lado
4. Selecione **"Redeploy"**
5. Confirme clicando em **"Redeploy"** novamente

**Opção B - Re-deploy automático:**
1. Faça qualquer pequena alteração no código (adicione um espaço ou comentário)
2. Faça commit e push para o GitHub
3. O Vercel fará o deploy automaticamente

### Passo 4: Teste o Login

Depois do re-deploy (aguarde 1-2 minutos):

1. Vá para: https://www.haitianphotographyschool.com/admin
2. Digite a senha: **Zoe509**
3. Clique em **Login**
4. ✅ Deve funcionar agora!

## 🎯 Verificação Rápida

### Como saber se a variável está configurada:

1. No Vercel Dashboard → Settings → Environment Variables
2. Você deve ver:
   ```
   ADMIN_PASSWORD = Zoe509
   ```

### Senhas possíveis no momento:

| Senha | Status | Onde funciona |
|-------|--------|---------------|
| `admin123` | ⚠️ Senha padrão (fallback) | Se `ADMIN_PASSWORD` não estiver definido |
| `Zoe509` | ✅ Senha correta desejada | Depois de configurar `ADMIN_PASSWORD` no Vercel |

## 📱 Captura de Tela do Vercel

Quando você acessar as Environment Variables no Vercel, deve ficar assim:

```
Environment Variables
┌─────────────────────────────────────────────────────┐
│ Key: ADMIN_PASSWORD                                 │
│ Value: ••••••• (Zoe509 - oculto)                   │
│ Environments: Production, Preview, Development      │
└─────────────────────────────────────────────────────┘
```

## 🛠️ Se ainda não funcionar

### Verifique se há espaços extras:
- ❌ `" Zoe509"` (espaço antes)
- ❌ `"Zoe509 "` (espaço depois)
- ✅ `"Zoe509"` (correto)

### Verifique a capitalização:
- ❌ `"zoe509"` (minúsculas)
- ❌ `"ZOE509"` (maiúsculas)
- ✅ `"Zoe509"` (Z maiúsculo, resto minúsculo)

### Limpe o cache do navegador:
```bash
# Chrome/Edge
Ctrl+Shift+Delete → Limpar dados de navegação

# Safari
Cmd+Option+E → Esvaziar caches
```

### Verifique os logs do Vercel:
1. Vercel Dashboard → Deployments
2. Clique no último deployment
3. Vá para **"Functions"** → **"api/leads"**
4. Verifique se há erros

## ✅ Checklist Final

- [ ] Variável `ADMIN_PASSWORD` adicionada no Vercel
- [ ] Valor configurado como `Zoe509` (case-sensitive)
- [ ] Selecionadas todas as environments (Production, Preview, Development)
- [ ] Re-deploy feito com sucesso
- [ ] Aguardado 1-2 minutos para o deploy completar
- [ ] Testado o login em: https://www.haitianphotographyschool.com/admin
- [ ] Login funcionando com senha `Zoe509` ✅

## 📞 Suporte Adicional

Se depois de seguir todos esses passos ainda não funcionar:

1. Tire uma captura de tela das Environment Variables no Vercel
2. Verifique os logs de erro no Console do navegador (F12)
3. Compartilhe essas informações para investigação mais profunda

---

**Resumo:** A senha não funciona porque a variável `ADMIN_PASSWORD` não está configurada no Vercel. Siga os passos acima para configurar `ADMIN_PASSWORD=Zoe509` e fazer um re-deploy.

