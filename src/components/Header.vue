<template>
  <header>
    <span class="wordmark">Audio Recorder</span>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Header"
});
</script>

<style scoped>
header {
  height: 60px;
  width: 100%;
  padding: 0.5rem 4rem;

  display: flex;
  align-items: center;
}
header .wordmark {
  color: #f33333;
  font-weight: bold;
  font-size: 1.4rem;
}
</style>
