function query(selector) {
  return document.querySelector(selector);
}

function getSelector(selector, returnSelector = false) {
  if (returnSelector) return selector;
  return query(selector);
}

function getLayer(returnSelector) {
  return getSelector(".sn-layout", returnSelector);
}

function getToggleButton(returnSelector) {
  return getSelector(".sn-toggle-button", returnSelector);
}

function getTextEditor(returnSelector) {
  return getSelector(".sn-text-editor", returnSelector);
}

function getSaveButton(returnSelector) {
  return getSelector(".sn-save-button", returnSelector);
}

var SN_SELECTORS = {
  getLayer,
  getToggleButton,
  getTextEditor,
  getSaveButton,
};
