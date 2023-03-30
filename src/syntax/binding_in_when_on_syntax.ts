import { interfaces } from '../interfaces/interfaces';
import { BindingInSyntax } from './binding_in_syntax';

class BindingInWhenOnSyntax<T>  {

  private _bindingInSyntax: BindingInSyntax<T>;

  public constructor(binding: interfaces.Binding<T>) {
    this._bindingInSyntax = new BindingInSyntax<T>(binding);
  }

  public inSingletonScope() {
    return this._bindingInSyntax.inSingletonScope();
  }


}

export { BindingInWhenOnSyntax };
