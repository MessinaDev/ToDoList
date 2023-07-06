import { addDays, startOfDay, startOfYesterday } from "date-fns";

export class TaskFilter {
  readonly description: string;
  dates: Date[];

  constructor(description: string, dates: Date[]) {
    this.description = description;
    this.dates = dates;
  }
}

const today = startOfDay(new Date());

export const allTasks: TaskFilter = new TaskFilter("All tasks", []);
export const nextThreeDays: TaskFilter = new TaskFilter("Next 3 days", [
  today,
  addDays(today, 1),
  addDays(today, 2)
]);
export const selectedDate: TaskFilter = new TaskFilter("Selected date", [today]);
export const outdated: TaskFilter = new TaskFilter("Outdated", [startOfYesterday()]);

export const taskFilters: TaskFilter[] = [allTasks, outdated, nextThreeDays, selectedDate];

export function getFilterByDescription(description: string): TaskFilter | null {
  return taskFilters.find((t) => t.description === description) || null;
}
