// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react(), sitemap()],
  server: { port: 3000 },
  vite: {
    plugins: [tailwindcss()],
    envPrefix: ["VITE_", "PUBLIC_", "ASTRO_"],
    define: {
      "import.meta.env.TEST_USER_TOKEN": JSON.stringify(process.env.TEST_USER_TOKEN),
    },
  },
  adapter: node({
    mode: "standalone",
  }),
  experimental: { session: true },
});
