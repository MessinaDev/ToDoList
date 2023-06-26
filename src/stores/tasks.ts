import { defineStore } from "pinia";
import Task from "../entities/task";
import Localbase from "localbase";

interface State {
  taskList: Task[];
}

const nameDB = "ToDoApp";
const nameTableTasks = "tasks";
const db = new Localbase(nameDB);

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
    async addTask(task: Task) {
      await db
        .collection(nameTableTasks)
        .add(task, task.id)
        .then(async () => {
          console.log("task added");
          await this.fetchTasks();
        })
        .catch((error) => throwError(error));
    },
    async completeTask(id: string) {
      const taskFound = await fetchTask(id);
      await taskFound
        .update({ completed: true })
        .then(async (response) => {
          console.log("response", response);
          await this.fetchTasks();
        })
        .catch((error) => throwError(error));
    },
    async deleteTask(id: string) {
      const taskFound = await fetchTask(id);
      await taskFound
        .delete()
        .then(async () => {
          console.log("task deleted");
          await this.fetchTasks();
        })
        .catch((error) => throwError(error));
    },
    async fetchTasks() {
      await db
        .collection(nameTableTasks)
        .get()
        .then((tasks) => {
          this.taskList = tasks;
          console.log(this.taskList);
        })
        .catch((error) => throwError(error));
    }
  }
});

function throwError(text: string) {
  console.error(text);
  throw new Error(text);
}

async function fetchTask(id: string) {
  try {
    return await db.collection(nameTableTasks).doc(id);
  } catch (error) {
    throw new Error("Error during fetching task");
  }
}

function findTask(state: State, id: string) {
  const task = state.taskList.find((task: Task) => task.id === id);
  if (task) {
    return task;
  }
  throw new Error(`ID not found`);
}
