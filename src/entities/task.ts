import { v4 as uuidv4 } from "uuid";

export default class Task {
  readonly id: string;
  description: string;
  completed: boolean;
  date: string;

  constructor(description: string, date: string) {
    this.id = uuidv4();
    this.description = description;
    this.completed = false;
    this.date = date;
  }
}
