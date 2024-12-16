namespace DotNetMongoDb.Commands;

public record UpdateProductCommand(
    Guid Id,
    string Description,
    ) : ICommandQuery;