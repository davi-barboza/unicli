# Unicli

Unicli é uma interface de linha de comando (CLI) universal projetada para gerar dinamicamente vários arquivos de projeto. Ela simplifica a configuração de projetos automatizando a criação de arquivos e estruturas comuns.

## Funcionalidades

- Gerar arquivos para diferentes tipos de projeto (ex.: projetos .NET).
- Suporte para repositórios, DTOs, entidades, controladores e padrões CQRS.
- Opções para criar um conjunto completo de arquivos ou componentes específicos.

## Pré-requisitos

- [Node.js](https://nodejs.org) (v16 ou superior).
- npm (vem com o Node.js).

## Instalação

1. Clone o repositório ou baixe o código fonte.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Compile o projeto:
   ```bash
   npm run build
   ```
4. Vincule a CLI globalmente:
   ```bash
   npm run link
   ```

## Uso

Após a instalação, você pode usar o comando `unicli` para gerar arquivos.

### Sintaxe Básica

```bash
unicli g [opções]
```

### Opções

| Opção              | Alias   | Descrição                                       |
| ------------------ | ------- | ----------------------------------------------- |
| `--type <type>`    | `-t`    | Tipo de projeto (ex.: dotnet).                  |
| `--project <name>` | `-p`    | Nome do projeto.                                |
| `--name <name>`    | `-n`    | Nome do arquivo/entidade.                       |
| `--repository`     | `-r`    | Gerar arquivos de repositório.                  |
| `--dto`            | `-d`    | Gerar arquivos de DTO (Data Transfer Object).   |
| `--entity`         | `-e`    | Gerar arquivos de entidade.                     |
| `--controller`     | `-c`    | Gerar arquivos de controlador.                  |
| `--cqrs`           | `-cqrs` | Gerar arquivos CQRS (Comandos/Consultas).       |
| `--full`           | `-f`    | Gerar todos os arquivos para o tipo de projeto. |

### Exemplos

#### Gerar um Repositório

```bash
unicli g -t dotnet -p MeuProjeto -n MinhaEntidade --repository
```

Isso gera arquivos de repositório para a entidade `MinhaEntidade` no projeto `MeuProjeto`.

#### Gerar Conjunto Completo de Arquivos

```bash
unicli g -t dotnet -p MeuProjeto -n MinhaEntidade --repository --f
```

Isso gera um conjunto completo de arquivos referentes a repositório, incluisve `Generics` (O padrão `UnitOfWork`).

## Desenvolvimento

Para modificar ou estender o Unicli, você pode:

1. Criar novos comandos como no arquivo `generate.ts`.
2. Atualizar o arquivo `index.ts` para adicionar os novos comandos ou funcionalidades.
3. Usar o `files-gen.ts` para definir a lógica de geração de arquivos.
4. Criar ou modificar templates na pasta `src/Templates`.

Após fazer alterações, recompile e relinque a CLI:

```bash
npm run build && npm run link
```

## Contribuindo

Contribuições são bem-vindas! Fique à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

---

Comece a construir mais rápido com o Unicli! 🚀
