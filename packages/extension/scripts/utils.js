function addEvent(selector, callback, eventName) {
  const element = document.querySelector(selector);
  element.addEventListener(eventName || "click", (event) => {
    callback(element, event);
  });
}
