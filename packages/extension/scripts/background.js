// Listen for content script message
chrome.runtime.onMessage.addListener(function (message, sender, response) {
  const { type, payload } = message;

  function submitNote(response) {
    console.log("Created note succesfully");
  }

  switch (type) {
    case SN_MESSAGES.SUBMIT_NOTE:
      chrome.identity.getProfileUserInfo(function (info) {
        const { note, link } = payload;
        const noteItem = {
          note,
          link,
          email: info.email,
        };

        makeRequest(submitNote, {
          path: "/dev/note",
          options: { method: "POST", body: JSON.stringify(noteItem) },
        });
      });
      break;
  }
});

function makeRequest(
  callback,
  {
    endpoint = "https://skh5jyyse7.execute-api.ap-southeast-1.amazonaws.com",
    path = "",
    options = {},
  }
) {
  return fetch(endpoint + path, {
    method: "GET",
    ...options,
  })
    .then((response) => response.json())
    .then((json) => callback(json))
    .catch((err) => {
      console.log(err);
      callback({});
    });
}
