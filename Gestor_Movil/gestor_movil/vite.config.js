import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { URL_SUBPATH } from "./src/config/Constantes";

// https://vite.dev/config/
export default defineConfig({
  base: URL_SUBPATH + "/",
  plugins: [react()],
});
