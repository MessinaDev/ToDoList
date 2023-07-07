<template>
  <section v-if="storeTasks.tasksCompletedByFilter.length && storeTasks.filterSelected != outdated"
    :class="storeTasks.tasksCompletedByFilter.length ? 'mt-8' : ''">
    <v-toolbar>
      <v-toolbar-title>COMPLETED ({{ storeTasks.tasksCompletedByFilter.length }})</v-toolbar-title>
      <v-btn variant="text" icon="mdi mdi-chevron-down" @click="showTasks = !showTasks"></v-btn>
    </v-toolbar>
    <v-list v-if="showTasks">
      <v-list-item v-for="task in storeTasks.tasksCompletedByFilter" :key="task.id">
        <v-list-item-title class="list-item__task-completed">
          {{ task.description }}
        </v-list-item-title>
        <v-list-item-subtitle class="pl-2 ">
          <v-icon class="mr-1">mdi mdi-clock-time-eight-outline</v-icon> {{ format(new Date(task.date), "dd/MM/yyyy") }}
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
import { ref } from "vue"
import { useTasksStore } from "../../stores/tasks"
import { outdated } from "../../entities/taskFilter"
import { format } from "date-fns"

const storeTasks = await useTasksStore();
console.log("tasklistcompleted", storeTasks.tasksToCompleteByFilter)

let showTasks = ref(false);

function deleteTask(id: string) {
  storeTasks.deleteTask(id);
}
</script>

<style scoped>
.list-item__task-completed {
  text-decoration: line-through;
}

header {
  padding-right: 0;
}
</style>