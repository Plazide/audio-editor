<template>
  <section class="timeline" @mousemove="updateCursor">
    <div class="time">
      <span v-for="n in units" :key="n" class="unit">{{ n }}</span>
    </div>
    <Track
      v-for="track of tracks"
      :key="track"
      :v-bind="tracks"
      class="track"
      :dragging="dragging"
      :set-dragging="setDragging"
      :snapping="snapping"
      :track="track"
      :add-clip="addClip"
      :remove-clip="onRemoveClip"
      :update-clip="updateClip"
    />
    <!-- <div
      v-for="track of tracks"
      :key="track"
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
        :on-remove="onRemove"
      />
    </div> -->
    <div
      class="cursor"
      :style="{ transform: `translate(${cursorPos - 2}px)` }"
    ></div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Clip as IClip } from "../../types";
import Track from "./Track.vue";
const second = 20;

export default defineComponent({
  name: "Timeline",
  components: {
    Track
  },
  data: function() {
    return {
      units: Math.floor(document.body.clientWidth / second),
      cursorPos: 0,
      dragging: null as IClip | null,
      snapping: second,
      tracks: [
        {
          clips: [] as IClip[],
          id: 0
        },
        {
          clips: [] as IClip[],
          id: 1
        }
      ]
    };
  },
  methods: {
    addClip(trackId: number, clip: IClip) {
      console.log("Add Clip");
      const trackIndex = this.tracks.findIndex(track => track.id === trackId);
      const track = this.tracks.find(track => track.id === trackId);

      if (track) {
        track.clips = [...track.clips, clip];
        this.tracks.splice(trackIndex, 1, track);
      }
    },
    updateClip(clip: IClip) {
      const trackIndex = this.tracks.findIndex(track => {
        return !!track.clips.find(c => c.id === clip.id);
      });
      const clipIndex = this.tracks[trackIndex].clips.findIndex(
        c => c.id === clip.id
      );
      this.tracks[trackIndex].clips.splice(clipIndex, 1, clip);
    },
    updateCursor(e: MouseEvent) {
      if (!e.ctrlKey) return;
      const x = e.screenX;
      this.cursorPos = x;

      const clips = this.tracks.map(track => track.clips).flat();
      clips.forEach(clip => {
        const audio = clip.audio;

        if (x >= clip.start && x <= clip.start + clip.width) {
          const currentTime = Math.abs((clip.start - x) / second);
          if (audio.paused) audio.play();
          audio.currentTime = currentTime;
        } else {
          audio.pause();
        }
      });
    },
    setDragging(value: IClip | null) {
      this.dragging = value;
    },
    onRemoveClip(clip: IClip) {
      const trackIndex = this.tracks.findIndex(track => {
        const clips = track.clips;
        return clips.find(c => c.id === clip.id);
      });
      const clips = this.tracks[trackIndex].clips;

      this.tracks[trackIndex].clips = clips.filter(c => clip.id !== c.id);
    }
  }
});
</script>

<style scoped>
.timeline {
  height: 300px;
  min-width: 100%;
  background: #ccc;
  position: relative;

  display: flex;
  flex-direction: column;

  overflow: scroll;
}
.timeline .cursor {
  height: 100%;
  position: absolute;
  width: 1px;
  background: #000;
}
.timeline .time {
  display: inline-flex;
  flex-wrap: nowrap;
  padding: 0.5rem 0;

  border-bottom: 1px solid #000;
}
.timeline .time .unit {
  margin: 0;
  font-weight: 300;
  text-align: right;
  width: 20px;
  font-size: 10px;
  /* font-size: .9rem; */
}
</style>
