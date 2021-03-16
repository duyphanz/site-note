document.querySelector("html").insertAdjacentHTML("beforeend", htmlElement);

addEvent(SN_SELECTORS.getToggleButton(true), () => {
  SN_SELECTORS.getLayer().classList.toggle("show");
});
