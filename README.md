# CentralPet-Frontend

Frontend do projeto CentralPet construido com Expo Router e React Native.

## Firebase Auth

1. Copie `.env.example` para `.env`.
2. Preencha as variaveis `EXPO_PUBLIC_FIREBASE_*` com os dados do seu projeto Firebase.
3. Ative o provedor Email/Password no console do Firebase.
4. Reinicie o bundler com `npx expo start -c` depois de alterar as variaveis de ambiente.

## Login com Google (Expo)

1. Instale as dependencias:
	`npx expo install expo-auth-session expo-web-browser`
2. No Firebase Console, ative o provedor Google em Authentication.
3. No Google Cloud Console, crie os Client IDs OAuth necessarios:
	- Web (usado pelo Firebase)
	- Android (usado no Expo)
	- iOS (usado no Expo)
4. Preencha as variaveis no `.env`:
	- `EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID`
	- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
	- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
	- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
5. Reinicie o app com cache limpo:
	`npx expo start -c`
