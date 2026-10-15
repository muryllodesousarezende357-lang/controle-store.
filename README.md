# Controle Store — MVP

Aplicação inicial de gestão comercial construída com React, TypeScript e Vite. Este projeto é uma implementação independente para desenvolver funcionalidades semelhantes de gestão, não uma cópia do site original.

## Funcionalidades demonstrativas
- Tela de acesso demonstrativa (não coleta nem envia credenciais reais)
- Painel com indicadores
- Navegação por produtos, clientes, vendas, fiados, caixa, orçamentos, relatórios e equipe
- Estrutura inicial de banco de dados em `supabase/schema.sql`

> **Importante:** esta é uma base de desenvolvimento. Antes de usar em produção, implemente autenticação real no Supabase, revise as políticas RLS, valide permissões e configure backups. Os dados exibidos no painel são demonstrativos.

## Requisitos
- Node.js 20 ou superior
- Projeto Supabase (opcional para executar a interface demonstrativa)

## Executar localmente
```bash
npm install
npm run dev
```

Copie `.env.example` para `.env.local` e preencha as variáveis do Supabase quando for conectar o banco.

## Build
```bash
npm run build
npm run preview
```

## Próximos passos
1. Configurar autenticação real com Supabase Auth.
2. Conectar as telas às tabelas do banco.
3. Criar testes e validar políticas de acesso.
4. Implementar controle de estoque transacional, auditoria e permissões por função.
