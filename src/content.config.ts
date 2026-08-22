import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({
    loader: docsLoader({
      generateId: ({ entry }) => {
        const path = entry
          .replace(/\\/g, "/")
          .replace(/\.(md|mdx)$/i, "")
          .replace(/(^|\/)index$/, "");
        return path ? `docs/${path}` : "docs";
      },
    }),
    schema: docsSchema(),
  }),
};
