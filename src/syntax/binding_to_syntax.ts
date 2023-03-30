import * as ERROR_MSGS from "../constants/error_msgs";
import { BindingScopeEnum, BindingTypeEnum } from "../constants/literal_types";
import { interfaces } from "../interfaces/interfaces";
import { BindingInWhenOnSyntax } from "./binding_in_when_on_syntax";
import { BindingWhenOnSyntax } from "./binding_when_on_syntax";

class BindingToSyntax<T> {

  // TODO: Implement an internal type `_BindingToSyntax<T>` wherein this member
  // can be public. Let `BindingToSyntax<T>` be the presentational type that
  // depends on it, and does not expose this member as public.
  private _binding: interfaces.Binding<T>;

  public constructor(binding: interfaces.Binding<T>) {
    this._binding = binding;
  }

  public to(constructor: interfaces.Newable<T>) {
    this._binding.type = BindingTypeEnum.Instance;
    this._binding.implementationType = constructor;
    return new BindingInWhenOnSyntax<T>(this._binding);
  }

  public toSelf() {
    if (typeof this._binding.serviceIdentifier !== "function") {
      throw new Error(`${ERROR_MSGS.INVALID_TO_SELF_VALUE}`);
    }
    const self = this._binding.serviceIdentifier;
    return this.to(self);
  }

  public toConstantValue(value: T) {
    this._binding.type = BindingTypeEnum.ConstantValue;
    this._binding.cache = value;
    this._binding.dynamicValue = null;
    this._binding.implementationType = null;
    this._binding.scope = BindingScopeEnum.Singleton;
    return new BindingWhenOnSyntax<T>();
  }

}

export { BindingToSyntax };
