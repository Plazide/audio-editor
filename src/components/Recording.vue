<template>
  <li class="recording" draggable="true" @dragstart="handleDrag">
    <img :src="recording.imageSrc" width="200" height="100" draggable="false" />
    <audio :src="recording.audioSrc" controls></audio>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Recording } from "../types";
import { createStaticWaveForm, second } from "@/util";

export default defineComponent({
  name: "Recording",
  props: {
    recording: {
      type: Object as PropType<Recording>,
      required: true
    }
  },
  methods: {
    async handleDrag(e: DragEvent) {
      e.stopImmediatePropagation();
      console.log("Start drag");
      const target = e.target as HTMLImageElement;
      const data = this.recording.data;
      const duration = this.recording.duration;
      const imageSrc = await createStaticWaveForm(data, duration * second, 100);
      const audioSrc = this.recording.audioSrc;
      if (!e.dataTransfer) throw Error("DataTransfer not found");

      e.dataTransfer.setDragImage(target, 0, 0);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";

      sessionStorage.setItem(
        "dragData",
        JSON.stringify({
          imageSrc,
          audioSrc,
          duration,
          id: Date.now()
        })
      );
    }
  }
});
</script>

<style scoped>
.recording {
  background: #f9f9f9;

  display: flex;
  flex-direction: column;
}
.recording img {
  display: block;
  width: 200px;
  margin: auto;
}
</style>
