import type {Context} from "./context";
import type {Request} from "./request";

class Plan {

  public parentContext: Context;
  public rootRequest: Request;

  public constructor(parentContext: Context, rootRequest: Request) {
    this.parentContext = parentContext;
    this.rootRequest = rootRequest;
  }
}

export { Plan };
