<script setup lang="ts">
import TitleApp from "./components/TitleApp.vue"
import AddTask from "./components/AddTask.vue"
import TasksList from "./components/TasksList.vue"
</script>

<template>
  <TitleApp />
  <AddTask />
  <Suspense>
    <TasksList />
    <template #fallback>
      Loading..
    </template>
  </Suspense>
</template>

<style>
.v-container {
  padding: 0;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

@media (min-width: 960px) {
  .v-container {
    max-width: initial;
  }
}
</style>
