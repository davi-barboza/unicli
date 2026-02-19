import { Command } from "commander";
import { generateI18n } from "../i18n/gen-i18n";

export function setupGenerateI18nCommand(program: Command) {
  program
    .command("i18n")
    .description("Generate i18n constants with FULL key path (module + nested path)")
    .requiredOption("-j, --json <path>", "Path to transloco JSON file")
    .requiredOption("-o, --out <path>", "Output .ts file path")
    .action(async (options) => {
      await generateI18n({
        jsonPath: options.json,
        outPath: options.out,
      });
    });
}
