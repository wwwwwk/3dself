import { ref, readonly } from "vue";

const usePopupShowState = () => {
  const popupShowState = ref(false);

  const setPopupShowState = (payload: boolean) => {
    popupShowState.value = payload;
  };

  return { popupShow: readonly(popupShowState), setPopupShowState };
};

export { usePopupShowState };
