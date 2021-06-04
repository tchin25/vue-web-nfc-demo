<template>
  <div class="layout gutter--xl">
    <va-card>
      <va-card-content>
        <div>{{ hasNFC() }}</div>
        {{ latestRead }}
        <div v-if="!error">No Error</div>
        <div v-else>{{ error }}</div>
        <div>Status: {{ status }}</div>
        <div v-if="status !== Status.NOT_SUPPORTED">
          <va-button @click="startReading()"> Start Reading </va-button>
          <va-button @click="stopReading()"> Stop Reading </va-button>
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script lang="ts">
/// <reference path="web-nfc.d.ts" />

import { defineComponent } from "vue";
import useNFC, { Status } from "./composition/useNFC";

export default defineComponent({
  name: "App",
  components: {},
  setup() {
    const hasNFC = () => {
      return "NDEFReader" in window;
    };

    const nfc = useNFC();

    return { hasNFC, ...nfc };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
