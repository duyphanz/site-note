document.querySelector("html").insertAdjacentHTML("beforeend", htmlElement);

document.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    SN_SELECTORS.getLayer().remove();
  }
});

document.addEventListener("scroll", () => {
  const { scrollX, scrollY } = window;

  notes.forEach(({ note, x, y }) => {
    note.style.top = +y.slice(0, -2) - scrollY + "px";
    note.style.left = +x.slice(0, -2) - scrollX + "px";
  });
});

// add event listeners
addEvent(
  SN_SELECTORS.getLayer(true),
  (el, evt) => {
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
  },
  "mousedown"
);
addEvent(SN_SELECTORS.getCreateNoteButton(true), () =>
  togglePlacingNoteState()
);

function togglePlacingNoteState() {
  SN_SELECTORS.getLayer().classList.toggle("crosshair");
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
    if (new Date() - clickTime < 200) {
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
  SN_SELECTORS.getLayer().appendChild(note);
  noteIndex++;

  return note;
}
