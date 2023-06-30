<template>
  <section v-if="storeTasks.tasksToComplete.length">
    <v-toolbar>
      <v-toolbar-title>TO COMPLETE ({{ storeTasks.tasksToComplete.length }})</v-toolbar-title>
    </v-toolbar>
    <v-list>
      <v-list-item v-for="task in storeTasks.tasksToComplete" :key="task.id">
        <v-list-item-title>
          {{ task.description }}
        </v-list-item-title>
        <v-list-item-subtitle class="pl-2">
          <v-icon class="mr-1">mdi mdi-clock-time-eight-outline</v-icon> {{ task.date ? format(new Date(task.date),
            "dd-MM-yyyy") : "-" }}
        </v-list-item-subtitle>

        <template v-slot:append>
          <v-btn variant="text" icon="mdi mdi-pencil" size="large">
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

  <section v-if="storeTasks.tasksCompleted.length" :class="storeTasks.tasksCompleted.length ? 'mt-8' : ''">
    <v-toolbar>
      <v-toolbar-title>COMPLETED ({{ storeTasks.tasksCompleted.length }})</v-toolbar-title>
      <v-btn variant="text" icon="mdi mdi-chevron-down" @click="showCompletedTasks = !showCompletedTasks"></v-btn>
    </v-toolbar>
    <v-list v-if="showCompletedTasks">
      <v-list-item v-for="task in storeTasks.tasksCompleted" :key="task.id">
        <v-list-item-title class="list-item__task-completed">
          {{ task.description }}
        </v-list-item-title>
        <v-list-item-subtitle class="pl-2 ">
          <v-icon class="mr-1">mdi mdi-clock-time-eight-outline</v-icon> {{ format(new Date(task.date), "dd-MM-yyyy") }}
        </v-list-item-subtitle>

        <template v-slot:append>
          <v-btn variant="text" icon="mdi mdi-delete" size="large" class="list-item__task-completed--reset-decoration"
            @click="deleteTask(task.id)">
            <v-icon color="error"></v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </section>
</template>

<script setup lang="ts">
import { useTasksStore } from "../stores/tasks"
import { ref } from "vue"
import { format } from "date-fns"

const storeTasks = await useTasksStore();
await storeTasks.fetchTasks();

function completeTask(id: string) {
  storeTasks.completeTask(id);
}
function deleteTask(id: string) {
  storeTasks.deleteTask(id);
}

let showCompletedTasks = ref(false);
</script>

<style scoped>
.list-item__task-completed {
  text-decoration: line-through;
}

.v-list-item {
  padding: 0px 16px;
}

.v-list-item--density-default.v-list-item--one-line {
  padding-top: 0px;
  padding-bottom: 0px;
}

@media (min-width: 1024px) {
  header {
    padding-right: 0;
  }
}
</style>