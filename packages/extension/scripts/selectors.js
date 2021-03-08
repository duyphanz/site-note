function query(selector) {
  return document.querySelector(selector);
}

function getSelector(selector, returnSelector = false) {
  if (returnSelector) return selector;
  return query(selector);
}

function getLayer(returnSelector) {
  return getSelector(".site-note-layout", returnSelector);
}

function getCreateNoteButton(returnSelector) {
  return getSelector(".site-note-create-note-button", returnSelector);
}

var SN_SELECTORS = {
  getLayer,
  getCreateNoteButton,
};
