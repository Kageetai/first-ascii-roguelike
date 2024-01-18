export const swipeDetect = (el: HTMLElement) => {
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

    console.log("touchend", e);

    if (Math.abs(distX) > Math.abs(distY)) {
      if (distX > 0) {
        console.log("swipe right");
      } else {
        console.log("swipe left");
      }
    } else {
      if (distY > 0) {
        console.log("swipe down");
      } else {
        console.log("swipe up");
      }
    }
  });
};
