// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import process from "node:process";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react(), sitemap()],
  server: { port: 3000 },
  vite: {
    plugins: [tailwindcss()],
    envPrefix: ["VITE_", "PUBLIC_", "ASTRO_", "NODE_", "TEST_"],
    define: {
      "import.meta.env.TEST_USER_TOKEN": JSON.stringify(process.env.TEST_USER_TOKEN),
      "import.meta.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    },
  },
  adapter: node({
    mode: "standalone",
  }),
  experimental: { session: true },
});
