import { Binding } from '../bindings/binding';
import { BindingScopeEnum, TargetTypeEnum } from '../constants/literal_types';
import { interfaces } from '../interfaces/interfaces';
import { MetadataReader } from '../planning/metadata_reader';
import { plan } from '../planning/planner';
import { resolve } from '../resolution/resolver';
import { BindingToSyntax } from '../syntax/binding_to_syntax';
import { id } from '../utils/id';
import { Lookup } from './lookup';

type GetArgs<T> = Omit<interfaces.NextArgs<T>, 'contextInterceptor' | 'targetType'>

export class Container {

  public id: number;
  public parent: Container | null;
  public readonly options: interfaces.ContainerOptions;
  // private _middleware: interfaces.Next | null;
  private _bindingDictionary: Lookup<interfaces.Binding<unknown>>;
  private _activations: Lookup<interfaces.BindingActivation<unknown>>;
  // private _deactivations: Lookup<interfaces.BindingDeactivation<unknown>>;
  private _metadataReader: interfaces.MetadataReader;

  public constructor(containerOptions?: interfaces.ContainerOptions) {
    const options = containerOptions || {};
    // if (typeof options !== 'object') {
    //   throw new Error(`${CONTAINER_OPTIONS_MUST_BE_AN_OBJECT}`);
    // }

    // if (options.defaultScope === undefined) {
      options.defaultScope = BindingScopeEnum.Transient;
    // }

    // if (options.autoBindInjectable === undefined) {
      options.autoBindInjectable = false;
    // }

    // if (options.skipBaseClassChecks === undefined) {
      options.skipBaseClassChecks = false;
    // }

    this.options = {
      autoBindInjectable: options.autoBindInjectable,
      defaultScope: options.defaultScope,
      skipBaseClassChecks: options.skipBaseClassChecks
    };

    this.id = id();
    this._bindingDictionary = new Lookup<interfaces.Binding<unknown>>();
    // this._snapshots = [];
    // this._middleware = null;
    this._activations = new Lookup<interfaces.BindingActivation<unknown>>();
    // this._deactivations = new Lookup<interfaces.BindingDeactivation<unknown>>();
    this.parent = null;
    this._metadataReader = new MetadataReader();
    // this._moduleActivationStore = new ModuleActivationStore()
  }


  // Registers a type binding
  public bind<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
    const scope = this.options.defaultScope || BindingScopeEnum.Transient;
    const binding = new Binding<T>(serviceIdentifier, scope);
    this._bindingDictionary.add(serviceIdentifier, binding as Binding<unknown>);
    return new BindingToSyntax<T>(binding);
  }


  public onActivation<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>, onActivation: interfaces.BindingActivation<T>) {
    this._activations.add(serviceIdentifier, onActivation as interfaces.BindingActivation<unknown>);
  }
 // }

  // Resolves a dependency by its runtime identifier
  // The runtime identifier must be associated with only one binding
  // use getAll when the runtime identifier is associated with multiple bindings
  public get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T {
    const getArgs = this._getNotAllArgs(serviceIdentifier, false);

    return this._getButThrowIfAsync<T>(getArgs) as T;
  }

  // private _preDestroy<T>(constructor: NewableFunction, instance: T): Promise<void> | void {
  //   if (Reflect.hasMetadata(PRE_DESTROY, constructor)) {
  //     const data: interfaces.Metadata = Reflect.getMetadata(PRE_DESTROY, constructor);
  //     return (instance as interfaces.Instance<T>)[(data.value as string)]?.();
  //   }
  // }
  //
  // private _deactivate<T>(binding: Binding<T>, instance: T): void | Promise<void> {
  //   const constructor: NewableFunction = Object.getPrototypeOf(instance).constructor;
  //
  //   try {
  //     if (this._deactivations.hasKey(binding.serviceIdentifier)) {
  //       const result = this._deactivateContainer(
  //         instance,
  //         this._deactivations.get(binding.serviceIdentifier).values(),
  //       );
  //
  //       if (isPromise(result)) {
  //         return this._handleDeactivationError(
  //           result.then(() => this._propagateContainerDeactivationThenBindingAndPreDestroyAsync(
  //             binding, instance, constructor)),
  //           constructor
  //         );
  //       }
  //     }
  //
  //     const propagateDeactivationResult = this._propagateContainerDeactivationThenBindingAndPreDestroy(
  //       binding, instance, constructor);
  //
  //     if (isPromise(propagateDeactivationResult)) {
  //       return this._handleDeactivationError(propagateDeactivationResult, constructor);
  //     }
  //   } catch (ex) {
  //     if (ex instanceof Error) {
  //       throw new Error(ON_DEACTIVATION_ERROR(constructor.name, ex.message));
  //     }
  //   }
  // }
  //
  // private async _handleDeactivationError(asyncResult: Promise<void>, constructor: NewableFunction): Promise<void> {
  //   try {
  //     await asyncResult;
  //   } catch (ex) {
  //     if (ex instanceof Error) {
  //       throw new Error(ON_DEACTIVATION_ERROR(constructor.name, ex.message));
  //     }
  //   }
  // }
  //
  // private _deactivateContainer<T>(
  //   instance: T,
  //   deactivationsIterator: IterableIterator<interfaces.BindingDeactivation<unknown>>,
  // ): void | Promise<void> {
  //   let deactivation = deactivationsIterator.next();
  //
  //   while (deactivation.value) {
  //     const result = deactivation.value(instance);
  //
  //     if (isPromise(result)) {
  //       return result.then(() =>
  //         this._deactivateContainerAsync(instance, deactivationsIterator),
  //       );
  //     }
  //
  //     deactivation = deactivationsIterator.next();
  //   }
  // }
  //
  // private async _deactivateContainerAsync<T>(
  //   instance: T,
  //   deactivationsIterator: IterableIterator<interfaces.BindingDeactivation<unknown>>,
  // ): Promise<void> {
  //   let deactivation = deactivationsIterator.next();
  //
  //   while (deactivation.value) {
  //     await deactivation.value(instance);
  //     deactivation = deactivationsIterator.next();
  //   }
  // }

  // Prepares arguments required for resolution and
  // delegates resolution to _middleware if available
  // otherwise it delegates resolution to _planAndResolve
  private _get<T>(getArgs: GetArgs<T>): interfaces.ContainerResolution<T> {
    const planAndResolveArgs: interfaces.NextArgs<T> = {
      ...getArgs,
      contextInterceptor: (context) => context,
      targetType: TargetTypeEnum.Variable
    }

    return this._planAndResolve<T>()(planAndResolveArgs);
  }

  private _getButThrowIfAsync<T>(
    getArgs: GetArgs<T>,
  ): (T | T[]) {
    const result = this._get<T>(getArgs);

    // if (isPromiseOrContainsPromise<T>(result)) {
    //   throw new Error(LAZY_IN_SYNC(getArgs.serviceIdentifier));
    // }

    return result as (T | T[]);
  }

  private _getNotAllArgs<T>(
    serviceIdentifier: interfaces.ServiceIdentifier<T>,
    isMultiInject: boolean,
    key?: string | number | symbol | undefined,
    value?: unknown,
  ): GetArgs<T> {
    const getNotAllArgs: GetArgs<T> = {
      avoidConstraints: false,
      isMultiInject,
      serviceIdentifier,
      key,
      value,
    };

    return getNotAllArgs;
  }

  // Planner creates a plan and Resolver resolves a plan
  // one of the jobs of the Container is to links the Planner
  // with the Resolver and that is what this function is about
  private _planAndResolve<T = unknown>(): (args: interfaces.NextArgs<T>) => interfaces.ContainerResolution<T> {
    return (args: interfaces.NextArgs<T>) => {

      // create a plan
      let context = plan(
        this._metadataReader,
        this,
        args.isMultiInject,
        args.targetType,
        args.serviceIdentifier,
        args.key,
        args.value,
        args.avoidConstraints
      );

      // apply context interceptor
      context = args.contextInterceptor(context);

      // resolve plan
      const result = resolve<T>(context);

      return result;

    };
  }

  // private _propagateContainerDeactivationThenBindingAndPreDestroy<T>(
  //   binding: Binding<T>,
  //   instance: T,
  //   constructor: NewableFunction
  // ): void | Promise<void> {
  //   if (this.parent) {
  //     return this._deactivate.bind(this.parent)(binding, instance);
  //   } else {
  //     return this._bindingDeactivationAndPreDestroy(binding, instance, constructor);
  //   }
  // }
  //
  // private async _propagateContainerDeactivationThenBindingAndPreDestroyAsync<T>(
  //   binding: Binding<T>,
  //   instance: T,
  //   constructor: NewableFunction
  // ): Promise<void> {
  //   if (this.parent) {
  //     await this._deactivate.bind(this.parent)(binding, instance);
  //   } else {
  //     await this._bindingDeactivationAndPreDestroyAsync(binding, instance, constructor);
  //   }
  // }
  //
  // private _bindingDeactivationAndPreDestroy<T>(
  //   binding: Binding<T>,
  //   instance: T,
  //   constructor: NewableFunction
  // ): void | Promise<void> {
  //   if (typeof binding.onDeactivation === 'function') {
  //     const result = binding.onDeactivation(instance);
  //
  //     if (isPromise(result)) {
  //       return result.then(() => this._preDestroy(constructor, instance));
  //     }
  //   }
  //
  //   return this._preDestroy(constructor, instance);
  // }
  //
  // private async _bindingDeactivationAndPreDestroyAsync<T>(
  //   binding: Binding<T>,
  //   instance: T,
  //   constructor: NewableFunction
  // ): Promise<void> {
  //   if (typeof binding.onDeactivation === 'function') {
  //     await binding.onDeactivation(instance);
  //   }
  //
  //   await this._preDestroy(constructor, instance);
  // }

}

