const api = require("./api");

// Display large image with pinch-to-zoom gestures
exports.open = name => {

  $ui.push({
    props: {
      title: name
    },
    views: [
      {
        type: "scroll",
        props: {
          zoomEnabled: true
        },
        layout: $layout.fill,
        views: [
          {
            type: "image",
            props: {
              id: "fullsize"
            },
            layout: $layout.fill
          }
        ]
      }
    ]
  });
  
  reloadData(name);
}

// If the image index that you want to display is changed,
// call this again with the new name
async function reloadData(name) {
  const url = await api.fetchRawImageURL(name);
  const file = await api.downloadImage(url);
  if (file) {
    const fullView = $("fullsize");
    fullView.image = $image(file);
  } else {
    // Handle errors
  }
}