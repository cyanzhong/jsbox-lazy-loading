const folder = "cache";
const paths = {
  thumbnails: `${folder}/thumbnails.json`,
  rawImageURLCache: `${folder}/fullsize-urls.json`
}

exports.init = () => {
  if (!$file.exists(folder)) {
    $file.mkdir(folder);
  }
}

exports.getImage = url => {
  const path = fileHashPath(url);
  return $file.read(path);
}

exports.saveImage = (data, url) => {
  const path = fileHashPath(url);
  $file.write({
    data: data,
    path: path
  });
}

// Note: these cache methods are pretty weak,
// you should think about writing better ones
exports.thumbnailURLCache = () => {
  return getJSON(paths.thumbnails);
}

exports.saveThumbnailURLCache = cache => {
  saveJSON(cache, paths.thumbnails);
}

exports.rawImageURLCache = () => {
  return getJSON(paths.rawImageURLCache);
}

exports.saveRawImageURLCache = cache => {
  saveJSON(cache, paths.rawImageURLCache);
}

// Helpers
function getJSON(path) {
  if ($file.exists(path)) {
    const file = $file.read(path);
    return JSON.parse(file.string) || {};
  } else {
    return {};
  }
}

function saveJSON(json, path) {
  const data = $data({
    string: JSON.stringify(json)
  });
  $file.write({
    path: path,
    data: data
  });
}

function fileHashPath(url) {
  return `${folder}/${$text.MD5(url)}`;
}