# Publicar no GitHub Pages

Este projeto é HTML, CSS e JavaScript puro, então pode ser publicado no GitHub Pages sem build.

## Antes de publicar

- Teste `index.html`, `painel.html` e `configuracoes.html`.
- Lembre que os dados ficam no navegador de cada pessoa.
- Use o painel para exportar um backup antes de fazer testes importantes.
- Senha inicial do painel: `1234`.

## Passo a passo

1. Crie uma conta no GitHub, se ainda não tiver.
2. Crie um repositório novo, por exemplo `lava-rapido-agenda`.
3. Envie todos os arquivos deste projeto para o repositório.
4. No GitHub, abra `Settings`.
5. Entre em `Pages`.
6. Em `Build and deployment`, selecione `Deploy from a branch`.
7. Escolha a branch `main` e a pasta `/root`.
8. Salve.

Depois de alguns minutos, o GitHub vai mostrar um link parecido com:

```txt
https://seu-usuario.github.io/lava-rapido-agenda/
```

## Observações importantes

O GitHub Pages serve apenas os arquivos estáticos. Ele não cria banco de dados.

Nesta fase:

- o cliente consegue abrir o site;
- o painel e configurações funcionam no navegador;
- os dados não são compartilhados entre celulares/computadores;
- exportar/importar JSON serve como backup temporário.

Para uso real entre dispositivos diferentes, o próximo passo será migrar os dados para Supabase.
