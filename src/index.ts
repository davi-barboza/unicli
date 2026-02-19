#!/usr/bin/env node

import { Command } from "commander";
import { setupGenerateCommand } from "./CliCommands/generate";
import { setupGenerateI18nCommand } from "./CliCommands/generate-i18n";

const program = new Command();

program
  .name("unicli")
  .description("Universal CLI to generate files")
  .version("1.0.0");

// Configura os comandos
setupGenerateCommand(program);
setupGenerateI18nCommand(program);

program.parse(process.argv);
