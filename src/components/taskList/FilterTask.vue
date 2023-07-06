<template>
  <section class="text-center mb-5">
    <v-container>
      <v-row>
        <v-col cols="auto">
          <v-chip-group mandatory v-model="selectedFilterComputed" selected-class="text-success">
            <v-chip v-for="filter in taskFilters" :key="filter.description" :value="filter.description" size="x-large">
              {{ filter.description }}</v-chip>
          </v-chip-group>
        </v-col>

        <v-col cols="2">
          <v-text-field v-if="selectedFilterComputed === selectedDate.description" label="dd/MM/yyyy" type="date"
            v-model="filteredDate">
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { useTasksStore } from "../../stores/tasks"
import { TaskFilter, taskFilters, allTasks, selectedDate, getFilterByDescription } from "../../entities/taskFilter"
import { format, startOfDay } from "date-fns"
import { ref, watch, computed } from "vue"

const storeTasks = useTasksStore();
const today: string = format(new Date(), "yyyy-MM-dd");

let filteredDate = ref(today)
watch(filteredDate, () => {
  changeFilterSelected();
})

const keyLocalStorageSelectedFilter = "selected-filter";
let selectedFilter = ref("");
const selectedFilterComputed = computed({
  get(): string {
    return selectedFilter.value;
  },
  set(description: string): void {
    selectedFilter.value = description;
    filteredDate.value = today;
    localStorage.setItem(keyLocalStorageSelectedFilter, description);
    changeFilterSelected();
  }
})
selectedFilterComputed.value = localStorage.getItem(keyLocalStorageSelectedFilter) || allTasks.description;

function changeFilterSelected(): void {
  const filter: TaskFilter | null = getFilterByDescription(selectedFilterComputed.value);
  if (filter?.description === selectedDate.description) {
    filter.dates = [startOfDay(new Date(filteredDate.value))];
  }
  if (filter) {
    storeTasks.setTaskFilter(filter);
  } else {
    throw new Error("Filter NULL")
  }
}
</script>

<style scoped>
.v-container {
  padding: 0;
}

.v-col {
  padding: 4px;
}
</style>