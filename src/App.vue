<template>
  <div>{{ hasNFC() }}</div>
</template>

<script lang="ts">
/// <reference path="web-nfc.d.ts" />

import { defineComponent } from "vue";
import useNFC from "./composition/useNFC";

export default defineComponent({
  name: "App",
  components: {},
  setup() {

  },
  methods: {
    hasNFC() {
      return "NDEFReader" in window;
    },
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
