noteIndex = 1;
notes = [];

layer = document.createElement("div");
layer.setAttribute("class", "site-note-layout");
document.body.appendChild(layer);

layer.onmousedown = (evt) => {
  const { pageX, pageY } = evt;
  if (evt.target.className && evt.target.className.startsWith("site-note "))
    return;

  const note = createNote(pageX, pageY);
  const { top, left } = note.style;
  notes.push({ note, x: left, y: top });
};

document.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    layer.remove();
  }
});

document.addEventListener("scroll", (evt) => {
  const { scrollX, scrollY } = window;
  notes.forEach(({ note, x, y }) => {
    note.style.top = +y.slice(0, -2) - scrollY + "px";
    note.style.left = +x.slice(0, -2) - scrollX + "px";
  });
});

function createNote(x, y) {
  const { scrollX, scrollY } = window;

  const note = document.createElement("div");
  note.innerText = noteIndex;
  note.setAttribute("class", `site-note note-index-${noteIndex++}`);
  note.setAttribute(
    "style",
    `top:${y - scrollY - 10}px;left:${x - scrollX - 10}px`
  );

  addDnD(note);
  layer.appendChild(note);

  return note;
}

function addDnD(ref) {
  ref.onmousedown = function (event) {
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
