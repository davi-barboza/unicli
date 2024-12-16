using DotNetMongoDb.Features;
using DotNetMongoDb.Dtos;

namespace DotNetMongoDb.Queries;

public record GetAllProductQuery(
    ) : ICommandQuery<IReadOnlyList<ProductDto>>;
