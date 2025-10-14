// Audio System Bridge
(function(){
  const __audioRegistry = [];

  function registerSound(id, src) {
    __audioRegistry.push({ id, src });
  }

  console.log("Audio engine loaded");

  // TODO: Add 3D spatial audio context and volume normalization
})();