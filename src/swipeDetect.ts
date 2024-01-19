export const swipeDetect = (
  el: HTMLElement,
  callback: (event: DirectionalEvent) => void,
) => {
  const surface = el;
  let startX = 0;
  let startY = 0;
  let distX = 0;
  let distY = 0;

  surface.addEventListener("touchstart", function (e) {
    startX = e.changedTouches[0].pageX;
    startY = e.changedTouches[0].pageY;
  });

  surface.addEventListener("touchmove", function (e) {
    e.preventDefault();
  });

  surface.addEventListener("touchend", function (e) {
    distX = e.changedTouches[0].pageX - startX;
    distY = e.changedTouches[0].pageY - startY;

    if (Math.abs(distX) > Math.abs(distY)) {
      if (distX > 0) {
        callback({ key: "ArrowRight" });
      } else {
        callback({ key: "ArrowLeft" });
      }
    } else {
      if (distY > 0) {
        callback({ key: "ArrowDown" });
      } else {
        callback({ key: "ArrowUp" });
      }
    }
  });
};
