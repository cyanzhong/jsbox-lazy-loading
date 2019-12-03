const api = require("./api");
const thumb = require("./thumb");

exports.init = () => {

  $ui.render({
    views: [
      {
        type: "matrix",
        props: {
          id: "thumnails",
          columns: 4, spacing: 4, square: true,
          template: [
            {
              type: "image",
              props: {
                id: "image",
                bgcolor: $color("#F0F0F0")
              },
              layout: $layout.fill
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath, data) => {
            if (data.image.info) {
              // Retrieve the data from 'info'
              const name = data.image.info.name;
              const viewer = require("./viewer");
              viewer.open(name);
            } else {
              // If the info isn't ready, you can fetch it manually here
              // But it's unnecessary if cache is provided
            }
          }
        }
      }
    ]
  });

  // The initial reloading, creates placeholders
  reloadData();

  // Fetch all pages
  fetchPages();
}

async function fetchPages() {
  const baseURL = "";
  let pageIndex = thumb.initialIndex;

  // This fetches page 1, 2, 3... in order
  // You can also send concurrent requests,
  // but you have to manage dummy cells more carefully (see thumb.js)
  while (true) {
    // This loads cache first,
    // if you want to update thumbnails every time,
    // you can do it in background without calling 'reloadData'
    const thumbnails = await api.fetchThumbnails(baseURL, pageIndex++);
    if (thumbnails == null) {
      // Ended
      break;
    } else {
      thumb.push(thumbnails);

      // Reload cells when new data comes
      reloadData();
    }
  }
}

function reloadData() {
  // Let's say we want to show 1000 items,
  // you can figure out its value
  const data = thumb.build(1000);
  const view = $("thumnails");
  // Render views, this is performant because it only reloads visible cells
  view.data = data;
}