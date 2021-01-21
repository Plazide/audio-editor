<template>
  <div
    v-click-outside="onClose"
    class="context"
    tabindex="0"
    :style="{ top: position.y + 'px', left: position.x + 'px' }"
  >
    <button @click="onRemove">Remove</button>
    <button @click="onPlay">Play</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
const func = Function as PropType<() => void>;

export default defineComponent({
  name: "ContextMenu",
  props: {
    onRemove: {
      type: func,
      required: true
    },
    onClose: {
      type: func,
      required: true
    },
    onPlay: {
      type: func,
      required: true
    },
    position: {
      type: Object as PropType<{ x: number; y: number }>,
      required: true
    }
  },
  beforeMount() {
    document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "Escape") this.onClose();
    });
  }
});
</script>

<style scoped>
.context {
  position: fixed;
  background: #fff;
  width: 130px;
  box-shadow: 1px 2px 1px 1px rgba(0, 0, 0, 0.3);
  text-align: left;
}
.context button {
  padding: 0.3rem 0.5rem;
  width: 100%;
  text-align: inherit;
}
</style>
