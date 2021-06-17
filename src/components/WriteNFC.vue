<template>
    <va-card>
      <va-card-content>
        <div class="gutter--xl">
          <va-button @click="writeNFC"> Write </va-button>
          <va-button @click="writeURL"> Write URL </va-button>
          <va-button @click="writeEmpty"> Write Empty </va-button>
          <va-button @click="abortWrite"> Abort Write </va-button>
        </div>
        <div>{{ latestWrite }}</div>
      </va-card-content>
    </va-card>
</template>
<script lang="ts">
import { defineComponent, inject } from "vue";
import useNFC, { NFCInjectionKey } from "../composition/useNFC";

export default defineComponent({
  setup() {
    const { write, latestWrite } = inject(NFCInjectionKey, useNFC());

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

    return {
      writeNFC,
      writeURL,
      writeEmpty,
      latestWrite
    }
  },
});
</script>
