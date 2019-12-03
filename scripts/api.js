const cache = require("./cache");

// All pages, fake data
const pages = JSON.parse($file.read("assets/pages.json").string);
// All large images, fake data
const mapping = JSON.parse($file.read("assets/mapping.json").string);
// Resolved thumbnail URLs
const thumbnailURLCache = cache.thumbnailURLCache();
// Resolved large image URLs
const rawImageURLCache = cache.rawImageURLCache();

function cachedThumbnailURLs(index) {
  return thumbnailURLCache[index];
}

function cachedRawImageURL(url) {
  return rawImageURLCache[url];
}

exports.cachedRawImageURL = cachedRawImageURL;

exports.fetchThumbnails = async(baseURL, index=0) => {
  const cached = cachedThumbnailURLs(index);
  if (cached) {
    return cached;
  }

  // Delay 1s to simulate a request
  await $wait(1);
  const page = pages[index];
  if (page) {
    thumbnailURLCache[index] = page;
    cache.saveThumbnailURLCache(thumbnailURLCache);
    return page;
  }

  // Finished fetching all pages,
  // In real world, you know whether it's the last page
  return null;
}

exports.fetchRawImageURL = async(url) => {
  const cached = cachedRawImageURL(url);
  if (cached) {
    return cached;
  }

  // const {data} = await $http.get(url);
  // const match = data.match(/http[^"]+keystamp=[^"]+/);
  // return match ? match[0] : null;

  // Delay 1s to simulate a request
  await $wait(1);

  // Fake data, there are only ~10 large images
  const rawImageURL = mapping[url];
  rawImageURLCache[url] = rawImageURL;
  cache.saveRawImageURLCache(rawImageURLCache);
  return rawImageURL;
}

exports.downloadImage = async(url) => {
  const cached = cache.getImage(url);
  if (cached) {
    return cached;
  }

  const params = {
    url: url,
    showsProgress: false,
    header: {
      // You custom header goes here
    }
  };

  const {data} = await $http.download(params);
  if (data) {
    cache.saveImage(data, url);
  }
  return data;
}