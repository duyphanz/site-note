document.querySelector("html").insertAdjacentHTML("beforeend", htmlElement);

addEvent(".sn-bold-handler", () => formatTextEditor("bold"));
addEvent(".sn-italic-handler", () => formatTextEditor("italic"));
addEvent(".sn-underline-handler", () => formatTextEditor("underline"));

addEvent(SN_SELECTORS.getToggleButton(true), () => {
  SN_SELECTORS.getLayer().classList.toggle("show");
});

addEvent(
  SN_SELECTORS.getTextEditor(true),
  () => {
    SN_SELECTORS.getLayer().classList.toggle("show");
  },
  "blur"
);

// methods
function formatTextEditor(command, value) {
  document.execCommand(command, false, value);
}
