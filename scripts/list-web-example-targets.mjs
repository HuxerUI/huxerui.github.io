import { loadSourceConfig } from "./source-config.mjs";

const config = await loadSourceConfig();
process.stdout.write(config.webExamples.map((slug) => `example_${slug}`).join(" "));
