noteIndex = 1;
notes = [];

layer = document.createElement("div");
layer.setAttribute("class", "site-note-layout");
document.body.appendChild(layer);

layer.onmousedown = (evt) => {
  const { pageX, pageY } = evt;
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

  layer.appendChild(note);

  return note;
}
