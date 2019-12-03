const Bottleneck = require("./vendor/bottleneck");
const limiter = new Bottleneck({
  maxConcurrent: 5,
  minTime: 333
});

const api = require("./api");
const downloadingURLs = new Set();

// Warm up thumbnails in background,
// it makes opening the large image faster
exports.warmUp = thumbnails => {
  thumbnails.forEach(thumbnail => {
    if (api.cachedRawImageURL(thumbnail)) {
      return;
    }

    const task = () => api.fetchRawImageURL(thumbnail);
    limiter.schedule(task).then(async(imageURL) => {
      // Queue the task only if it isn't being downloaded
      if (!downloadingURLs.has(imageURL)) {
        downloadingURLs.add(imageURL);
        await api.downloadImage(imageURL);
        downloadingURLs.delete(imageURL);
      }
    });
  });
}