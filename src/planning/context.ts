import { id } from '../utils/id';
import type {Container} from "../container/container";
import type {Plan} from "./plan";

export class Context  {

  public id: number;
  public container: Container;
  public plan!: Plan;
  public currentRequest!: Request;

  public constructor(
    container: Container) {
    this.id = id();
    this.container = container;
  }

  public addPlan(plan: Plan) {
    this.plan = plan;
  }

  public setCurrentRequest(currentRequest: Request) {
    this.currentRequest = currentRequest;
  }

}
