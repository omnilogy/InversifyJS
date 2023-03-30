import { BindingScopeEnum } from '../constants/literal_types';
import { interfaces } from '../interfaces/interfaces';

class BindingInSyntax<T> {

  private _binding: interfaces.Binding<T>;

  public constructor(binding: interfaces.Binding<T>) {
    this._binding = binding;
  }

  public inSingletonScope() {
    this._binding.scope = BindingScopeEnum.Singleton;
  }

}

export { BindingInSyntax };
