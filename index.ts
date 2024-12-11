#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs-extra";
import path from "path";

const program = new Command();

program
  .name("unicli")
  .description(
    "CLI to generate files for frontend (Angular) and backend (.NET)"
  )
  .version("1.0.0");

// Generate Command
program
  .command("generate")
  .description("Generate files for a project")
  .option("-t, --type <type>", "Type of project (angular | dotnet)")
  .option("-n, --name <name>", "Name of the file/entity")
  .option(
    "-c, --context <context>",
    "Specific context (e.g., component, service)"
  )
  .action(
    async (options: { type?: string; name?: string; context?: string }) => {
      const { type, name, context } = options;

      if (!type || !name || !context) {
        console.error(
          "Error: Missing required options --type, --name, or --context."
        );
        process.exit(1);
      }

      // Define paths
      const templateBaseDir = path.join(__dirname, "..", "templates"); // Caminho relativo ao diretório raiz do projeto
      const templateDir = path.join(templateBaseDir, type || ""); // Tipo do projeto (angular | dotnet)
      const templatePath = path.join(templateDir, `${context}.template`);
      const outputDir = path.join(process.cwd(), `${type}-${context}s`);
      const outputPath = path.join(
        outputDir,
        `${name}.${type === "dotnet" ? "cs" : "ts"}`
      );

      // Check if template exists
      if (!fs.existsSync(templatePath)) {
        console.error(`Error: Template for context "${context}" not found.`);
        process.exit(1);
      }

      // Read and replace template
      const templateContent = await fs.readFile(templatePath, "utf-8");
      const fileContent = templateContent.replace(/\{Name\}/g, name);

      // Write file
      await fs.outputFile(outputPath, fileContent);
      console.log(`File generated: ${outputPath}`);
    }
  );

program.parse(process.argv);
