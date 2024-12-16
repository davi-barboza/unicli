namespace DotNetMongoDb.Commands;

public record DeleteProductCommand(
    Guid Id
    ) : ICommandQuery;