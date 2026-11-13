# NOVA Design 1.7 — publicação

Destino: `nova-design/` neste repositório.
Supabase: `https://dthqzavxqoejqszsijqd.supabase.co`.
Tabela isolada: `public.design_projects` com RLS por proprietário.

Para publicar a versão integral, extrair `nova-design-1.7.zip` e enviar os arquivos `index.html`, `app.js`, `dashboard.js`, `enhancements.js` e `style.css` para esta pasta. O arquivo `supabase/schema.sql` já está documentado e a migração foi executada.

No painel Nuvem do aplicativo, configurar a URL acima e a chave pública publishable do projeto. Nunca publicar a service_role.

GitHub Pages: se já estiver ativo para a branch principal na raiz, esta pasta será servida em `/Petsocial/nova-design/` após o upload do aplicativo. Não alterar a configuração de Pages da raiz sem conferir a configuração existente.
