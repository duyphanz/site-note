noteIndex = 1;
notes = [];
isPlacingNote = false;
clickTime = null;

layer = document.createElement("div");
layer.setAttribute("class", "site-note-layout");

createNoteButton = document.createElement("button");
createNoteButton.innerText = "+";
createNoteButton.setAttribute("class", "site-note-create-note-button");
createNoteButton.onclick = (evt) => {
  togglePlacingNoteState();
};

layer.appendChild(createNoteButton);

// render layout
document.body.appendChild(layer);

layer.onmousedown = (evt) => {
  const { pageX, pageY } = evt;
  if (
    !isPlacingNote ||
    (evt.target.className &&
      (evt.target.className.startsWith("site-note ") ||
        evt.target.className.startsWith("site-note-text") ||
        evt.target.className.startsWith("site-note-button"))) ||
    evt.target.className.startsWith("site-note-create-note-button")
  )
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

function togglePlacingNoteState() {
  layer.classList.toggle("crosshair");
  isPlacingNote = !isPlacingNote;
}

function createNote(x, y) {
  togglePlacingNoteState();
  const { scrollX, scrollY } = window;

  const note = document.createElement("div");
  note.innerText = noteIndex;
  note.setAttribute("class", `site-note note-index-${noteIndex}`);
  note.setAttribute(
    "style",
    `top:${y - scrollY - 10}px;left:${x - scrollX - 10}px`
  );

  addDnD(note);

  const textWrapper = document.createElement("div");
  textWrapper.setAttribute(
    "class",
    `site-note-text-wrapper note-index-${noteIndex}`
  );

  note.onclick = (evt) => {
    if (new Date() - clickTime < 150) {
      if (
        evt.target.className &&
        evt.target.className.startsWith("site-note-text-area ")
      )
        return;

      textWrapper.classList.toggle("hidden");
    }
  };

  const textArea = document.createElement("textarea");
  textArea.setAttribute("class", `site-note-text-area note-index-${noteIndex}`);

  const closedButton = document.createElement("button");
  closedButton.innerHTML = "&times;";
  closedButton.setAttribute(
    "class",
    `site-note-button site-note-closed-button note-index-${noteIndex}`
  );
  closedButton.onclick = () => {
    note.remove();
  };

  const acceptButton = document.createElement("button");
  acceptButton.innerHTML = "&#43;";
  acceptButton.setAttribute(
    "class",
    `site-note-button site-note-accept-button note-index-${noteIndex}`
  );
  acceptButton.onclick = () => {
    const index = notes.findIndex(
      ({ note: existedNote }) => note === existedNote
    );
    notes[index] = {
      ...notes[index],
      text: "acb",
    };
    textWrapper.classList.toggle("hidden");
  };

  textWrapper.appendChild(textArea);
  textWrapper.appendChild(closedButton);
  textWrapper.appendChild(acceptButton);
  note.appendChild(textWrapper);
  layer.appendChild(note);
  noteIndex++;

  return note;
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
