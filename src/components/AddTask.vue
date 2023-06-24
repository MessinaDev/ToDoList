<template>
  <v-form validate-on="submit lazy" @submit.prevent="addTask()">
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="11">
          <v-text-field label="Description" v-model="description" autofocus required />
        </v-col>
        <v-col cols="1">
          <v-btn type="submit" variant="text" icon="mdi mdi-plus-box" size="x-large"></v-btn>
        </v-col>
      </v-row>
    </v-container>

  </v-form>
</template>

<script setup lang="ts">
import Task from '@/entities/task';
import { useTasksStore } from "../stores/tasks"

let description: string;
const storeTasks = useTasksStore();

function addTask() {
  if (description) {
    const task: Task = new Task(description);
    storeTasks.addTask(task);
    description = "";
  }
}
</script>

<style scoped>
.v-container {
  padding: 16px 0px;
}
</style>