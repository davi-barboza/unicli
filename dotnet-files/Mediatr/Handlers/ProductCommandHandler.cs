namespace DotNetMongoDb.Handlers;

public class ProductCommandHandler(IUnitOfWork unitOfWork) : 
    ICommandQueryHandler<CreateProductCommand>,
    ICommandQueryHandler<UpdateProductCommand>,
    ICommandQueryHandler<DeleteProductCommand>
{
    public async Task<Result> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var entity = request.ToEntity(); // Mapper
        await unitOfWork.ProductRepository.AddAsync(entity, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        var result = new Result(); // Custom result
        result.OK();
        return result;
    }
   
    public async Task<Result> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var existEntity = await unitOfWork.ProductRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new Exception("NotFound");

        var entity = request.ToEntity(existEntity); // Mapper
        await unitOfWork.ProductRepository.UpdateAsync(entity, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        var result = new Result(); // Custom result
        result.OK();
        return result;
    }

    public async Task<Result> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var existEntity = await unitOfWork.ProductRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new Exception("Not found");

        await unitOfWork.ProductRepository.DeleteAsync(existEntity, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        var result = new Result(); // Custom result
        result.OK();
        return result;
    }
}
