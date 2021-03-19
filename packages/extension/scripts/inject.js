let currentNote = "";

document.querySelector("html").insertAdjacentHTML("beforeend", htmlElement);

// Listen for background script messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const { type, payload } = msg;

  switch (type) {
    case SN_MESSAGES.SUBMIT_NOTE:
      SN_SELECTORS.getLoader().classList.add("visibility");
      break;
    case SN_MESSAGES.FETCH_NOTE:
      if (payload && payload.note) {
        SN_SELECTORS.getTextEditor().innerHTML = payload.note;
        currentNote = payload.note;
      }
      SN_SELECTORS.getLoader().classList.add("visibility");
      break;
  }
});

addEvent(".sn-bold-handler", () => formatTextEditor("bold"));
addEvent(".sn-italic-handler", () => formatTextEditor("italic"));
addEvent(".sn-underline-handler", () => formatTextEditor("underline"));

addEvent(
  SN_SELECTORS.getToggleButton(true),
  () => {
    const container = SN_SELECTORS.getLayer();
    if (!container.classList.contains("show") && !currentNote) {
      sendMessage({
        type: SN_MESSAGES.FETCH_NOTE,
        payload: { link: encodeURIComponent(window.location.href) },
      });
    }

    container.classList.toggle("show");
  },
  "mouseover"
);

addEvent(SN_SELECTORS.getSaveButton(true), () => {
  submitNote();
});

function submitNote() {
  const note = SN_SELECTORS.getTextEditor().innerHTML;

  if (note) {
    currentNote = note;
    SN_SELECTORS.getLoader().classList.remove("visibility");

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
