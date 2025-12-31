# 📊 Tabela de Scroll Tracking - Supabase

## ✅ Nova Tabela Necessária: `scroll_tracking`

Esta tabela rastreia a profundidade de scroll dos visitantes, mostrando onde eles param de ler.

---

## 🚀 Como Criar no Supabase

### Via SQL Editor (RECOMENDADO) ⭐

1. Acesse seu projeto no Supabase: https://app.supabase.com
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **New Query**
4. Cole o SQL abaixo:

```sql
-- Criar tabela scroll_tracking
CREATE TABLE scroll_tracking (
  id BIGSERIAL PRIMARY KEY,
  visit_id BIGINT,
  milestone INTEGER NOT NULL CHECK (milestone IN (25, 50, 75, 100)),
  section_name TEXT,
  scroll_percentage INTEGER NOT NULL,
  page_height INTEGER,
  viewport_height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_scroll_tracking_visit_id ON scroll_tracking(visit_id);
CREATE INDEX idx_scroll_tracking_milestone ON scroll_tracking(milestone);
CREATE INDEX idx_scroll_tracking_section ON scroll_tracking(section_name);
CREATE INDEX idx_scroll_tracking_created_at ON scroll_tracking(created_at DESC);

-- Criar foreign key para visits (opcional, mas recomendado)
ALTER TABLE scroll_tracking 
ADD CONSTRAINT fk_scroll_tracking_visit 
FOREIGN KEY (visit_id) 
REFERENCES visits(id) 
ON DELETE CASCADE;
```

5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Pronto! ✅

---

## 📋 Descrição das Colunas

| Coluna | Tipo | Obrigatória? | Descrição |
|--------|------|--------------|-----------|
| `id` | BIGSERIAL | ✅ Sim | ID único (gerado automaticamente) |
| `visit_id` | BIGINT | ❌ Não | ID da visita relacionada (foreign key) |
| `milestone` | INTEGER | ✅ Sim | Milestone alcançado (25, 50, 75, ou 100) |
| `section_name` | TEXT | ❌ Não | Nome da seção visível (ex: "Intro", "3D Book", "Price") |
| `scroll_percentage` | INTEGER | ✅ Sim | Porcentagem exata de scroll (0-100) |
| `page_height` | INTEGER | ❌ Não | Altura total da página em pixels |
| `viewport_height` | INTEGER | ❌ Não | Altura da viewport em pixels |
| `created_at` | TIMESTAMP | ✅ Sim | Data/hora de criação (automático) |

---

## 🎯 Milestones Rastreados

- **25%** - Usuário rolou 1/4 da página
- **50%** - Usuário rolou metade da página
- **75%** - Usuário rolou 3/4 da página
- **100%** - Usuário rolou até o final

---

## 🔗 Relacionamento com Visits

A tabela `scroll_tracking` tem uma relação opcional com `visits`:
- Quando um milestone é alcançado, o `visit_id` é preenchido
- Permite analisar comportamento de scroll por visita
- Cascade delete: se uma visita é deletada, seus scrolls também são

---

## ✅ Verificação

Após criar a tabela, teste a conexão:

1. Role a página até 25%
2. Verifique no console: `✅ Scroll milestone tracked: 25%`
3. Verifique no Supabase se o registro foi criado

---

## 📝 Notas Importantes

- ✅ Cada milestone só é registrado **uma vez por sessão**
- ✅ O script detecta automaticamente a seção visível
- ✅ Os índices melhoram a performance das consultas de analytics
- ✅ O `visit_id` permite correlacionar scroll com conversão

