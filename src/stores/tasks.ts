import { defineStore } from "pinia";
import Task from "../entities/task";
import { startOfYesterday, startOfDay } from "date-fns";

interface State {
  taskList: Task[];
  datesToFilter: Date[];
}

const nameDB = "ToDoApp";
const nameTableTasks = "tasks";
let db;

export const useTasksStore = defineStore("tasks", {
  state: (): State => {
    return {
      taskList: [],
      datesToFilter: []
    };
  },

  getters: {
    tasksToComplete: (state): Task[] =>
      sortTasks(state.taskList.filter(({ completed }) => !completed)),
    tasksToCompleteByFilter: function (state): Task[] {
      if (
        state.datesToFilter.length &&
        state.datesToFilter[0].getTime() === startOfYesterday().getTime()
      ) {
        return filterTasksOutdated(this.tasksToComplete);
      } else {
        return filterTasksByDates(this.tasksToComplete, state.datesToFilter);
      }
    },
    tasksCompleted: (state): Task[] =>
      sortTasks(state.taskList.filter(({ completed }) => completed)),
    tasksCompletedByFilter: function (state): Task[] {
      return filterTasksByDates(this.tasksCompleted, state.datesToFilter);
    }
  },

  actions: {
    async fetchTasks() {
      const store = await openDBStore("readonly");

      const request = store.getAll();
      request.onsuccess = (e) => {
        this.taskList = e.target.result;
      };
      request.onerror = (e) => throwError(e.target.error);
    },
    async addTask(task: Task) {
      const store = await openDBStore("readwrite");
      const request = await store.add(task);
      request.onsuccess = async () => {
        await this.fetchTasks();
      };
      request.onerror = (e) => throwError(e.target.error);
    },
    async completeTask(id: string) {
      const store = await openDBStore("readwrite");
      const requestTaskFound = store.get(id);
      requestTaskFound.onsuccess = async () => {
        const task = requestTaskFound.result;
        task.completed = true;
        const request = await store.put(task);
        request.onsuccess = async () => {
          await this.fetchTasks();
        };
        request.onerror = (e) => throwError(e.target.error);
      };
      requestTaskFound.onerror = () => {
        throwError("Task not found");
      };
    },
    async deleteTask(id: string) {
      const store = await openDBStore("readwrite");
      const request = await store.delete(id);
      request.onsuccess = async () => {
        await this.fetchTasks();
      };
      request.onerror = (e) => throwError(e.target.error);
    },
    setDatesToFilter(dates: Date[]) {
      this.datesToFilter = dates;
    }
  }
});

function sortTasks(tasks: Task[]): Task[] {
  return tasks.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}
function filterTasksByDates(tasksToFilter: Task[], datesToFilter: Date[]) {
  let tasks: Task[] = tasksToFilter;
  if (datesToFilter.length) {
    tasks = tasks.filter((t) => {
      return datesToFilter.map((d) => d.getTime()).includes(new Date(t.date).getTime());
    });
  }
  return tasks;
}
function filterTasksOutdated(tasksToFilter: Task[]) {
  return tasksToFilter.filter((t) => new Date(t.date).getTime() < startOfDay(new Date()).getTime());
}

async function openDB() {
  return new Promise((resolve) => {
    const request = indexedDB.open(nameDB);
    request.onupgradeneeded = () => {
      db = request.result;
      const store = db.createObjectStore(nameTableTasks, { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
    };
    request.onsuccess = () => {
      db = request.result;
      return resolve(db);
    };
    request.onerror = () => {
      throwError("DB not working!");
    };
  });
}

async function openDBStore(typeTransaction: IDBTransactionMode) {
  if (!db) {
    await openDB();
  }
  try {
    const trans = db.transaction([nameTableTasks], typeTransaction);
    return await trans.objectStore(nameTableTasks);
  } catch (error) {
    throwError("Error openDBStore!");
  }
}

function throwError(text: string) {
  console.error(text);
  throw new Error(text);
}
