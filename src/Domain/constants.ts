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

export const TemplateTypes = {
  REPOSITORY: "Repository",
  DTO: "Dto",
  ENTITY: "Entity",
  CONTROLLER: "Controller",
  CQRS: "Cqrs",
} as const;
