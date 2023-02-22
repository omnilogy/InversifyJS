export const DUPLICATED_INJECTABLE_DECORATOR = 'err#1'; // Cannot apply @injectable decorator multiple times.';
export const DUPLICATED_METADATA = 'err#2'; // Metadata key was used more than once in a parameter:';
export const NULL_ARGUMENT = 'err#3'; // NULL argument';
export const KEY_NOT_FOUND = 'err#4'; // Key Not Found';
export const AMBIGUOUS_MATCH = 'err#5'; // Ambiguous match found for serviceIdentifier:';
export const CANNOT_UNBIND = 'err#6'; // Could not unbind serviceIdentifier:';
export const NOT_REGISTERED = 'err#7'; // No matching bindings found for serviceIdentifier:';
export const MISSING_INJECTABLE_ANNOTATION = 'err#8'; // Missing required @injectable annotation in:';
export const MISSING_INJECT_ANNOTATION = 'err#9'; // Missing required @inject or @multiInject annotation in:';
export const UNDEFINED_INJECT_ANNOTATION = (name: string) => `err#10 ${name}`;// `@inject called with undefined this could mean that the class ${name} has a circular dependency problem. You can use a LazyServiceIdentifer to overcome this limitation.`;
export const CIRCULAR_DEPENDENCY = 'err#11'; // Circular dependency found:';
export const NOT_IMPLEMENTED = 'err#12'; // Sorry, this feature is not fully implemented yet.';
export const INVALID_BINDING_TYPE = 'err#13'; // Invalid binding type:';
export const NO_MORE_SNAPSHOTS_AVAILABLE = 'err#13'; // No snapshot available to restore.';
export const INVALID_MIDDLEWARE_RETURN = 'err#14'; // Invalid return type in middleware. Middleware must return!';
export const INVALID_FUNCTION_BINDING = 'err#15'; // Value provided to function binding must be a function!';
export const LAZY_IN_SYNC = (key: unknown) => `err#16 ${key}` // You are attempting to construct '${key}' in a synchronous way but it has asynchronous dependencies.`;

export const INVALID_TO_SELF_VALUE = 'err#17'; // The toSelf function can only be applied when a constructor is used as service identifier';

export const INVALID_DECORATOR_OPERATION = 'err#18'; // The @inject @multiInject @tagged and @named decorators must be applied to the parameters of a class constructor or a class property.';

export const ARGUMENTS_LENGTH_MISMATCH = (...values: unknown[]) => `err#19 ${values[0]}` //The number of constructor arguments in the derived class ${values[0]} must be >= than the number of constructor arguments of its base class.`;

export const CONTAINER_OPTIONS_MUST_BE_AN_OBJECT = 'err#20'; // Invalid Container constructor argument. Container options must be an object.';

export const CONTAINER_OPTIONS_INVALID_DEFAULT_SCOPE = 'err#21'; // Invalid Container option. Default scope must be a string ("singleton" or "transient").';

export const CONTAINER_OPTIONS_INVALID_AUTO_BIND_INJECTABLE = 'err#22'; // Invalid Container option. Auto bind injectable must be a boolean';

export const CONTAINER_OPTIONS_INVALID_SKIP_BASE_CHECK = 'err#23'; // Invalid Container option. Skip base check must be a boolean';

export const MULTIPLE_PRE_DESTROY_METHODS = 'err#24'; // Cannot apply @preDestroy decorator multiple times in the same class';
export const MULTIPLE_POST_CONSTRUCT_METHODS = 'err#25'; // Cannot apply @postConstruct decorator multiple times in the same class';
export const ASYNC_UNBIND_REQUIRED = 'err#25'; // Attempting to unbind dependency with asynchronous destruction (@preDestroy or onDeactivation)';
export const POST_CONSTRUCT_ERROR = (clazz: string, errorMessage: string) => `@postConstruct error in class ${clazz}: ${errorMessage}`;
export const PRE_DESTROY_ERROR = (clazz: string, errorMessage: string) => `@preDestroy error in class ${clazz}: ${errorMessage}`;
export const ON_DEACTIVATION_ERROR = (clazz: string, errorMessage: string) => `onDeactivation() error in class ${clazz}: ${errorMessage}`;

export const CIRCULAR_DEPENDENCY_IN_FACTORY = (factoryType: string, serviceIdentifier: string) => `err#26 ${factoryType} ${serviceIdentifier}` // It looks like there is a circular dependency in one of the '${factoryType}' bindings. Please investigate bindings with service identifier '${serviceIdentifier}'.`;

export const STACK_OVERFLOW = 'err#27'; // Maximum call stack size exceeded';
