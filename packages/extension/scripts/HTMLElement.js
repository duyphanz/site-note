var htmlElement = `
  <div class="sn sn-layout">
    <button class="sn sn-toggle-button">+</button>
    <div class="sn sn-text-editor-container">
      <div class="sn sn-text-editor-toolbar">
        <a href="javascript:void(0)" class="sn sn-text-editor-handler sn-bold-handler"><strong>B</strong></a>
        <a href="javascript:void(0)" class="sn sn-text-editor-handler sn-italic-handler"><i>I</i></a>
        <a href="javascript:void(0)" class="sn sn-text-editor-handler sn-underline-handler"><u>U</u></a>

        <button type="button" class="sn sn-close-text-editor-button"></button>
      </div>
      <div class="sn-text-editor" contenteditable="true"></div>
    </div>
  </div>
`;
