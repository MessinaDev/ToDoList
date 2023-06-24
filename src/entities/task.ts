import { v4 as uuidv4 } from "uuid";

export default class Task {
  readonly id: string;
  description: string;
  completed: boolean;

  constructor(description: string) {
    this.id = uuidv4();
    this.description = description;
    this.completed = false;
  }
}
