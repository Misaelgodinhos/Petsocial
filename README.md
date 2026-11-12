# PETGO 1.0

Marketplace responsivo para agropecuárias e pet shops. Cada loja realiza suas próprias entregas.

## Executar
Abra `index.html` em um navegador ou publique a branch `main` via GitHub Pages (raiz do repositório). Não exige build.

## Funcionalidades implementadas (protótipo local)
- Busca de lojas e produtos por nome e cidade; filtros de categoria.
- Vitrine de lojas, produtos, preços e estoque.
- Carrinho limitado a produtos de uma loja, frete configurável por loja.
- Pedido de **demonstração**, salvo no navegador e visível na central do lojista no mesmo navegador.
- Central de lojista demonstrativa para cadastrar produtos, editar preços/estoque, serviços, frete e alterar status de pedidos.
- Layout responsivo.

## Limitações importantes
Os dados são fictícios e todas as operações ficam em `localStorage`. Não há login, integração real com Supabase, sincronização entre aparelhos, processamento de pagamentos, envio real de pedidos, confirmação de frete por CEP nem proteção de dados de clientes em servidor. **Não use para receber pedidos reais.** Os nomes de lojas demonstrativas não representam parcerias ou cadastros reais.

## Próxima etapa de produção
O arquivo `supabase/schema.sql` contém um esquema inicial isolado com RLS para uso em um projeto Supabase escolhido pelo responsável. Antes de usar em produção: configurar Auth, cadastro e aprovação de lojas, políticas de acesso, validação de pedidos no servidor, cálculo de frete e área de atendimento, armazenamento de imagens, LGPD e testes ponta a ponta. Não inserir chaves secretas no frontend.

## Arquivos
- `index.html`: página principal
- `style.css`: layout responsivo
- `app.js`: lógica local
- `supabase/schema.sql`: proposta de tabelas e RLS, **não aplicada a banco algum**.
