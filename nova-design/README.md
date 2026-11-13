# NOVA Design 1.7

Editor local HTML/CSS/JavaScript com painel de projetos, templates, páginas, formas, texto, imagens, camadas, exportação e integração opcional Supabase.

## Novidades
- Duplo clique em um texto para editar o conteúdo diretamente por diálogo.
- Recorte não destrutivo de imagens com controles percentuais de cada borda.
- Guias inteligentes de alinhamento ao arrastar objetos.
- Quatro novos modelos editáveis: café, cartão, podcast e lançamento.

## Executar
Abra `index.html` no navegador. Para Supabase use um servidor HTTP local/HTTPS e configure o SQL em `supabase/schema.sql`. Não use chave service_role no navegador.

## Limitações
A edição de texto usa diálogo nativo, não um cursor sobre o canvas. O recorte é ajustado por números, não por alças. PDF usa a impressão do navegador. A integração com Supabase requer configuração e validação no seu projeto.
