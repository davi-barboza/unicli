export const CONSTANTS_DOTNET = {
  Default: {
    Dto: ["dtos/{name}Dto.template"],
    Entity: ["entities/{name}Entity.template"],
    Repository: [
      "repositories/implementations/{name}Repository.template",
      "repositories/interfaces/I{name}Repository.template",
    ],
    Controller: ["{name}Controller.template"],
    Mapper: ["{name}Mapper.template"],
    FluentApiConfiguration: ["{name}Configuration.template"],
    Commands: [
      "mediatr/commands/Create{name}Command.template",
      "mediatr/commands/Update{name}Command.template",
      "mediatr/commands/Delete{name}Command.template",
    ],
    Queries: [
      "mediatr/queries/Get{name}ByIdQuery.template",
      "mediatr/queries/GetAll{name}Query.template",
    ],
    Validators: [
      "mediatr/validators/Create{name}Validator.template",
      "mediatr/validators/Update{name}Validator.template",
    ],
    Handlers: [
      "mediatr/handlers/{name}CommandHandler.template",
      "mediatr/handlers/{name}QueryHandler.template",
    ],
    Graphql: [
      "graphql/dataloaders/{name}Dataloader.template",
      "graphql/mutations/{name}Mutation.template",
      "graphql/queries/{name}Query.template",
      "graphql/resolvers/{name}Resolver.template",
      "graphql/types/{name}Type.template",
    ],
  },
  Generic: {
    Dto: ["dtos/EntityDto.template", "dtos/TrackableEntityDto.template"],
    Entity: ["entities/Entity.template", "entities/TrackableEntity.template"],
    Repository: [
      "repositories/implementations/ReadOnlyRepository.template",
      "repositories/implementations/Repository.template",
      "repositories/implementations/RepositoryProperties.template",
      "repositories/implementations/UnitOfWork.template",
      "repositories/interfaces/I{project}UnitOfWork.template",
      "repositories/interfaces/IReadOnlyRepository.template",
      "repositories/interfaces/IRepository.template",
      "repositories/interfaces/IUnitOfWork.template",
    ],
    Mediatr: [
      "mediatr/generics/ICommandQuery.template",
      "mediatr/generics/ICommandQueryHandler.template",
      "mediatr/generics/result.template",
      "ValidationBehaviour.template",
    ],
  },
  Program: "program.template",
};

export const CONSTANTS_REACT = {
  Default: {
    Graphql: [
      "graphql/fragments/{name}.fragment.graphql",
      "graphql/mutations/{name}.mutation.graphql",
      "graphql/queries/{name}.query.graphql",
    ],
  },
};

export const TemplateTypes = {
  REPOSITORY: "Repository",
  DTO: "Dto",
  ENTITY: "Entity",
  CONTROLLER: "Controller",
  MAPPER: "Mapper",
  FLUENTAPI_CONFIGURATION: "Configuration",
  CQRS: "Cqrs",
  GRAPHQL: "Graphql",
} as const;
