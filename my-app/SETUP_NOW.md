# 🚀 Setup Rápido - 3 Passos

## ✅ Passo 1: Criar o arquivo .env.local (30 segundos)

Crie um arquivo chamado `.env.local` na pasta `my-app/` com este conteúdo:

```env
POSTGRES_URL="your-neon-postgres-url-here"
POSTGRES_URL_NON_POOLING="your-neon-postgres-url-here"
ADMIN_PASSWORD="your-secure-password-here"
```

**Como criar:**
```bash
cd /Users/Ryan/HPS/Haitian-Photography-School/my-app
nano .env.local
# Cole o conteúdo acima
# Ctrl+X, Y, Enter para salvar
```

Ou use seu editor preferido (VS Code, etc.)

---

## ✅ Passo 2: Executar o Schema no Neon (1 minuto)

### Opção A: Neon Console (Mais Fácil)

1. Abra: https://console.neon.tech
2. Vá para seu projeto
3. Clique em "SQL Editor"
4. Copie **TODO** o conteúdo do arquivo `schema.sql`
5. Cole no editor
6. Clique em "Run" ou pressione Ctrl+Enter
7. Aguarde a mensagem de sucesso

### Opção B: Via Terminal (Se tiver psql instalado)

```bash
cd /Users/Ryan/HPS/Haitian-Photography-School/my-app

psql 'your-neon-connection-string-here' < schema.sql
```

---

## ✅ Passo 3: Testar Localmente (1 minuto)

```bash
cd /Users/Ryan/HPS/Haitian-Photography-School/my-app

# Iniciar o servidor de desenvolvimento
npm run dev
```

Abra no navegador:
- **Landing Page:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin (senha: sua senha do ADMIN_PASSWORD)

---

## 🧪 Teste Completo

1. ✅ Acesse http://localhost:3000
2. ✅ Preencha o formulário de registro
3. ✅ Clique em "Enskri Gratis Kounye a"
4. ✅ Veja o modal de sucesso aparecer (90% progress bar)
5. ✅ Acesse http://localhost:3000/admin
6. ✅ Faça login com: `HPS2025_Admin!`
7. ✅ Veja seu lead de teste na tabela!

---

## 🐛 Problemas?

### "Can't connect to database"
→ Verifique se o `.env.local` está na pasta `my-app/` com as URLs corretas

### "Table doesn't exist"
→ Execute o `schema.sql` no Neon Console (Passo 2)

### "Admin login not working"
→ Use a senha que você definiu no ADMIN_PASSWORD (com maiúsculas e símbolos)

---

## 🎉 Próximo Passo

Depois de testar localmente, faça o deploy:

```bash
vercel
```

No Vercel Dashboard, adicione as mesmas 3 variáveis de ambiente!

---

## 📋 Checklist Rápido

- [ ] Arquivo `.env.local` criado na pasta `my-app/`
- [ ] Schema SQL executado no Neon Console
- [ ] Servidor rodando: `npm run dev`
- [ ] Landing page abre: http://localhost:3000
- [ ] Formulário submetido com sucesso
- [ ] Modal de sucesso aparece
- [ ] Admin dashboard funciona: http://localhost:3000/admin
- [ ] Lead aparece na tabela do admin

Se todos os itens estão ✅, você está pronto para deploy! 🚀

