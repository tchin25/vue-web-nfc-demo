<template>
  <div class="layout">
    <va-card>
      <va-card-content>
        <div>Has NFC: {{ hasNFC() }}</div>
        <div>Latest Read: {{ latest }}</div>
        <div>Error: {{ error || `No error` }}</div>
        <div>Status: {{ status }}</div>
      </va-card-content>
    </va-card>
    <template v-if="hasNFC()">
      <ReadNFC />
      <WriteNFC />
    </template>
  </div>
</template>

<script lang="ts">
/// <reference path="web-nfc.d.ts" />
import { defineComponent, computed } from "vue";
import useNFC, { NFCStatus } from "./composition/useNFC";
import WriteNFC from "./components/WriteNFC.vue";
import ReadNFC from "./components/ReadNFC.vue";

export default defineComponent({
  name: "App",
  components: { WriteNFC, ReadNFC },
  setup() {
    const hasNFC = () => {
      return "NDEFReader" in window;
    };

    const nfc = useNFC();

    const latest = computed(() => {
      return nfc.latestRead?.value
        ? nfc.latestRead.value.message.records[0].recordType
        : "N/A";
    });

    return {
      hasNFC,
      NFCStatus,
      latest,
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

.va-card {
  margin: 1rem;
}
</style>
