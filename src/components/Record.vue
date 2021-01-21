<template>
  <section class="record">
    <canvas id="canvas"></canvas>
    <button
      id="recordstop"
      class="record"
      aria-label="Record"
      @click="toggleRecord"
    >
      {{ action }}
    </button>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { getDuration, visualize, createStaticWaveForm } from "../util";
import { Recording } from "../types";
let recorder: MediaRecorder;

export default defineComponent({
  props: {
    pushRecording: {
      type: Function as PropType<(rec: Recording) => void>,
      required: true
    }
  },
  data: function() {
    return { action: "Record" };
  },
  methods: {
    toggleRecord: function(e: MouseEvent) {
      const action = this.action;
      const target = e.currentTarget as HTMLButtonElement;
      const parent = target.parentElement as HTMLDivElement;

      function toggle() {
        target.classList.toggle("record");
        target.classList.toggle("stop");
      }

      if (action === "Record") {
        this.action = "Stop";
        toggle();
        this.record(parent);
      } else {
        this.action = "Record";
        toggle();
        recorder.stop();
      }
    },
    async record(container: HTMLDivElement | null) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      recorder = new MediaRecorder(stream);
      recorder.addEventListener("dataavailable", this.handleData);

      if (container)
        recorder.addEventListener("start", () => visualize(stream, container));

      recorder.start();
    },
    async handleData(e: BlobEvent) {
      const data = e.data;
      const duration = await getDuration(data);
      const imageSrc = await createStaticWaveForm(data);
      const audioSrc = URL.createObjectURL(data);
      console.log("Stop");

      this.pushRecording({
        data,
        imageSrc,
        audioSrc,
        duration,
        timestamp: Date.now()
      });
    }
  }
});
</script>

<style scoped>
section.record {
  height: 300px;
  width: 50%;
  position: relative;

  background: #1b1b1b;

  display: grid;
  place-items: center;
}
#recordstop {
  width: 60px;
  height: 60px;
  background: #f33333;
  box-shadow: 0 2px 4px 4px #ff000025;
  z-index: 1001;
  text-transform: uppercase;

  transition: border-radius 50ms linear;
}
#recordstop.record {
  border-radius: 50%;
}
#canvas {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
