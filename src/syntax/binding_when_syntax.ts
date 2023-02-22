import { interfaces } from '../interfaces/interfaces';
import { BindingOnSyntax } from './binding_on_syntax';
import { namedConstraint, taggedConstraint, traverseAncerstors, typeConstraint } from './constraint_helpers';
import type { Request } from '../planning/request'

class BindingWhenSyntax<T>  {

  private _binding: interfaces.Binding<T>;

  public constructor(binding: interfaces.Binding<T>) {
    this._binding = binding;
  }

  public when(constraint: (request: Request) => boolean) {
    this._binding.constraint = constraint as interfaces.ConstraintFunction;
    return new BindingOnSyntax<T>();
  }

  public whenTargetNamed(name: string | number | symbol) {
    this._binding.constraint = namedConstraint(name);
    return new BindingOnSyntax<T>();
  }

  public whenTargetIsDefault() {

    this._binding.constraint = (request: Request | null) => {

      if (request === null) {
        return false;
      }

      const targetIsDefault = (request.target !== null) &&
        (!request.target.isNamed()) &&
        (!request.target.isTagged());

      return targetIsDefault;
    };

    return new BindingOnSyntax<T>();
  }

  public whenTargetTagged(tag: string | number | symbol, value: unknown) {
    this._binding.constraint = taggedConstraint(tag)(value);
    return new BindingOnSyntax<T>();
  }

  public whenInjectedInto(parent: (NewableFunction | string)) {
    this._binding.constraint = (request: Request | null) =>
      request !== null && typeConstraint(parent)(request.parentRequest);

    return new BindingOnSyntax<T>();
  }

  public whenParentNamed(name: string | number | symbol) {
    this._binding.constraint = (request: Request | null) =>
      request !== null && namedConstraint(name)(request.parentRequest);

    return new BindingOnSyntax<T>();
  }

  public whenParentTagged(tag: string | number | symbol, value: unknown) {
    this._binding.constraint = (request: Request | null) =>
      request !== null && taggedConstraint(tag)(value)(request.parentRequest);

    return new BindingOnSyntax<T>();
  }

  public whenAnyAncestorIs(ancestor: (NewableFunction | string)) {
    this._binding.constraint = (request: Request | null) =>
      request !== null && traverseAncerstors(request, typeConstraint(ancestor));

    return new BindingOnSyntax<T>();
  }

  public whenNoAncestorIs(ancestor: (NewableFunction | string)) {
    this._binding.constraint = (request: Request | null) =>
      request !== null && !traverseAncerstors(request, typeConstraint(ancestor));

    return new BindingOnSyntax<T>();
  }

  public whenAnyAncestorNamed(name: string | number | symbol) {

    this._binding.constraint = (request: Request | null) =>
      request !== null && traverseAncerstors(request, namedConstraint(name));

    return new BindingOnSyntax<T>();
  }

  public whenNoAncestorNamed(name: string | number | symbol) {

    this._binding.constraint = (request: Request | null) =>
      request !== null && !traverseAncerstors(request, namedConstraint(name));

    return new BindingOnSyntax<T>();
  }

  public whenAnyAncestorTagged(tag: string | number | symbol, value: unknown) {

    this._binding.constraint = (request: Request | null) =>
      request !== null && traverseAncerstors(request, taggedConstraint(tag)(value));

    return new BindingOnSyntax<T>();
  }

  public whenNoAncestorTagged(tag: string | number | symbol, value: unknown) {

    this._binding.constraint = (request: Request | null) =>
      request !== null && !traverseAncerstors(request, taggedConstraint(tag)(value));

    return new BindingOnSyntax<T>();
  }

  public whenAnyAncestorMatches(constraint: (request: Request) => boolean) {

    this._binding.constraint = (request: Request | null) =>
      request !== null && traverseAncerstors(request, constraint as interfaces.ConstraintFunction);

    return new BindingOnSyntax<T>();
  }

  public whenNoAncestorMatches(constraint: (request: Request) => boolean) {

    this._binding.constraint = (request: Request | null) =>
      request !== null && !traverseAncerstors(request, constraint as interfaces.ConstraintFunction);

    return new BindingOnSyntax<T>();
  }

}

export { BindingWhenSyntax };
