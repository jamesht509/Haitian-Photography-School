# 📊 Tabelas Necessárias no Supabase

## ✅ Você precisa criar apenas **1 tabela**:

### Tabela: `leads`

Esta é a única tabela necessária para o sistema funcionar. Ela armazena todos os leads capturados pelo formulário.

---

## 🚀 Como Criar no Supabase

### Opção 1: Via SQL Editor (RECOMENDADO) ⭐

1. Acesse seu projeto no Supabase: https://app.supabase.com
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **New Query**
4. Cole o SQL abaixo:

```sql
-- Criar tabela leads
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  device TEXT,
  ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);
```

5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Pronto! ✅

---

### Opção 2: Via Table Editor (Interface Visual)

1. Acesse seu projeto no Supabase: https://app.supabase.com
2. Vá em **Table Editor** (menu lateral)
3. Clique em **New Table**
4. Configure:

   **Table Name:** `leads`

   **Columns:**

   | Column Name | Type | Nullable | Default Value | Primary Key |
   |-------------|------|----------|---------------|-------------|
   | `id` | `int8` (bigint) | ❌ No | `auto` | ✅ Yes |
   | `name` | `text` | ❌ No | - | ❌ No |
   | `whatsapp` | `text` | ❌ No | - | ❌ No |
   | `email` | `text` | ❌ No | - | ❌ No |
   | `city` | `text` | ❌ No | - | ❌ No |
   | `device` | `text` | ✅ Yes | - | ❌ No |
   | `ip` | `text` | ✅ Yes | - | ❌ No |
   | `created_at` | `timestamptz` | ❌ No | `now()` | ❌ No |

5. Clique em **Save**
6. Depois, vá em **Database** → **Indexes** e crie os índices:
   - `idx_leads_created_at` na coluna `created_at` (DESC)
   - `idx_leads_email` na coluna `email`

---

## 📋 Descrição das Colunas

| Coluna | Tipo | Obrigatória? | Descrição |
|--------|------|--------------|-----------|
| `id` | BIGSERIAL | ✅ Sim | ID único (gerado automaticamente) |
| `name` | TEXT | ✅ Sim | Nome completo do lead |
| `whatsapp` | TEXT | ✅ Sim | Número do WhatsApp |
| `email` | TEXT | ✅ Sim | Email do lead |
| `city` | TEXT | ✅ Sim | Cidade do lead |
| `device` | TEXT | ❌ Não | Tipo de dispositivo (mobile/desktop/tablet) |
| `ip` | TEXT | ❌ Não | Endereço IP do usuário |
| `created_at` | TIMESTAMP | ✅ Sim | Data/hora de criação (automático) |

---

## ✅ Verificação

Após criar a tabela, teste a conexão:

1. Acesse: `https://seu-dominio.vercel.app/api/test-db`
2. Deve retornar: `"Supabase connection successful"`

---

## 🔍 Permissões (RLS - Row Level Security)

Por padrão, o Supabase pode bloquear acesso. Se necessário:

1. Vá em **Authentication** → **Policies**
2. Na tabela `leads`, crie uma política:
   - **Policy Name:** `Allow service role full access`
   - **Allowed Operation:** ALL
   - **Target Roles:** `service_role`
   - **USING expression:** `true`
   - **WITH CHECK expression:** `true`

**OU** desabilite RLS temporariamente para a tabela `leads` (apenas para desenvolvimento/teste).

---

## 📝 Notas Importantes

- ✅ Apenas **1 tabela** é necessária: `leads`
- ✅ O campo `id` é gerado automaticamente
- ✅ O campo `created_at` é preenchido automaticamente
- ✅ Os campos `device` e `ip` são opcionais (podem ser NULL)
- ✅ Os índices melhoram a performance das consultas

---

## 🆘 Problemas Comuns

**Erro: "relation 'leads' does not exist"**
- A tabela não foi criada ainda
- Execute o SQL acima no SQL Editor

**Erro: "permission denied for table leads"**
- Configure as políticas RLS ou desabilite RLS para a tabela

**Erro: "column does not exist"**
- Verifique se todas as colunas foram criadas corretamente
- Compare com a lista acima

