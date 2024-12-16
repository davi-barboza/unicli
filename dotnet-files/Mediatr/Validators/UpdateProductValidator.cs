using FluentValidation;

namespace DotNetMongoDb.Validators;

public class UpdateProductValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductValidator()
    {
        RuleFor(x => x.Description).MinimumLength(2).WithMessage("Description Length Over 2");
    }
}
