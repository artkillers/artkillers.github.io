(function () {
  const requiredFiles = [
    "assets/image/image.js",
    "assets/audio/audio.js",
    "library/library.js",
    "source/source.js"
  ];

  window.__CORE_LOADED__ = false;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function showBlockingOverlay(message) {
    try {
      const root = getComputedStyle(document.documentElement);
      const color = root.getPropertyValue("--color").trim();
      const gradient = root.getPropertyValue("--gradient").trim();
      const font = root.getPropertyValue("--font").trim();
      const radius = root.getPropertyValue("--radius").trim();
      const shadow = root.getPropertyValue("--outer").trim();

      const overlay = document.createElement("div");
      overlay.id = "core-block-overlay";
      Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        fontFamily: font,
        color: color,
        background: gradient,
        transition: "all 0.4s ease",
        animation: "fadeIn 0.6s ease forwards",
      });

      overlay.innerHTML = `
        <div style="
          background: rgba(0,0,0,0.35);
          border-radius: ${radius};
          box-shadow: ${shadow};
          padding: 2rem 3rem;
          text-align: center;
          backdrop-filter: blur(6px);
          animation: popIn 0.5s ease forwards;
        ">
          <div class="spinner" style="
            width: 60px;
            height: 60px;
            margin: 0 auto 1.5rem;
            border-radius: 50%;
            border: 4px solid rgba(255,255,255,0.1);
            border-top-color: ${color};
            animation: spin 1.2s linear infinite;
          "></div>
          <h2 style="margin-bottom: 0.5rem;">Website is temporarily unavailable</h2>
          <p>${escapeHtml(message)}</p>
        </div>
      `;

      const style = document.createElement("style");
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes popIn {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);

      document.body.appendChild(overlay);
    } catch (e) {
      alert("FATAL: " + message);
    }
  }

  function blockWebsite(message) {
    console.error("Website Halted:", message);
    if (document.readyState !== "loading") {
      showBlockingOverlay(message);
    } else {
      window.addEventListener("DOMContentLoaded", () => showBlockingOverlay(message));
    }
    window.__CORE_LOADED__ = false;
    throw new Error(message);
  }

  async function checkCoreIntegrity() {
    for (let file of requiredFiles) {
      try {
        const res = await fetch(file, { method: "HEAD", cache: "no-store" });
        if (!res.ok) throw new Error(`Missing file: ${file} (status ${res.status})`);
      } catch (err) {
        blockWebsite(err.message || `Error fetching ${file}`);
        return;
      }
    }

    window.__CORE_LOADED__ = true;
    console.log("All required files are present. System integrity passed.");
  }
  
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", checkCoreIntegrity);
  } else {
    checkCoreIntegrity();
  }
})();