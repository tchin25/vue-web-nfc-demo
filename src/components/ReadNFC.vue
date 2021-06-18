<template>
  <va-card>
    <va-card-content>
      <va-button @click="startReading()" v-if="!is(NFCStatus.READING)">
        Start Reading
      </va-button>
      <va-button color="danger" @click="stopReading()" v-else>
        Stop Reading
      </va-button>
    </va-card-content>
  </va-card>
</template>
<script lang="ts">
import { defineComponent, inject } from "vue";
import useNFC, { NFCStatus, NFCInjectionKey } from "../composition/useNFC";

export default defineComponent({
  setup() {
    const { startReading, stopReading, is } = inject(NFCInjectionKey, useNFC());
    return { NFCStatus, startReading, stopReading, is };
  },
});
</script>
