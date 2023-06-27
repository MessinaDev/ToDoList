import { defineStore } from "pinia";
import Task from "../entities/task";

interface State {
  taskList: Task[];
}

const nameDB = "ToDoApp";
const nameTableTasks = "tasks";
let db;

export const useTasksStore = defineStore("tasks", {
  state: (): State => {
    return {
      taskList: []
    };
  },

  getters: {
    tasksToComplete: (state): Task[] => state.taskList.filter(({ completed }) => !completed),
    tasksCompleted: (state): Task[] => state.taskList.filter(({ completed }) => completed)
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
        console.log("task", task);
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
    }
  }
});

async function openDB() {
  return new Promise((resolve) => {
    const request = indexedDB.open(nameDB);
    request.onupgradeneeded = () => {
      db = request.result;
      db.createObjectStore(nameTableTasks, { keyPath: "id", autoIncrement: true });
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
