import TelaCadastroUsuario from '@/components/auth/tela-cadastro-usuario';
import EstruturaApp from "@/components/layout/estrutura-app";

export default function UserSignupRoute() {
  return (
    <EstruturaApp>
      <TelaCadastroUsuario />
    </EstruturaApp>
  );
}