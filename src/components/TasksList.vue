<template>
  <section class="text-center mb-5">
    <v-container>
      <v-row>
        <v-col cols="auto">
          <v-chip-group mandatory filter v-model="selectedFilter" selected-class="text-success">
            <v-chip v-for="filter in taskFilters" :key="filter" :value="filter" size="x-large">{{ filter }}</v-chip>
          </v-chip-group>
        </v-col>

        <v-col cols="2">
          <v-text-field v-if="selectedFilter === selectedDate" label="dd/MM/yyyy" type="date" v-model="filteredDate">
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </section>

  <section v-if="storeTasks.tasksToCompleteByFilter.length">
    <v-toolbar>
      <v-toolbar-title>TO COMPLETE ({{ storeTasks.tasksToCompleteByFilter.length }})</v-toolbar-title>
    </v-toolbar>
    <v-list>
      <v-list-item v-for="task in storeTasks.tasksToCompleteByFilter" :key="task.id">
        <div :class="[new Date(task.date).getTime() < new Date(filteredDate).getTime() ? 'text-error' : '']">
          <v-list-item-title>
            {{ task.description }}
          </v-list-item-title>
          <v-list-item-subtitle class="pl-2">
            <v-icon class="mr-1">mdi mdi-clock-time-eight-outline</v-icon> {{ format(new Date(task.date), "dd-MM-yyyy") }}
          </v-list-item-subtitle>
        </div>

        <template v-slot:append>
          <!-- <v-btn variant="text" icon="mdi mdi-pencil" size="large">
          </v-btn> -->
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

  <section v-if="storeTasks.tasksCompletedByFilter.length && selectedFilter != outdated"
    :class="storeTasks.tasksCompletedByFilter.length ? 'mt-8' : ''">
    <v-toolbar>
      <v-toolbar-title>COMPLETED ({{ storeTasks.tasksCompletedByFilter.length }})</v-toolbar-title>
      <v-btn variant="text" icon="mdi mdi-chevron-down" @click="showCompletedTasks = !showCompletedTasks"></v-btn>
    </v-toolbar>
    <v-list v-if="showCompletedTasks">
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
import { useTasksStore } from "../stores/tasks"
import { ref, watch } from "vue"
import { format, addDays, startOfYesterday } from "date-fns"
import { taskFilters, allTasks, selectedDate, nextThreeDays, outdated } from "../entities/taskFilter"

const storeTasks = await useTasksStore();
await storeTasks.fetchTasks();

let filteredDate = ref(format(new Date(), "yyyy-MM-dd"))
watch(filteredDate, () => {
  setDatesToFilter();
})
const keyLocalStorageSelectedFilter = "selected-filter";
let selectedFilter = ref(localStorage.getItem(keyLocalStorageSelectedFilter) || ref(allTasks));
setDatesToFilter();
watch(selectedFilter, () => {
  filteredDate.value = format(new Date(), "yyyy-MM-dd");
  localStorage.setItem(keyLocalStorageSelectedFilter, selectedFilter.value);
  setDatesToFilter();
})
function setDatesToFilter(): void {
  let dates: Date[] = [];
  const d = new Date(filteredDate.value);
  if (selectedFilter.value === selectedDate) {
    dates = [d];
  } else if (selectedFilter.value === nextThreeDays) {
    dates = [d, addDays(d, 1), addDays(d, 2)]
  } else if (selectedFilter.value === outdated) {
    dates = [startOfYesterday()];
  }
  storeTasks.setDatesToFilter(dates);
}

function completeTask(id: string) {
  storeTasks.completeTask(id);
}
function deleteTask(id: string) {
  storeTasks.deleteTask(id);
}

let showCompletedTasks = ref(false);
</script>

<style scoped>
.v-container {
  padding: 0;
}

.v-col {
  padding: 4px;
}

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