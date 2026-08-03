// @ts-check
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://nichaley.com",

  // Match the URL shape the Next build produced: no trailing slashes.
  trailingSlash: "never",

  integrations: [mdx()],

  vite: {
    plugins: [tailwindcss()],
  },
});
