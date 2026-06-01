# Criar Login Administrativo no Supabase

Agora o painel e a tela de configurações usam Supabase Auth quando o Supabase está configurado.

## Criar usuário administrador

1. Abra seu projeto no Supabase.
2. Vá em `Autenticação`.
3. Entre em `Usuários`.
4. Clique em `Adicionar usuário`.
5. Escolha `Criar novo usuário`.
6. Informe um e-mail administrativo, por exemplo:

```txt
admin@seudominio.com
```

7. Defina uma senha forte.
8. Confirme a criação.

Depois disso, use esse e-mail e senha no `painel.html` e em `configuracoes.html`.

## Importante

- A senha local `1234` fica apenas como fallback quando o Supabase não está configurado.
- Com Supabase ativo, use o e-mail e senha do usuário criado em `Autenticação > Usuários`.
- Não compartilhe a conta administrativa com clientes.

## Próxima etapa de segurança

Depois que o login administrativo estiver funcionando, podemos endurecer as políticas RLS para permitir:

- cliente criar agendamento;
- administrador logado alterar status;
- administrador logado apagar/importar dados;
- público sem login não apagar agendamentos.
