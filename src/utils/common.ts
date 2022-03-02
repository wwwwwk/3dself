/**
 * @desc 防抖
 * @param func 目标函数
 * @param wait 延迟执行毫秒数
 * @param immediate true - 立即执行， false - 延迟执行
 */
function debounce(func: any, wait: number, immediate = true) {
  let timer: any;
  return function () {
    // @ts-ignore
    const context = this;
    const args = arguments; // eslint-disable-line

    if (timer) clearTimeout(timer);
    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timer = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  };
}

/**
 * @desc 节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
function throttle(func: any, wait: number) {
  let previous = 0;
  return function () {
    const now = Date.now();
    // @ts-ignore
    const context = this;
    const args = arguments; // eslint-disable-line
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}

export { debounce, throttle };
