<template>
  <v-form ref="form" validate-on="input" v-model="hasValidValues" @submit.prevent="addTask()">
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="9">
          <v-text-field label="Description" v-model="description" required :rules="rules.description" />
        </v-col>
        <v-col cols="2">
          <v-text-field label="dd/MM/yyyy" type="date" v-model="date" :rules="rules.date"></v-text-field>
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
import { format } from "date-fns";
import { ref } from "vue";

const storeTasks = useTasksStore();

const form = ref<HTMLFormElement | null>(null)
let description = ref("");
let date = ref("");
resetDateTask();
let hasValidValues = ref(false);

const rules = {
  description: [(d) => !!d || "Required"],
  date: [(d) => {
    if (d) {
      return true
    };
    resetDateTask();
    return "Required";
  }]
}

function addTask() {
  if (hasValidValues.value) {
    const task: Task = new Task(description.value, date.value);
    storeTasks.addTask(task);
    form.value?.reset();
  }
}
function resetDateTask(): void {
  date.value = format(new Date(), "yyyy-MM-dd");
}
</script>

<style scoped>
.v-container {
  padding: 16px 0px;
}
</style>