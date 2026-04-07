export function getFirebaseAuthErrorMessage(error: unknown) {
  const code =
    typeof error === "object" &&
    error &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : "";

  switch (code) {
    case "auth/invalid-email":
      return "O e-mail informado e invalido.";
    case "auth/missing-password":
      return "Informe a senha para continuar.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-mail ou senha invalidos.";
    case "auth/email-already-in-use":
      return "Ja existe uma conta cadastrada com este e-mail.";
    case "auth/weak-password":
      return "A senha deve ter no minimo 6 caracteres.";
    case "auth/too-many-requests":
      return "Muitas tentativas seguidas. Tente novamente em instantes.";
    case "auth/network-request-failed":
      return "Falha de rede. Verifique sua conexao e tente novamente.";
    default:
      return "Nao foi possivel concluir a autenticacao agora.";
  }
}
