#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import { capitalizeFirstLetter } from "./utils/String.util";

type TOptions = {
  type?: string;
  name?: string;
  context?: string;
  namespace: string;
  cqrs: string;
};

const program = new Command();

program
  .name("unicli")
  .description("Universal CLI to generate files")
  .version("1.0.0");

// Generate Command
program
  .command("generate")
  .description("Generate files for a project")
  .option("-t, --type <type>", "Type of project (angular | dotnet)")
  .option("-cqrs, --cqrs <cqrs>", "Generate complete CQRS files")
  .option("-n, --name <name>", "Name of the file/entity")
  .option("-np, --namespace <namespace>", "Namespace of file")
  .option(
    "-c, --context <context>",
    "Specific context (e.g., component, service)"
  )
  .action(async (options: TOptions) => {
    const { type, name, context, namespace, cqrs } = options;

    if (!type || !name || !context || !namespace) {
      console.error(
        "Error: Missing required options --type, --name, or --context."
      );
      process.exit(1);
    }

    // Define paths
    const templateBaseDir = path.join(__dirname, "..", "src", "templates"); // Caminho relativo ao diretório raiz do projeto
    const templateDir = path.join(templateBaseDir, type || ""); // Tipo do projeto (angular | dotnet)
    const templatePath = path.join(templateDir, `${context}.template`);
    const outputDir = path.join(process.cwd(), `${type}-${context}s`);
    const outputPath = path.join(
      outputDir,
      `${capitalizeFirstLetter(name)}.${type === "dotnet" ? "cs" : "ts"}`
    );

    // Check if template exists
    if (!fs.existsSync(templatePath)) {
      console.error(
        `Error: Template for context "${context}" not found. Path => ${templatePath}`
      );
      process.exit(1);
    }

    // Read and replace template
    const templateContent = await fs.readFile(templatePath, "utf-8");
    const fileContent = templateContent
      .replace(/\{name\}/g, capitalizeFirstLetter(name))
      .replace(/\{namespace\}/g, namespace);

    // Write file
    await fs.outputFile(outputPath, fileContent);
    console.log(`File generated: ${outputPath}`);
  });

program.parse(process.argv);
