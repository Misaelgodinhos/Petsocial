# NOVA Design 1.8

Editor local HTML/CSS/JavaScript com painel de projetos, templates, páginas, formas, texto, imagens, camadas, exportação e integração opcional Supabase.

## Novidades 1.8
- Edição de texto com múltiplas linhas em janela integrada, com Aplicar e Cancelar.
- Barra contextual: editar texto, duplicar, trazer à frente e excluir.
- Exportação da página atual em PNG/JPG, 1080 px ou ampliação para 2160 px.
- Exportações de imagem sem contornos de seleção e guias.
- Layout mobile com canvas ajustável e ferramentas recolhíveis.

## Recursos 1.7
- Duplo clique em um texto para editar o conteúdo diretamente por diálogo.
- Recorte não destrutivo de imagens com controles percentuais de cada borda.
- Guias inteligentes de alinhamento ao arrastar objetos.
- Quatro novos modelos editáveis: café, cartão, podcast e lançamento.

## Executar
Abra `index.html` no navegador. Para Supabase use um servidor HTTP local/HTTPS e configure o SQL em `supabase/schema.sql`. Não use chave service_role no navegador.

## Limitações
A edição de texto usa uma janela integrada, não um cursor sobre o canvas. A saída de 2160 px amplia a renderização de 1080 px. O recorte é ajustado por números, não por alças. PDF usa a impressão do navegador. A integração com Supabase requer configuração e validação no seu projeto.
