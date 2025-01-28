import { Command } from "commander";
import { generateFiles } from "../files-gen";

export function setupGenerateCommand(program: Command) {
  program
    .command("g")
    .description("Generate files for a project")
    .option("-t, --type <type>", "Type of project (e.g., dotnet)")
    .option("-p, --project <project>", "Project of file")
    .option("-n, --name <name>", "Name of the file/entity")
    .option("-r, --repository", "Generate repository")
    .option("-d, --dto", "Generate dto")
    .option("-e, --entity", "Generate entity")
    .option("-c, --controller", "Generate controller")
    .option("-cqrs, --cqrs", "Generate CQRS files")
    .option("-m, --mapper", "Generate Mapper")
    .option("-fc, --fluentApiConfiguration", "Generate fluentApi configuration")
    .option("-gql, --graphql", "Generate graphql files")
    .option("-f, --full", "Generate full files")
    .action(async (options) => {
      await generateFiles(options);
    });
}
