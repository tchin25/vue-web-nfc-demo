<template>
  <va-card>
    <va-card-content>
      <va-button class="ma-1" @click="writeNFC"> Write Text </va-button>
      <va-button class="ma-1" @click="writeURL"> Write URL </va-button>
      <va-button class="ma-1" @click="writeEmpty"> Write Empty </va-button>
      <va-button class="ma-1" @click="abortWrite"> Abort Write </va-button>
      <div>Latest Write: {{ latestWrite || `N/A` }}</div>
    </va-card-content>
  </va-card>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import useNFC from "../composition/useNFC";

export default defineComponent({
  setup() {
    const { write, latestWrite, abortWrite } = useNFC();

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
      latestWrite,
      abortWrite,
    };
  },
});
</script>
