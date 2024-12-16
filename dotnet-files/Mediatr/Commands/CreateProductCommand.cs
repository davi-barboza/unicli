namespace DotNetMongoDb.Commands;

public record CreateProductCommand(
    string Description,
    ) : ICommandQuery;