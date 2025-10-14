
(function () {
  const requiredFiles = [
    "assets/image/image.js",
    "assets/audio/audio.js",
    "library/library.js",
    "source/source.js"
  ];

  window.__CORE_LOADED__ = false;

  function showBlockingOverlay(message) {
    try {
      const overlay = document.createElement('div');
      overlay.id = 'core-block-overlay';
      Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        backgroundColor: 'rgba(0,0,0,0.75)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif'
      });
      overlay.innerHTML = `<div><h2>Website is temporarily unavailable</h2><p>${escapeHtml(message)}</p></div>`;
      document.body.appendChild(overlay);
    } catch (e) {
      try { alert('FATAL: ' + message); } catch(e2) {}
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function blockWebsite(message) {
    console.error('Website Halted:', message);
    if (document && document.readyState !== 'loading') {
      showBlockingOverlay(message);
    } else {
      window.addEventListener('DOMContentLoaded', function () {
        showBlockingOverlay(message);
      });
    }
    window.__CORE_LOADED__ = false;
    throw new Error(message);
  }

  async function checkCoreIntegrity() {
    for (let file of requiredFiles) {
      try {
        const res = await fetch(file, { method: 'HEAD', cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`Missing file: ${file} (status ${res.status})`);
        }
      } catch (err) {
        blockWebsite(err.message || `Error fetching ${file}`);
        return;
      }
    }

    window.__CORE_LOADED__ = true;
    console.log('All required files are present. System integrity passed.');
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', checkCoreIntegrity);
  } else {
    checkCoreIntegrity();
  }
  
})();