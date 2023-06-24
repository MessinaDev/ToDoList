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
      await db.collection(nameTableTasks).add(task);
      this.fetchTasks();
    },
    completeTask(id: string) {
      findTask(this.$state, id).completed = true;
    },
    async deleteTask(id: string) {
      await db.collection(nameTableTasks).doc(id).delete();
    },
    async fetchTasks() {
      await db
        .collection(nameTableTasks)
        .get()
        .then((tasks) => {
          this.taskList = tasks;
          console.log(this.taskList);
        });
    }
  }
});

function findTask(state: State, id: string) {
  const task = state.taskList.find((task: Task) => task.id === id);
  if (task) {
    return task;
  }
  throw new Error(`L'ID ${id} non corrisponde ad alcun task`);
}
