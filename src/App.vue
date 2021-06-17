<template>
  <div class="layout gutter--xl">
    <va-card>
      <va-card-content>
        <div>{{ hasNFC() }}</div>
        {{ latest }}
        <div v-if="!error">No Error</div>
        <div v-else>{{ error }}</div>
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
import { defineComponent, provide, computed } from "vue";
import useNFC, { NFCStatus, NFCInjectionKey } from "./composition/useNFC";
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
    provide(NFCInjectionKey, nfc);

    const latest = computed(() => {
      return nfc.latestRead?.value
        ? nfc.latestRead.value.message.records[0].recordType
        : "No message";
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
</style>
