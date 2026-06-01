# BrilhoMax Lava Rápido

Protótipo simples de agendamento online para lava rápido.

## Como abrir

Abra o arquivo `index.html` no navegador para ver a tela do cliente.

Abra o arquivo `painel.html` no navegador para ver a tela do dono/vendedor.

Abra o arquivo `configuracoes.html` no navegador para editar dados do sistema.

Senha inicial do painel e configurações: `1234`.

Se a senha não funcionar em um navegador, use `Restaurar senha padrão 1234` na tela de login.

Esta primeira versão não precisa de servidor, Node.js, npm, banco de dados ou hospedagem paga. Os agendamentos ficam salvos no próprio navegador usando `localStorage`.

## Estrutura dos arquivos

```txt
index.html
painel.html
configuracoes.html
css/
  styles.css
js/
  settings.js       Configurações do lava rápido, serviços, horários e veículos
  settings-page.js  Tela para editar configurações sem mexer no código
  utils.js          Funções auxiliares de preço, data, telefone e WhatsApp
  storage.js        Leitura e gravação dos agendamentos no navegador
  auth.js           Login local do painel e configurações
  dom.js            Mapa dos elementos da tela
  render.js         Tudo que desenha serviços, painel e consultas na tela
  appointments.js   Regras de agendamento, status, cancelamento e capacidade
  backup.js         Exportação, importação e limpeza dos dados locais
  demo.js           Geração de agendamentos fictícios para apresentação
  app.js            Inicialização do sistema
docs/
  database.md       Modelo futuro do banco para Supabase/PostgreSQL
  deploy-github-pages.md  Guia para publicar grátis no GitHub Pages
  publish-checklist.md     Checklist antes de enviar o link para clientes
  supabase-setup.md        Guia para ligar o projeto ao Supabase
tools/
  create-publish-package.ps1  Cria um arquivo .zip com os arquivos do site
```

Para mudar nome, WhatsApp, endereço, quantidade de boxes, horários, serviços ou tipos de veículo, comece pelo arquivo `js/settings.js`. A tela principal lê essas configurações automaticamente.

Também é possível mudar esses dados pela tela `configuracoes.html`. As alterações ficam salvas neste navegador usando `localStorage`.

O login atual é local, usando `sessionStorage` para a sessão e `localStorage` para a senha alterada. Ele serve para protótipo e apresentação, mas a versão online deve trocar isso por autenticação real.

Para publicar uma demonstração grátis, siga o guia em `docs/deploy-github-pages.md`.

Para salvar agendamentos online, siga `docs/supabase-setup.md`.

Para gerar um pacote `.zip` do site:

```powershell
powershell -ExecutionPolicy Bypass -File tools\create-publish-package.ps1
```

O arquivo gerado será `lava-rapido-agenda-site.zip`.

## O que já tem

- Página pública do lava rápido
- Lista de serviços
- Agendamento com nome, WhatsApp, placa, serviço, veículo, data e horário
- Cálculo de preço por tipo de veículo
- Controle simples de capacidade por horário, começando com 2 boxes
- Tela separada de painel para o dono acompanhar os agendamentos
- Filtros no painel por status
- Botão de WhatsApp para falar com o cliente
- Exibição de observações do agendamento no painel
- Cancelamento rápido pelo painel
- Tela de configurações para editar negócio, serviços, veículos e horários
- Login simples para proteger painel e configurações
- Troca de senha administrativa nas configurações
- Exportação e importação de backup em JSON
- Limpeza dos dados locais pelo painel
- Geração de dados de demonstração no painel
- Preparação para publicação no GitHub Pages
- Integração opcional com Supabase para agendamentos online
- Status do serviço: Agendado, Em atendimento, Pronto, Entregue e Cancelado

## Próximo passo

Quando for colocar online para clientes reais, a próxima evolução recomendada é:

- Next.js
- Supabase gratuito
- PostgreSQL no Supabase
- Deploy gratuito na Vercel
