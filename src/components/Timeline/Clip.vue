<template>
  <img
    :key="clip"
    :style="clip.styles"
    :width="clip.width"
    :src="clip.imageSrc"
    :data-clip-id="clip.id"
    class="clip"
    @dragstart="handleClipDrag"
    @dragend="handleDragEnd"
    @contextmenu="handleContextMenu"
  />
  <ContextMenu
    v-if="context.show"
    :on-remove="() => onRemove(clip)"
    :on-close="onCloseContext"
    :on-play="onPlay"
    :position="context.position"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import ContextMenu from "./ContextMenu.vue";
import { Clip as IClip } from "../../types";

export default defineComponent({
  name: "Clip",
  components: {
    ContextMenu
  },
  props: {
    clip: {
      type: Object as PropType<IClip>,
      required: true
    },
    setDragging: {
      type: Function as PropType<(value: IClip | null) => void>,
      required: true
    },
    onRemove: {
      type: Function as PropType<(clip: IClip) => void>,
      required: true
    }
  },
  data() {
    return {
      context: {
        show: false,
        position: {
          x: 0,
          y: 0
        }
      }
    };
  },
  methods: {
    onPlay() {
      this.clip.audio.play();
    },
    handleClipDrag(e: DragEvent) {
      const target = e.currentTarget as HTMLImageElement;
      const clip = this.clip;
      if (!clip) throw Error("Id does not correspond to clip.");

      const targetOffset = target.offsetLeft;
      const dragOffset = e.screenX - targetOffset;

      target.style.visibility = "hidden";
      clip.element = target;
      clip.dragOffset = dragOffset;

      this.setDragging(clip);
    },
    handleDragEnd() {
      this.setDragging(null);
    },
    handleContextMenu(e: MouseEvent) {
      e.preventDefault();
      const position = { y: e.pageY, x: e.screenX };
      console.log(position);
      this.context.show = true;
      this.context.position = position;
    },
    onCloseContext() {
      this.context.show = false;
    }
  }
});
</script>

<style scoped>
.clip {
  position: absolute;
  background: rgba(170, 170, 170, 0.534);
  cursor: move;

  border-radius: 3px;
}
.clip:active {
  border: 1px dotted #000;
  cursor: move;
}
</style>
