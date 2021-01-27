layer = document.createElement("div");
layer.setAttribute("class", "site-note-layout");

document.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    layer.remove();
  }
});

document.body.appendChild(layer);
