using DotNetMongoDb.Features;
using DotNetMongoDb.Dtos;

namespace DotNetMongoDb.Queries;

public record GetProductByIdQuery(
    Guid Id
    ) : ICommandQuery<ProductDto>;
