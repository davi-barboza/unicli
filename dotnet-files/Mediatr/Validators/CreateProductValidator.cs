using FluentValidation;

namespace DotNetMongoDb.Validators;

public class CreateProductValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Description).MinimumLength(2).WithMessage("Description Length Over 2");
    }
}
