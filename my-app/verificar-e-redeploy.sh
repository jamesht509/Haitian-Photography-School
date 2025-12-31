#!/bin/bash

echo "🔐 VERIFICAÇÃO E REDEPLOY - Admin Password"
echo "=========================================="
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navegar para o diretório do projeto
cd "$(dirname "$0")/.." || exit 1

echo "📋 Verificando status do Git..."
echo ""

# Verificar se há mudanças
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  Nenhuma mudança pendente para commit${NC}"
    echo ""
    echo "💡 Você pode fazer redeploy manual no Vercel:"
    echo "   1. Vá para: https://vercel.com/dashboard"
    echo "   2. Clique em 'Deployments'"
    echo "   3. Clique nos 3 pontinhos (⋯) → 'Redeploy'"
    echo ""
    exit 0
fi

echo "✅ Mudanças detectadas!"
echo ""
echo "📝 Arquivos modificados:"
git status --short
echo ""

# Perguntar se quer fazer commit
read -p "Deseja fazer commit e push para triggar redeploy? (s/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    echo "❌ Operação cancelada"
    exit 0
fi

echo ""
echo "📦 Fazendo commit..."
git add .

if git commit -m "fix: improve admin password auth and add debug endpoint"; then
    echo -e "${GREEN}✅ Commit criado com sucesso!${NC}"
    echo ""
    echo "📤 Fazendo push para GitHub..."
    
    if git push; then
        echo ""
        echo -e "${GREEN}✅ PUSH FEITO COM SUCESSO!${NC}"
        echo ""
        echo "⏳ O Vercel está fazendo o deploy agora..."
        echo "   Aguarde 1-2 minutos"
        echo ""
        echo "🔗 Acompanhe em: https://vercel.com/dashboard"
        echo ""
        echo "🎯 Depois, teste o login:"
        echo "   URL: https://www.haitianphotographyschool.com/admin"
        echo "   Senha: Zoe509"
        echo ""
        echo "🔍 Para debug, acesse:"
        echo "   https://www.haitianphotographyschool.com/api/debug-auth?key=debug123"
        echo ""
        exit 0
    else
        echo ""
        echo -e "${RED}❌ Erro ao fazer push!${NC}"
        echo ""
        echo "💡 SOLUÇÃO ALTERNATIVA:"
        echo ""
        echo "Faça o redeploy manual no Vercel:"
        echo "1. Vá para: https://vercel.com/dashboard"
        echo "2. Clique em 'Deployments'"
        echo "3. Clique nos 3 pontinhos (⋯) → 'Redeploy'"
        echo ""
        exit 1
    fi
else
    echo -e "${RED}❌ Erro ao criar commit${NC}"
    exit 1
fi

