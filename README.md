# CentralPet Frontend

Frontend mobile/web do projeto CentralPet, desenvolvido com Expo, React Native e Expo Router.

## Stack

- Expo SDK 55
- React 19
- React Native 0.83
- Expo Router
- Firebase Authentication
- TypeScript

## Funcionalidades

- Login de usuario
- Cadastro de usuario
- Navegacao entre telas com Expo Router
- Cadastro de pet com validacoes
- Upload de varias fotos no cadastro de pet
- Exigencia de login para cadastrar animal
- Perfil de usuario
- Tela de busca e detalhes do pet

## Estrutura principal

```text
src/
	app/                  Rotas da aplicacao
	components/           Componentes reutilizaveis e telas compostas
	context/              Contextos globais, incluindo autenticacao
	hooks/                Hooks customizados
	lib/                  Integracoes com Firebase
	utils/                Validacoes e utilitarios
	constants/            Tema e constantes visuais
```

## Rotas atuais

- `/` - tela inicial
- `/login` - login
- `/cadastro-usuario` - cadastro de usuario
- `/dashboard` - painel principal
- `/busca` - busca de pets
- `/cadastro-pet` - cadastro de animal
- `/pet-detail` - detalhe do pet
- `/perfil` - perfil do usuario

## Requisitos

- Node.js 20 ou superior recomendado
- npm
- Expo CLI via `npx`

## Instalacao

```bash
npm install
```

## Executando o projeto

```bash
npm run start
```

Comandos uteis:

```bash
npm run android
npm run ios
npm run web
npm run lint
```

## Variaveis de ambiente

Copie o arquivo `.env.example` para `.env` e preencha os valores do seu projeto:

Importante:

- Nao commite valores reais do arquivo `.env`.
- Variaveis com prefixo `EXPO_PUBLIC_` ficam expostas no app cliente.
- Nao use `EXPO_PUBLIC_*` para armazenar segredos de backend, chaves privadas ou client secrets.

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
```

Depois de alterar o `.env`, reinicie o bundler com cache limpo:

```bash
npx expo start -c
```

## Firebase

O projeto usa Firebase Authentication.

Configuracoes utilizadas:

- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

Se alguma dessas variaveis nao estiver definida, a inicializacao do Firebase fica incompleta.

## Login com Google

Para habilitar login com Google:

1. Ative o provedor Google no Firebase Authentication.
2. Crie os Client IDs necessarios no Google Cloud Console.
3. Preencha as variaveis `EXPO_PUBLIC_GOOGLE_*` no `.env`.
4. Reinicie o projeto com `npx expo start -c`.

## Regras atuais do cadastro de pet

- O usuario precisa estar logado para cadastrar um animal.
- O cadastro exige no minimo 2 fotos.
- Campos obrigatorios:
	- Nome
	- Especie
	- Raca
	- Data do desaparecimento
	- Local do desaparecimento
	- Seu nome
	- Telefone

## Padrao de organizacao

- As rotas ficam em `src/app`
- As telas compostas ficam em `src/components`
- O contexto de autenticacao fica em `src/context/auth-context.tsx`
- A configuracao do Firebase fica em `src/lib/firebaseConfig.ts`

## Observacoes

- O projeto usa `expo-image-picker` para selecao de fotos.
- O projeto usa `expo-image` para exibicao das imagens.
- As fontes sao carregadas com `@expo-google-fonts/lexend`.

## Melhorias futuras sugeridas

- Persistencia real do cadastro de pets em backend
- Upload de imagens para Firebase Storage
- Protecao de rota para bloquear acesso a telas autenticadas
- Feedback visual inline em campos invalidos
- Testes de interface e fluxos principais
