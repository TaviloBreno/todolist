import { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.spec.ts'], // Ajuste para corresponder à estrutura de arquivos do seu projeto
}

export default config
