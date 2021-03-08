function addEvent(selector, callback, eventName) {
  const element = document.querySelector(selector);
  element.addEventListener(eventName || "click", (event) => {
    callback(element, event);
  });
}

function addDnD(ref) {
  ref.onmousedown = function (event) {
    clickTime = new Date();

    if (event.target.nodeName === "INPUT") return;
    let shiftX = event.clientX - ref.getBoundingClientRect().left;
    let shiftY = event.clientY - ref.getBoundingClientRect().top;

    moveAt(event.pageX, event.pageY);

    // moves the div at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
      const { scrollX, scrollY } = window;
      ref.style.left = pageX - shiftX - scrollX + "px";
      ref.style.top = pageY - shiftY - scrollY + "px";

      const index = notes.findIndex(({ note }) => note === ref);
      notes[index] = {
        note: ref,
        x: pageX - shiftX + "px",
        y: pageY - shiftY + "px",
      };
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    // move the div on mousemove
    document.addEventListener("mousemove", onMouseMove);

    // drop the div, remove unneeded handlers
    ref.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      ref.onmouseup = null;
    };
  };

  ref.ondragstart = function () {
    return false;
  };
}
