<template>
  <FilterTask />

  <section v-if="storeTasks.tasksToCompleteByFilter.length">
    <v-toolbar>
      <v-toolbar-title>TO COMPLETE ({{ storeTasks.tasksToCompleteByFilter.length }})</v-toolbar-title>
    </v-toolbar>
    <v-list>
      <v-list-item v-for="task in storeTasks.tasksToCompleteByFilter" :key="task.id">
        <div :class="[new Date(task.date).getTime() < startOfDay(new Date()).getTime() ? 'text-error' : '']">
          <v-list-item-title>
            {{ task.description }}
          </v-list-item-title>
          <v-list-item-subtitle class="pl-2">
            <v-icon class="mr-1">mdi mdi-clock-time-eight-outline</v-icon> {{ format(new Date(task.date), "dd-MM-yyyy") }}
          </v-list-item-subtitle>
        </div>

        <template v-slot:append>
          <v-btn v-if="showButtonReplaceTask" variant="text" icon="mdi mdi-pencil" size="large"
            @click="showButtonReplaceTask = false">
          </v-btn>
          <v-btn variant="text" icon="mdi mdi-checkbox-marked" size="large" @click="completeTask(task.id)">
            <v-icon color="success"></v-icon>
          </v-btn>
          <v-btn variant="text" icon="mdi mdi-delete" size="large" @click="deleteTask(task.id)">
            <v-icon color="error"></v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </section>

  <TaskListCompleted />
</template>

<script setup lang="ts">
import FilterTask from "./taskList/FilterTask.vue"
import TaskListCompleted from "./taskList/TaskListCompleted.vue"
import { useTasksStore } from "../stores/tasks"
import { ref } from "vue"
import { format, startOfDay } from "date-fns"

const storeTasks = await useTasksStore();
await storeTasks.fetchTasks();
console.log("tasklist", storeTasks.tasksToCompleteByFilter)

const showButtonReplaceTask = ref(true);
// function initFieldsToReplaceTask(task: Task) {

// }

function completeTask(id: string) {
  storeTasks.completeTask(id);
}
function deleteTask(id: string) {
  storeTasks.deleteTask(id);
}
</script>

<style scoped>
.v-list-item {
  padding: 0px 16px;
}

.v-list-item--density-default.v-list-item--one-line {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>