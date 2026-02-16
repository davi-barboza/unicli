import { Command } from "commander";
import { generateI18nFullPathConstants } from "../i18n/gen-i18n-full-constants";

export function setupGenerateI18nFullCommand(program: Command) {
  program
    .command("i18n-full")
    .description("Generate i18n constants with FULL key path (module + nested path)")
    .requiredOption("-j, --json <path>", "Path to transloco JSON file")
    .option("-p, --prefix <prefix>", "Base prefix (e.g., cadastros)")
    .option("-n, --name <name>", "Exported const name", "I18N_FULL")
    .option("-o, --out <path>", "Output .ts file path", "i18n.full.constants.ts")
    .action(async (options) => {
      await generateI18nFullPathConstants({
        jsonPath: options.json,
        prefix: options.prefix,
        name: options.name,
        outPath: options.out,
      });
    });
}
