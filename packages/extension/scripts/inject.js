document.querySelector("html").insertAdjacentHTML("beforeend", htmlElement);

addEvent(".sn-bold-handler", () => formatTextEditor("bold"));
addEvent(".sn-italic-handler", () => formatTextEditor("italic"));
addEvent(".sn-underline-handler", () => formatTextEditor("underline"));

addEvent(
  SN_SELECTORS.getToggleButton(true),
  () => {
    SN_SELECTORS.getLayer().classList.add("show");
  },
  "mouseover"
);

addEvent(SN_SELECTORS.getToggleButton(true), () => {
  SN_SELECTORS.getLayer().classList.remove("show");
});

addEvent(SN_SELECTORS.getSaveButton(true), () => {
  submitNote();
});

function submitNote() {
  const note = SN_SELECTORS.getTextEditor().innerHTML;
  console.log("🚀 ~ file: inject.js ~ line 25 ~ submitNote ~ note", note);

  if (note) {
    sendMessage({
      type: SN_MESSAGES.SUBMIT_NOTE,
      payload: { note, link: encodeURIComponent(window.location.href) },
    });
  }
}

// methods
function formatTextEditor(command, value) {
  document.execCommand(command, false, value);
}

function sendMessage(msg) {
  chrome.runtime.sendMessage(msg);
}
