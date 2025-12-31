# 📊 Tabela de Visitas (Visits) - Supabase

## ✅ Nova Tabela Necessária: `visits`

Esta tabela rastreia todos os visitantes do site, mesmo aqueles que não se inscrevem.

---

## 🚀 Como Criar no Supabase

### Via SQL Editor (RECOMENDADO) ⭐

1. Acesse seu projeto no Supabase: https://app.supabase.com
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **New Query**
4. Cole o SQL abaixo:

```sql
-- Criar tabela visits
CREATE TABLE visits (
  id BIGSERIAL PRIMARY KEY,
  ip TEXT,
  device TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  user_agent TEXT,
  page_url TEXT,
  session_id TEXT,
  converted BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMP WITH TIME ZONE,
  lead_id BIGINT,
  visit_duration INTEGER, -- em segundos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_visits_created_at ON visits(created_at DESC);
CREATE INDEX idx_visits_converted ON visits(converted);
CREATE INDEX idx_visits_session_id ON visits(session_id);
CREATE INDEX idx_visits_lead_id ON visits(lead_id);

-- Criar foreign key para leads (opcional, mas recomendado)
ALTER TABLE visits 
ADD CONSTRAINT fk_visits_lead 
FOREIGN KEY (lead_id) 
REFERENCES leads(id) 
ON DELETE SET NULL;
```

5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Pronto! ✅

---

## 📋 Descrição das Colunas

| Coluna | Tipo | Obrigatória? | Descrição |
|--------|------|--------------|-----------|
| `id` | BIGSERIAL | ✅ Sim | ID único (gerado automaticamente) |
| `ip` | TEXT | ❌ Não | Endereço IP do visitante |
| `device` | TEXT | ❌ Não | Tipo de dispositivo (mobile/desktop/tablet) |
| `referrer` | TEXT | ❌ Não | URL de origem (de onde veio) |
| `utm_source` | TEXT | ❌ Não | Parâmetro UTM source |
| `utm_medium` | TEXT | ❌ Não | Parâmetro UTM medium |
| `utm_campaign` | TEXT | ❌ Não | Parâmetro UTM campaign |
| `utm_term` | TEXT | ❌ Não | Parâmetro UTM term |
| `utm_content` | TEXT | ❌ Não | Parâmetro UTM content |
| `user_agent` | TEXT | ❌ Não | User agent do navegador |
| `page_url` | TEXT | ❌ Não | URL da página visitada |
| `session_id` | TEXT | ❌ Não | ID da sessão (para rastrear visitas) |
| `converted` | BOOLEAN | ✅ Sim | Se o visitante se converteu em lead (default: false) |
| `converted_at` | TIMESTAMP | ❌ Não | Data/hora da conversão |
| `lead_id` | BIGINT | ❌ Não | ID do lead relacionado (foreign key) |
| `visit_duration` | INTEGER | ❌ Não | Duração da visita em segundos |
| `created_at` | TIMESTAMP | ✅ Sim | Data/hora de criação (automático) |

---

## 🔗 Relacionamento com Leads

A tabela `visits` tem uma relação opcional com `leads`:
- Quando um visitante se inscreve, o campo `lead_id` é preenchido
- O campo `converted` muda para `true`
- O campo `converted_at` é preenchido

---

## ✅ Verificação

Após criar a tabela, teste a conexão:

1. Acesse: `https://seu-dominio.vercel.app/api/track-visit`
2. Deve retornar: `{"success": true}`

---

## 📝 Notas Importantes

- ✅ Esta tabela rastreia **todos** os visitantes, não apenas leads
- ✅ O campo `converted` indica se o visitante se tornou um lead
- ✅ O `session_id` ajuda a rastrear múltiplas visitas da mesma sessão
- ✅ Os índices melhoram a performance das consultas de analytics

