import { createApp, DirectiveBinding } from "vue";
import App from "./App.vue";

function clickOutside(
  e: MouseEvent,
  el: HTMLElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  binding: DirectiveBinding<any>
) {
  const target = e.currentTarget as HTMLElement;
  if (!(el === target || el.contains(target))) {
    binding.value(e, el);
  }
}

createApp(App)
  .directive("click-outside", {
    beforeMount(el: HTMLElement, binding) {
      document.body.addEventListener("click", e =>
        clickOutside(e, el, binding)
      );
    },
    unmounted(el, binding) {
      document.body.removeEventListener("click", e =>
        clickOutside(e, el, binding)
      );
    }
  })
  .mount("#app");
