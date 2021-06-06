<template>
  <div class="layout gutter--xl">
    <va-card>
      <va-card-content>
        <div>{{ hasNFC() }}</div>
        {{ latest }}
        <div v-if="!error">No Error</div>
        <div v-else>{{ error }}</div>
        <div>Status: {{ status }}</div>
        <div class="gutter--xl my-4" v-if="status !== NFCStatus.NOT_SUPPORTED">
          <va-button @click="startReading()"> Start Reading </va-button>
          <va-button @click="stopReading()"> Stop Reading </va-button>
        </div>
        <div class="gutter--xl" v-if="status !== NFCStatus.NOT_SUPPORTED">
          <va-button @click="writeNFC"> Write </va-button>
          <va-button @click="writeURL"> Write URL </va-button>
          <va-button @click="writeEmpty"> Write Empty </va-button>
          <va-button @click="abortWrite"> Abort Write </va-button>
        </div>
        <div>{{ latestWrite }}</div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script lang="ts">
/// <reference path="web-nfc.d.ts" />

import { defineComponent, ref, computed } from "vue";
import useNFC, { NFCStatus } from "./composition/useNFC";

export default defineComponent({
  name: "App",
  components: {},
  setup() {
    const hasNFC = () => {
      return "NDEFReader" in window;
    };

    const { write, ...nfc } = useNFC();

    const writeNFC = () => {
      write({
        records: [{ recordType: "text", data: "Hello World" }],
      }).catch((e) => {
        console.log(e);
      });
    };

    const writeURL = () => {
      write({
        records: [
          { recordType: "url", data: "https://w3c.github.io/web-nfc/" },
        ],
      }).catch((e) => {
        console.log(e);
      });
    };

    const writeEmpty = () => {
      write({
        records: [{ recordType: "empty" }],
      }).catch((e) => {
        console.log(e);
      });
    };

    const latest = computed(() => {
      return nfc.latestRead?.value
        ? nfc.latestRead.value.message.records[0].recordType
        : "No message";
    });

    return {
      hasNFC,
      NFCStatus,
      writeNFC,
      writeURL,
      writeEmpty,
      latest,
      write,
      ...nfc,
    };
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
