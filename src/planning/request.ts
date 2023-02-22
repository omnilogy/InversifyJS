import { interfaces } from '../interfaces/interfaces';
import { id } from '../utils/id';
import type {Context} from "./context";
import type {Target} from "./target";

export class Request {

  public id: number;
  public serviceIdentifier: interfaces.ServiceIdentifier;
  public parentContext: Context;
  public parentRequest: Request | null;
  public bindings: interfaces.Binding<unknown>[];
  public childRequests: Request[];
  public target: Target;
  public requestScope: interfaces.RequestScope | null;

  public constructor(
    serviceIdentifier: interfaces.ServiceIdentifier,
    parentContext: Context,
    parentRequest: Request | null,
    bindings: (interfaces.Binding<any> | interfaces.Binding<any>[]),
    target: Target
  ) {
    this.id = id();
    this.serviceIdentifier = serviceIdentifier;
    this.parentContext = parentContext;
    this.parentRequest = parentRequest;
    this.target = target;
    this.childRequests = [];
    this.bindings = (Array.isArray(bindings) ? bindings : [bindings]);

    // Set requestScope if Request is the root request
    this.requestScope = parentRequest === null
      ? new Map()
      : null;
  }

  public addChildRequest(
    serviceIdentifier: interfaces.ServiceIdentifier,
    bindings: (interfaces.Binding<unknown> | interfaces.Binding<unknown>[]),
    target: Target
  ): Request {

    const child = new Request(
      serviceIdentifier,
      this.parentContext,
      this,
      bindings,
      target
    );
    this.childRequests.push(child);
    return child;
  }
}

