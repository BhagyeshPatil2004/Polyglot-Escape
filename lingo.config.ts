import { defineConfig } from "@lingohq/cli";

export default defineConfig({
    projectId: "polyglot-escape",
    sourceLocale: "en",
    targetLocales: ["ja", "ar", "de", "ko", "ru", "fr", "hi", "es", "pt", "zh"],
    files: [
        {
            include: ["src/locales/[locale].json"],
            format: "json/nested",
        },
    ],
});
