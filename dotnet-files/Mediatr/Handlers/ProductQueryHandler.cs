using DotNetMongoDb.Features;
using DotNetMongoDb.Dtos;
using DotNetMongoDb.Interfaces;

namespace DotNetMongoDb.Queries;

public class GetProductByIdQueryHandler(IDotNetMongoDbUnitOfWork unitOfWork) : 
    ICommandQueryHandler<GetProductByIdQuery, ProductDto>,
    ICommandQueryHandler<GetAllProductQuery, IReadOnlyList<ProductDto>>
{
    public async Task<Result<ProductDto>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var existEntity = await unitOfWork.ProductRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new Exception("Not Found");

        var dto = existEntity.ToDto(); // Mapper

        var result = new Result<ProductDto>();
        result.AddValue(dto);
        result.OK();
        return result;
    }

    public async Task<Result<IReadOnlyList<ProductDto>>> Handle(GetAllProductQuery request, CancellationToken cancellationToken)
    {
        var entities = await unitOfWork.ProductRepository.GetAllAsync(cancellationToken);
        var dtos = entities.ToDto();

        var result = new Result<IReadOnlyList<ProductDto>>();
        result.AddValue(dtos);
        result.OK();
        return result;
    }
}