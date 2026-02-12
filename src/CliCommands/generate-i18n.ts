import { Command } from "commander";
import { generateI18nConstants } from "../i18n/gen-i18n-constants";

export function setupGenerateI18nCommand(program: Command) {
  program
    .command("i18n")
    .description("Generate i18n constants from a Transloco JSON file")
    .requiredOption("-j, --json <path>", "Path to transloco JSON file")
    .option("-p, --prefix <prefix>", "Base prefix (e.g., cadastros)")
    .option("-n, --name <name>", "Exported const name", "I18N_CADASTROS")
    .option("-o, --out <path>", "Output .ts file path", "i18n.constants.ts")
    .action(async (options) => {
      await generateI18nConstants({
        jsonPath: options.json,
        prefix: options.prefix,
        name: options.name,
        outPath: options.out,
      });
    });
}
