import fs from "fs-extra";
import path from "path";
import {
  CONSTANTS_DOTNET,
  CONSTANTS_REACT,
  TemplateTypes,
} from "./Domain/constants";
import { capitalizeFirstLetter } from "./utils/String.util";

type TOptions = {
  type: string;
  cqrs: boolean;
  full: boolean;
  repository: boolean;
  dto: boolean;
  entity: boolean;
  controller: boolean;
  name: string;
  project: string;
  mapper: string;
  fluentApiConfiguration: string;
  graphql: string;
};

export const generateFiles = async (options: TOptions) => {
  const { type, cqrs, full } = options;

  // Validação
  validateOptions(options);

  const templateBaseDir = path.join(__dirname, "..", "src", "Templates", type);
  const outputBaseDir = path.join(process.cwd(), `${type}-files`);

  // Mapear quais arquivos devem ser gerados
  const fileGenerators = [
    { condition: options.repository, type: TemplateTypes.REPOSITORY },
    { condition: options.dto, type: TemplateTypes.DTO },
    { condition: options.entity, type: TemplateTypes.ENTITY },
    { condition: options.controller, type: TemplateTypes.CONTROLLER },
    { condition: options.mapper, type: TemplateTypes.MAPPER },
    { condition: options.graphql, type: TemplateTypes.GRAPHQL },
    {
      condition: options.fluentApiConfiguration,
      type: TemplateTypes.FLUENTAPI_CONFIGURATION,
    },
    { condition: cqrs, type: TemplateTypes.CQRS },
  ].filter((generator) => generator.condition);

  for (const generator of fileGenerators) {
    await generateTemplate(
      templateBaseDir,
      outputBaseDir,
      generator.type,
      options,
      full
    );
  }
};

const validateOptions = (options: TOptions) => {
  const { type, name } = options;
  if (!type || !name) {
    console.error(
      "Error: Missing required options --type, --name, or --project."
    );
    process.exit(1);
  }
};

const generateTemplate = async (
  templateBaseDir: string,
  outputBaseDir: string,
  templateType: string,
  options: TOptions,
  full: boolean
) => {
  const templatesMap: { [key: string]: string[] | undefined } = {
    [TemplateTypes.REPOSITORY]: CONSTANTS_DOTNET.Default.Repository,
    [TemplateTypes.DTO]: CONSTANTS_DOTNET.Default.Dto,
    [TemplateTypes.ENTITY]: CONSTANTS_DOTNET.Default.Entity,
    [TemplateTypes.CONTROLLER]: CONSTANTS_DOTNET.Default.Controller,
    [TemplateTypes.MAPPER]: CONSTANTS_DOTNET.Default.Mapper,

    [TemplateTypes.FLUENTAPI_CONFIGURATION]:
      CONSTANTS_DOTNET.Default.FluentApiConfiguration,

    [TemplateTypes.GRAPHQL]:
      options.type === "react"
        ? CONSTANTS_REACT.Default.Graphql
        : CONSTANTS_DOTNET.Default.Graphql,

    [TemplateTypes.CQRS]: [
      ...CONSTANTS_DOTNET.Default.Commands,
      ...CONSTANTS_DOTNET.Default.Queries,
      ...CONSTANTS_DOTNET.Default.Validators,
      ...CONSTANTS_DOTNET.Default.Handlers,
    ],
  };

  const genericMap: { [key: string]: string[] | undefined } = {
    [TemplateTypes.REPOSITORY]: CONSTANTS_DOTNET.Generic.Repository,
    [TemplateTypes.DTO]: CONSTANTS_DOTNET.Generic.Dto,
    [TemplateTypes.ENTITY]: CONSTANTS_DOTNET.Generic.Entity,
    [TemplateTypes.CQRS]: [
      ...CONSTANTS_DOTNET.Generic.Mediatr,
      CONSTANTS_DOTNET.Program,
    ],
  };

  if (templateType === TemplateTypes.CQRS && full) {
    // Combina todos os arrays de genericMap, exceto CQRS, em um único array
    const combinedTemplateArray: string[] = Object.values(templatesMap)
      .filter(Array.isArray) // Exclui CQRS e garante que é um array
      .flat(); // Achata os arrays diretamente

    // Combina todos os arrays de genericMap, exceto CQRS, em um único array
    const combinedGenericArray: string[] = Object.values(genericMap)
      .filter(Array.isArray) // Exclui CQRS e garante que é um array
      .flat(); // Achata os arrays diretamente

    await processFiles(
      [...combinedTemplateArray, ...combinedGenericArray],
      templateBaseDir,
      outputBaseDir,
      options
    );

    return;
  }

  // Obter e processar arquivos padrão
  const defaultFiles = templatesMap[templateType];
  if (defaultFiles) {
    await processFiles(defaultFiles, templateBaseDir, outputBaseDir, options);
  }

  // Obter e processar arquivos genéricos, caso a opção `full` esteja habilitada
  if (full) {
    const genericFiles = genericMap[templateType];
    if (genericFiles)
      await processFiles(genericFiles, templateBaseDir, outputBaseDir, options);
  }
};

const processFiles = async (
  filesPaths: string[],
  templateBaseDir: string,
  outputDir: string,
  options: TOptions
) => {
  for (const filePath of filesPaths) {
    const templatePath = path.join(templateBaseDir, ...filePath.split("/"));
    if (!fs.existsSync(templatePath)) {
      console.error(
        `Error: Missing template for "${filePath}". Path => ${templatePath}`
      );
      continue;
    }

    const outputPath = buildOutputPath(filePath, outputDir, options);
    const templateContent = await fs.readFile(templatePath, "utf-8");

    const replacedContent = templateContent
      .replace(/\{name\}/g, capitalizeFirstLetter(options.name))
      .replace(/\{project\}/g, options.project);

    await fs.outputFile(outputPath, replacedContent);
    console.log(`File generated: ${outputPath}`);
  }
};

const buildOutputPath = (
  filePath: string,
  outputDir: string,
  options: TOptions
): string => {
  const splitPath = filePath.split("/");
  const directory = splitPath.slice(0, -1).map((p) => capitalizeFirstLetter(p));

  const replacedFileName =
    splitPath
      .at(-1)
      ?.replace(
        /\{name\}/g,
        options.type === "react" && options.graphql
          ? options.name
          : capitalizeFirstLetter(options.name)
      )
      .replace(/\{project\}/g, options.project)
      .replace(/template/g, "cs") ?? "";

  return path.join(
    outputDir,
    ...directory,
    options.type === "react" && options.graphql
      ? replacedFileName
      : capitalizeFirstLetter(replacedFileName)
  );
};
