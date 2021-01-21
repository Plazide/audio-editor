<template>
  <section class="recordings">
    <h2 id="recordings-heading">Recordings</h2>
    <ul class="list" aria-describedby="recordings-heading">
      <Recording v-for="rec of recordings" :key="rec" :recording="rec" />
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Recording from "./Recording.vue";
import { Recording as IRecording } from "../types";

export default defineComponent({
  name: "Recordings",
  components: {
    Recording
  },
  props: {
    recordings: {
      type: Object as PropType<IRecording[]>,
      required: true
    }
  }
});
</script>

<style scoped>
.recordings {
  /* max-width: 650px; */
  height: 300px;
  padding: 2rem;
  border: 1px solid #ccc;
  /*   margin: 0; */
  /* margin-top: 50px; */
  background: #ccc;
  overflow-y: scroll;

  flex-basis: 50%;
}
.recordings h2 {
  margin-top: 0;
}
.recordings .list {
  padding: 0;
  margin: 0;
  list-style: none;

  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
