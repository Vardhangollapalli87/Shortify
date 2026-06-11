import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const server = {};

  if (env.VITE_DEV_SERVER_HOST) {
    server.host = env.VITE_DEV_SERVER_HOST;
  }

  if (env.VITE_DEV_SERVER_PORT) {
    server.port = Number(env.VITE_DEV_SERVER_PORT);
  }

  return {
    plugins: [react()],
    server
  };
});
