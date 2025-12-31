# 🧪 Testar Conexão com Banco de Dados

## 🎯 Rota de Teste Criada

Criei uma rota temporária para testar a conexão com o banco de dados:

**URL:** `https://www.haitianphotographyschool.com/api/test-db`

---

## 🚀 Como Usar

### 1. Fazer Deploy das Mudanças

Primeiro, faça deploy da nova rota:

**Opção A - Push para GitHub:**
```bash
cd /Users/Ryan/HPS/Haitian-Photography-School
git add .
git commit -m "feat: add test-db endpoint to verify database connection"
git push
```

**Opção B - Redeploy Manual:**
- Vercel Dashboard → Deployments → ⋯ → Redeploy

**Aguarde 2 minutos** para o deploy completar.

---

### 2. Acessar a Rota de Teste

Depois do deploy, acesse no navegador:

```
https://www.haitianphotographyschool.com/api/test-db
```

Ou use curl:

```bash
curl https://www.haitianphotographyschool.com/api/test-db
```

---

## 📊 O Que a Rota Vai Mostrar

A rota executa vários testes e retorna um JSON detalhado:

### ✅ Se Conectar com Sucesso:

```json
{
  "success": true,
  "message": "Connected",
  "connection_status": "Connected",
  "results": {
    "timestamp": "2025-01-01T12:00:00.000Z",
    "tests": [
      {
        "name": "Environment Variables Check",
        "passed": true,
        "details": {
          "DATABASE_URL": "SET",
          "POSTGRES_URL": "SET"
        }
      },
      {
        "name": "Create Connection Pool",
        "passed": true
      },
      {
        "name": "Execute SELECT NOW()",
        "passed": true,
        "details": {
          "current_time": "2025-01-01T12:00:00.000Z",
          "pg_version": "PostgreSQL 15.0..."
        }
      }
    ],
    "summary": {
      "connection_status": "Connected",
      "all_passed": true
    }
  }
}
```

### ❌ Se Falhar:

```json
{
  "success": false,
  "message": "Connection failed",
  "error": "Error message here",
  "errorDetails": {
    "name": "ErrorType",
    "message": "Specific error message",
    "stack": "Error stack trace"
  },
  "results": {
    "tests": [
      {
        "name": "Execute SELECT NOW()",
        "passed": false,
        "details": {
          "error": "Specific error message"
        }
      }
    ]
  }
}
```

---

## 🔍 O Que a Rota Testa

1. ✅ **Environment Variables** - Verifica se `DATABASE_URL` ou `POSTGRES_URL` existem
2. ✅ **Create Pool** - Tenta criar o connection pool
3. ✅ **SELECT NOW()** - Executa uma query simples
4. ✅ **Check Table** - Verifica se a tabela `leads` existe
5. ✅ **Count Leads** - Conta quantos leads existem (se a tabela existir)

---

## 🎯 O Que Procurar

### Se `success: true`:
- ✅ Conexão funcionando!
- ✅ Banco de dados acessível
- ✅ Variáveis configuradas corretamente

### Se `success: false`:
- ❌ Veja o campo `error` para o erro específico
- ❌ Veja `errorDetails` para mais informações
- ❌ Veja `results.tests` para ver qual teste falhou

---

## 🆘 Erros Comuns

### "No database URL found"
- **Problema:** `DATABASE_URL` ou `POSTGRES_URL` não está configurado
- **Solução:** Configure no Vercel → Settings → Environment Variables

### "Failed to create connection pool"
- **Problema:** Connection string inválida ou formato incorreto
- **Solução:** Verifique a connection string no Vercel

### "Connection timeout" ou "ECONNREFUSED"
- **Problema:** Banco de dados não está acessível ou bloqueado
- **Solução:** Verifique no Neon Dashboard se o banco está ativo

### "SSL required" ou "sslmode"
- **Problema:** Connection string não tem `?sslmode=require`
- **Solução:** Adicione `?sslmode=require` na connection string

---

## 📋 Checklist

- [ ] Fiz deploy das mudanças (push ou redeploy)
- [ ] Aguardei 2 minutos para deploy completar
- [ ] Acessei `/api/test-db` no navegador
- [ ] Verifiquei o resultado (success: true/false)
- [ ] Se falhou, li a mensagem de erro específica

---

## 🎯 Próximos Passos

Depois de testar:

1. **Se `success: true`:**
   - ✅ Banco está conectado
   - ✅ Pode testar o login do admin agora
   - ✅ Problema não é conexão, pode ser outra coisa

2. **Se `success: false`:**
   - ❌ Compartilhe a mensagem de erro específica
   - ❌ Vou ajudar a resolver baseado no erro

---

**Acesse `/api/test-db` e me diga o resultado! 🧪**

