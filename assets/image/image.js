// System Image Handler
(function(){
  const __imgCache = {};

  function preloadImage(path) {
    const img = new Image();
    img.src = path;
    __imgCache[path] = img;
  }

  console.log("Image module initialized");

  // TODO: Integrate with future CDN image caching
})();