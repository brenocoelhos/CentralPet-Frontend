// Esta rota é um alias de /busca. Redireciona para evitar duplicata.
import { Redirect } from "expo-router";

export default function ExploreScreen() {
  return <Redirect href="/busca" />;
}
