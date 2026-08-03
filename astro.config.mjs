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

  image: {
    // Default any <Image> without explicit widths to a responsive srcset.
    // responsiveStyles is left off (the default) because the image components
    // set object-fit and max-height themselves with Tailwind classes.
    layout: "constrained",
    breakpoints: [500, 736, 1000, 1472],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
