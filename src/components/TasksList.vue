<template>
  <v-list v-if="storeTasks.tasksToComplete.length">
    <v-list-subheader>TO COMPLETE</v-list-subheader>

    <v-list-item v-for="task in storeTasks.tasksToComplete" :key="task.id" :title="task.description">
      <template v-slot:append>
        <v-btn variant="text" icon="mdi mdi-checkbox-marked" size="large" @click="completeTask(task.id)">
          <v-icon color="success"></v-icon>
        </v-btn>
        <v-btn variant="text" icon="mdi mdi-delete" size="large" @click="deleteTask(task.id)">
          <v-icon color="error"></v-icon>
        </v-btn>
      </template>
    </v-list-item>
  </v-list>

  <v-list v-if="storeTasks.tasksCompleted.length" :class="storeTasks.tasksToComplete.length ? 'mt-8' : ''">
    <v-list-subheader>COMPLETED</v-list-subheader>

    <v-list-item v-for="task in storeTasks.tasksCompleted" :key="task.id" :title="task.description"
      class="task-completed">
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { useTasksStore } from "../stores/tasks"

const storeTasks = useTasksStore();
await storeTasks.fetchTasks();

function completeTask(id: string) {
  storeTasks.completeTask(id);
}
function deleteTask(id: string) {
  storeTasks.deleteTask(id);
}
</script>

<style scoped>
.task-completed {
  text-decoration: line-through
}

.v-list-item {
  padding: 0px 16px;
}

.v-list-item--density-default.v-list-item--one-line {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>