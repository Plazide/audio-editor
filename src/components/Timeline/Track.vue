<template>
  <div
    class="track"
    :data-track-id="track.id"
    @drop="handleDrop"
    @dragover="handleDragOver"
  >
    <Clip
      v-for="clip of track.clips"
      :key="clip"
      :clip="clip"
      :set-dragging="setDragging"
      :on-remove="removeClip"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Clip from "./Clip.vue";
import { Clip as IClip, Track as ITrack } from "../../types";
import { second } from "../../util";

export default defineComponent({
  name: "Track",
  components: {
    Clip
  },
  props: {
    dragging: {
      type: Object as PropType<IClip>,
      required: true
    },
    setDragging: {
      type: Function as PropType<(clip: IClip | null) => void>,
      required: true
    },
    snapping: {
      type: Number as PropType<number>,
      required: true
    },
    track: {
      type: Object as PropType<ITrack>,
      required: true
    },
    addClip: {
      type: Function as PropType<(trackId: number, clip: IClip) => void>,
      required: true
    },
    removeClip: {
      type: Function as PropType<(clip: IClip) => void>,
      required: true
    },
    updateClip: {
      type: Function as PropType<(clip: IClip) => void>,
      required: true
    }
  },
  methods: {
    handleDrop(e: DragEvent) {
      const x = e.screenX;

      // If the user is dragging a clip within a track, we don't have to do anything,
      // The position is updated withing the dragOver handler.
      if (this.dragging) {
        const draggedClip = { ...this.dragging };
        draggedClip.start = x - (this.dragging.dragOffset || 0);
        this.updateClip(draggedClip);
        /* this.setDragging(draggedClip); */
        return;
      }

      const data = sessionStorage.getItem("dragData");
      if (!data) throw Error("Drag data does not exist");

      const target = e.currentTarget as HTMLDivElement;
      const trackId = target.getAttribute("data-track-id");
      const { imageSrc, audioSrc, duration, id } = JSON.parse(data);
      const audio = new Audio();
      audio.src = audioSrc;
      const clip: IClip = {
        audio,
        imageSrc,
        duration,
        start: x,
        width: duration * second,
        styles: {
          left: x + "px"
        },
        id
      };

      if (trackId) this.addClip(this.track.id, clip);
    },
    handleDragOver(e: DragEvent) {
      e.preventDefault();

      if (!this.dragging) return;
      const draggedClip = { ...this.dragging };
      const clip = this.findClip(draggedClip.id);

      if (clip && draggedClip.element) {
        const x = e.screenX;
        const newPos = x - (clip.dragOffset || 0);

        if (newPos > 0 && newPos % this.snapping === 0) {
          draggedClip.element.style.visibility = "visible";
          clip.styles.left = `${newPos}px`;
          this.setDragging(draggedClip);
        }
      }
    },
    findClip(id: string | number | null) {
      const clips = this.track.clips; // this.tracks.map(track => track.clips).flat();
      const clip = clips.find(clip => clip.id === parseInt("" + id || "0"));

      return clip;
    }
  }
});
</script>

<style scoped>
.track {
  height: 100px;
  width: 100%;
  background: #f0f0f0;
  border-bottom: 1px dashed #000;
}
.track:nth-child(odd) {
  background: rgb(216, 216, 216);
}
</style>
