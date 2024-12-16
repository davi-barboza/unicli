#!/usr/bin/env node

import { Command } from "commander";
import { setupGenerateCommand } from "./CliCommands/generate";

const program = new Command();

program
  .name("unicli")
  .description("Universal CLI to generate files")
  .version("1.0.0");

// Configura os comandos
setupGenerateCommand(program);

program.parse(process.argv);
