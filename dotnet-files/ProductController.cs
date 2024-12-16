using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using DotNetMongoDb.Features;
using DotNetMongoDb.ViewModels;
using DotNetMongoDb.Commands;
using DotNetMongoDb.Queries;
using DotNetMongoDb.Dtos;

namespace DotNetMongoDb.Controllers;

[SwaggerTag("Product Service")]
public class ProductController(IMediator mediator) : ControllerBase
{
    [HttpGet("{id}")]
    [SwaggerOperation("Get By Id")]
    [SwaggerResponse(StatusCodes.Status200OK, "Retrieved", typeof(ProductViewModel))]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Not Found", typeof(void))]
    public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetProductByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpGet]
    [SwaggerOperation("Get All")]
    [SwaggerResponse(StatusCodes.Status200OK, "Retrieved", typeof(List<ProductViewModel>))]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetAllProductsQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    [SwaggerOperation("Create")]
    [SwaggerResponse(StatusCodes.Status200OK, "Created", typeof(void))]
    [SwaggerResponse(StatusCodes.Status400BadRequest, "Validation Error Occured", typeof(void))]
    [SwaggerResponse(StatusCodes.Status401Unauthorized, "Unauthorized", typeof(void))]
    public async Task<IActionResult> Create(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(request, cancellationToken);
        return Ok(result);
    }

    [HttpPut]
    [Authorize]
    [SwaggerOperation("Update")]
    [SwaggerResponse(StatusCodes.Status200OK, "Updated", typeof(void))]
    [SwaggerResponse(StatusCodes.Status400BadRequest, "Validation Error Occured", typeof(void))]
    [SwaggerResponse(StatusCodes.Status401Unauthorized, "Unauthorized", typeof(void))]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Not Found", typeof(void))]
    public async Task<IActionResult> Update(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(request, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "CanDeletePolicy")]
    [SwaggerOperation("Delete")]
    [SwaggerResponse(StatusCodes.Status200OK, "Deleted", typeof(void))]
    [SwaggerResponse(StatusCodes.Status400BadRequest, "Validation Error Occured", typeof(void))]
    [SwaggerResponse(StatusCodes.Status401Unauthorized, "Unauthorized", typeof(void))]
    [SwaggerResponse(StatusCodes.Status403Forbidden, "Access Denied", typeof(void))]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Not Found", typeof(void))]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new DeleteProductCommand(id), cancellationToken);
        return Ok(result);
    }
}
