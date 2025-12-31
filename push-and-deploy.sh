#!/bin/bash

echo "🚀 INICIANDO REDEPLOY..."
echo ""

# Navegar para o diretório do projeto
cd /Users/Ryan/HPS/Haitian-Photography-School

# Verificar se há commits pendentes
if git status | grep -q "Your branch is ahead"; then
    echo "✅ Commit pronto para push!"
    echo ""
    echo "📤 Fazendo push para GitHub..."
    
    # Tentar fazer push
    if git push; then
        echo ""
        echo "✅ PUSH FEITO COM SUCESSO!"
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
        exit 0
    else
        echo ""
        echo "❌ Erro ao fazer push!"
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
    echo "⚠️  Nenhum commit pendente para push"
    echo ""
    echo "Mas você ainda pode fazer redeploy manual no Vercel:"
    echo "1. Vá para: https://vercel.com/dashboard"
    echo "2. Clique em 'Deployments'"
    echo "3. Clique nos 3 pontinhos (⋯) → 'Redeploy'"
    echo ""
fi

