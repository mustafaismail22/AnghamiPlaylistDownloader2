import reactRefresh from "@vitejs/plugin-react-refresh";
import { join } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build: {
    outDir: join("..", "..", "dist", "renderer"),
  },
  server: {
    port: 1234,
  },
  plugins: [reactRefresh()],
});
