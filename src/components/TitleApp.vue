<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="11">
        <h1>ToDo List</h1>
      </v-col>
      <v-col cols="1">
        <v-btn variant="text" icon="mdi mdi-brightness-4" size="x-large" @click="toggleTheme()" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify"
const theme = useTheme();

const nameItemThemeInStorage = "theme";
const nameLightTheme = "light";
const nameDarkTheme = "dark";
localStorage.getItem(nameItemThemeInStorage) === nameLightTheme
  ? setValuesLightTheme()
  : setValuesDarkTheme();

function toggleTheme() {
  theme.global.current.value.dark ? setValuesLightTheme() : setValuesDarkTheme();
  localStorage.setItem(nameItemThemeInStorage, theme.global.current.value.dark
    ? nameDarkTheme
    : nameLightTheme);
}
function setValuesDarkTheme() {
  theme.global.name.value = nameDarkTheme;
  const r: any = document.querySelector(":root");
  r.style.setProperty("--color-background", "--vt-c-black")
  r.style.setProperty("--color-text", "--vt-c-text-dark-2")
  r.style.setProperty("--color-border", "--vt-c-divider-dark-2")
}
function setValuesLightTheme() {
  theme.global.name.value = nameLightTheme;
  const r: any = document.querySelector(":root");
  r.style.setProperty("--color-background", "--vt-c-white")
  r.style.setProperty("--color-text", "--vt-c-text-light-1")
  r.style.setProperty("--color-border", "--vt-c-divider-light-2")
}
</script>

<style scoped></style>