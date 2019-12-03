// Indices before this value can be skipped
let initialIndex = 0;

// Resolved thumbnails
const data = (() => {
  const cache = require("./cache");
  const cached = cache.thumbnailURLCache();

  const result = [];
  for (let index=0; ; ++index) {
    const page = cached[index];
    if (page) {
      result.push(...page);
    } else {
      initialIndex = index;
      break;
    }
  }

  return result;
})();

exports.initialIndex = initialIndex;

// Build view model with a fixed length
// For positions which have a thumbnail URL, uses the URL
// Otherwise, it uses an empty image
exports.build = length => {
  const results = [];
  for (let idx=0; idx<length; ++idx) {
    const item = data[idx];
    if (item == null) {
      // Thumb url is not ready
      results.push({
        image: {
          // This clears the image when a cell is being reused,
          // you can also use a placeholder image
          image: null
        }
      });
    } else {
      // Thumb url is ready
      results.push({
        image: {
          // If you want to use downloaded images,
          // use the 'image' property instead
          source: {
            url: `https://github.com/cyanzhong/sf-symbols-online/raw/master/glyphs/${item}.png`,
            header: {
              // Your custom header goes here
            }
          },
          info: {
            name: item // Info that can be used when tapping on it
          }
        }
      })
    }
  }
  return results;
}

// When new thumbnails come,
// append them to the array's end
exports.push = thumbnails => {
  data.push(...thumbnails);

  // Fetch large URLs in background
  const fullsize = require("./fullsize");
  fullsize.warmUp(data);
}