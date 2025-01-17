import { AuthConfig } from "@ioc:Adonis/Addons/Auth";

const authConfig: AuthConfig = {
  guard: "api",
  guards: {
    api: {
      driver: "oat", // Usar OAuth tokens
      tokenProvider: {
        type: "api",
        driver: "database",
      },
      provider: {
        driver: "lucid",
        identifierKey: "id",
        uids: ["email"], // Identificar usuário pelo email
        model: () => import("App/Models/User"), // Modelo do usuário
      },
    },
  },
};

export default authConfig;
