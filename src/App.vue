<template>
  <Header />
  <Timeline />
  <div class="record-container">
    <Record :push-recording="pushRecording" />
    <Recordings :recordings="recordings" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "./components/Header.vue";
import Record from "./components/Record.vue";
import Timeline from "./components/Timeline/Timeline.vue";
import Recordings from "./components/Recordings.vue";
import { Recording } from "./types";

const recordings: Recording[] = [];

export default defineComponent({
  name: "App",
  components: {
    Header,
    Record,
    Timeline,
    Recordings
  },
  data() {
    return {
      recordings
    };
  },
  methods: {
    pushRecording(rec: Recording) {
      this.recordings.push(rec);
    }
  }
});
</script>

<style>
body {
  font-size: 18px;
  font-family: "Arial", sans-serif;
  padding: 0;
  margin: 0;
}
* {
  box-sizing: border-box;
}
button {
  background: none;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  cursor: pointer;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.record-container {
  display: flex;
  align-items: flex-start;
}
</style>
