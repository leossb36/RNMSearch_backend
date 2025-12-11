# Rick and Morty Search Backend

API backend construída com NestJS para integração com a [Rick and Morty API](https://rickandmortyapi.com/), oferecendo endpoints otimizados com streams RxJS para consulta de episódios, personagens e localizações.

## Índice

- [Rick and Morty Search Backend](#rick-and-morty-search-backend)
  - [Índice](#índice)
  - [Descrição](#descrição)
  - [Tecnologias](#tecnologias)
  - [Estrutura do Projeto](#estrutura-do-projeto)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Configuração](#configuração)
  - [Executando a Aplicação](#executando-a-aplicação)
    - [Desenvolvimento](#desenvolvimento)
    - [Produção](#produção)
  - [Endpoints da API](#endpoints-da-api)
    - [Base URL](#base-url)
    - [Documentação Swagger](#documentação-swagger)
    - [Endpoints Disponíveis](#endpoints-disponíveis)
      - [1. Buscar Episódio Detalhado](#1-buscar-episódio-detalhado)
      - [2. Listar Episódios (Paginado)](#2-listar-episódios-paginado)
      - [3. Healthcheck](#3-healthcheck)
  - [Docker](#docker)
    - [Usando Docker Compose](#usando-docker-compose)
    - [Comandos Docker diretos](#comandos-docker-diretos)
  - [Comandos Make](#comandos-make)
  - [Autor](#autor)

## Descrição

API RESTful que consome a Rick and Morty API, oferecendo endpoints otimizados para buscar episódios com informações aninhadas de personagens e localizações.

## Tecnologias

- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Superset JavaScript com tipagem estática
- **RxJS** - Programação reativa com observables e streams
- **Axios** - Cliente HTTP para requisições
- **Class Validator** - Validação de DTOs
- **Class Transformer** - Transformação de objetos
- **Swagger** - Documentação automática da API
- **Docker** - Containerização
- **Husky** - Git hooks
- **Logger** - Sistema de telemetria simples

## Estrutura do Projeto

```
RNMSearch_backend/
├── src/
│   ├── app/
│   │   ├── controllers/           # Controllers HTTP
│   │   │   ├── health.ts         # Healthcheck endpoint
│   │   │   └── integration.controller.ts
│   │   ├── modules/              # Módulos NestJS
│   │   │   └── integration.module.ts
│   │   ├── schemas/              # DTOs e schemas
│   │   │   ├── requests/
│   │   │   │   └── integration.request.ts
│   │   │   └── responses/
│   │   │       └── integration.ts
│   │   └── services/             # Lógica de negócio
│   │       └── integration.service.ts
│   ├── infra/                    # Infraestrutura
│   │   ├── handlers/             # Error handlers
│   │   ├── open-api/             # Configuração Swagger
│   │   ├── env.config.ts         # Configuração de ambiente
│   │   ├── infra.module.ts
│   │   └── server.config.ts      # Configuração do servidor
│   ├── utils/                    # Utilitários
│   │   ├── constants/
│   │   ├── functions/
│   │   ├── mixin/
│   │   └── schemas/
│   ├── app.module.ts             # Módulo principal
│   └── main.ts                   # Entry point
├── test/                         # Testes E2E
├── docker-compose.yml            # Docker Compose
├── dockerfile                    # Dockerfile
├── makefile                      # Comandos Make
├── .env                          # Variáveis de ambiente
└── package.json
```

## Pré-requisitos

- **Node.js** >= 22.x
- **npm** >= 10.x
- **Docker** (opcional)
- **Docker Compose** (opcional)

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/leossb36/RNMSearch_backend.git
cd RNMSearch_backend

# Instalar dependências com Make
make build-env

# Ou com npm
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
# Service Configuration
SERVICE_TITLE="Rick and Morty Backend Service"
SERVICE_DESCRIPTION="Rick and Morty Backend Service"
SERVICE_VERSION="0.0.1"
SERVICE_TAG="rick-and-morty-api"

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
INTEGRATION_BASE_URL='https://rickandmortyapi.com/api'
```

## Executando a Aplicação

### Desenvolvimento

```bash
# Com Make
make dev

# Ou com npm
npm run start:dev
```

### Produção

```bash
# Build
make build

# Start
npm run start:prod
```

A API estará disponível em `http://localhost:3001`

## Endpoints da API

### Base URL

```
http://localhost:3001
```

### Documentação Swagger

Acesse `http://localhost:3001/api` para ver a documentação interativa completa.

### Endpoints Disponíveis

#### 1. Buscar Episódio Detalhado

Retorna um episódio com detalhes completos de personagens e localizações.

```http
GET /integrations/episode/:id
```

**Parâmetros:**

- `id` (path): ID do episódio (1-51)

**Exemplo de Requisição:**

```bash
curl -X GET http://localhost:3001/integrations/episode/1
```

**Exemplo de Resposta:**

```json
{
  "episode": {
    "id": 1,
    "name": "Pilot",
    "air_date": "December 2, 2013",
    "episode": "S01E01",
    "url": "https://rickandmortyapi.com/api/episode/1",
    "created": "2017-11-10T12:56:33.798Z"
  },
  "characters": [
    {
      "id": 1,
      "name": "Rick Sanchez",
      "status": "Alive",
      "species": "Human",
      "type": "",
      "gender": "Male",
      "origin": {
        "name": "Earth (C-137)",
        "url": "https://rickandmortyapi.com/api/location/1"
      },
      "location": {
        "name": "Citadel of Ricks",
        "url": "https://rickandmortyapi.com/api/location/3"
      },
      "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      "url": "https://rickandmortyapi.com/api/character/1",
      "created": "2017-11-04T18:48:46.250Z"
    }
  ],
  "locations": [
    {
      "id": 1,
      "name": "Earth (C-137)",
      "type": "Planet",
      "dimension": "Dimension C-137",
      "url": "https://rickandmortyapi.com/api/location/1",
      "created": "2017-11-10T12:42:04.162Z"
    }
  ]
}
```

#### 2. Listar Episódios (Paginado)

Retorna lista paginada de episódios.

```http
GET /integrations/episodes?page={page}&name={name}
```

**Parâmetros (Query):**

- `page` (opcional): Número da página (padrão: 1)
- `name` (opcional): Filtrar por nome do episódio

**Exemplo de Requisição:**

```bash
curl -X GET "http://localhost:3001/integrations/episodes?page=1&name=pilot"
```

**Exemplo de Resposta:**

```json
{
  "info": {
    "count": 51,
    "pages": 3,
    "next": "https://rickandmortyapi.com/api/episode?page=2",
    "prev": null
  },
  "results": [
    {
      "id": 1,
      "name": "Pilot",
      "air_date": "December 2, 2013",
      "episode": "S01E01",
      "url": "https://rickandmortyapi.com/api/episode/1",
      "created": "2017-11-10T12:56:33.798Z"
    }
  ]
}
```

#### 3. Healthcheck

Verifica se a API está operacional.

```http
GET /health
```

**Exemplo de Resposta:**

```json
{
  "status": "online"
}
```

## Docker

### Usando Docker Compose

```bash
# Subir containers
make docker-up

# Ver logs
make docker-logs

# Parar containers
make docker-down

# Rebuild e restart
make docker-restart
```

### Comandos Docker diretos

```bash
# Build
docker-compose build

# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f app
```

## Comandos Make

| Comando               | Descrição                                 |
| --------------------- | ----------------------------------------- |
| `make build-env`      | Instala dependências e configura ambiente |
| `make dev`            | Inicia servidor em modo desenvolvimento   |
| `make build`          | Compila o projeto                         |
| `make tests`          | Executa testes unitários                  |
| `make lint`           | Executa linter                            |
| `make format`         | Formata código                            |
| `make docker-up`      | Sobe containers Docker                    |
| `make docker-down`    | Para containers Docker                    |
| `make docker-logs`    | Mostra logs dos containers                |
| `make docker-build`   | Rebuild e inicia containers               |
| `make docker-restart` | Reinicia containers com rebuild           |
| `make clean`          | Remove node_modules e dist                |

## Autor

**Leonardo Barreiros**

- GitHub: [@leossb36](https://github.com/leossb36)
