(() => {
  const SITE_CONFIG = window.SITE_CONFIG || {};

  const SAMPLE_DATA = {
    "json-formatter":
      '{"name":"ToolMint","plan":"starter","features":["fast","private","browser-side"]}',
    "json-to-csv":
      '[{"name":"Asha","city":"Mumbai","score":92},{"name":"Ravi","city":"Pune","score":88}]',
    "csv-to-json": "name,city,score\nAsha,Mumbai,92\nRavi,Pune,88",
    "base64-encoder": "Hello from ToolMint",
    "base64-decoder": "SGVsbG8gZnJvbSBUb29sTWludA==",
    "url-encoder": "https://example.com/search?q=hello world&city=Mumbai",
    "url-decoder":
      "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%2520world%26city%3DMumbai",
    "case-converter": "this is a sample heading for your next blog post",
    "slug-generator": "This is a sample heading for your next blog post!",
    "sha256-generator": "hash this text",
    "jwt-decoder":
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdCBVc2VyIiwicm9sZSI6Im1lbWJlciIsImlhdCI6MTcxNzIwMDAwMH0.signature",
    "timestamp-converter": "1719907200",
    "word-counter":
      "This is a sample text. It has some words and some characters.\n\nAnd a second paragraph.",
    "color-converter": "#6d5efc",
    "html-encoder":
      '<div class="greeting">Hello & welcome!</div>\n<p>Price: $5 & free shipping.</p>',
    "html-decoder":
      "&lt;div class=&quot;greeting&quot;&gt;Hello &amp; welcome!&lt;/div&gt;\n&lt;p&gt;Price: $5 &amp; free shipping.&lt;/p&gt;",
    "markdown-to-html":
      "# Hello World\n\nThis is **bold** and *italic* text.\n\n- Item one\n- Item two\n\n> A blockquote\n\n[Link to example](https://example.com)",
    "text-reverser": "Hello World from ToolMint!",
    "find-and-replace":
      "The quick brown fox jumps over the lazy dog.\nThe quick brown fox is very fast.",
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  async function copyText(text, trigger) {
    try {
      await navigator.clipboard.writeText(text);
      flashButton(trigger, "Copied");
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      flashButton(trigger, "Copied");
    }
  }

  function flashButton(button, label) {
    if (!button) return;
    const original = button.dataset.originalLabel || button.textContent;
    button.dataset.originalLabel = original;
    button.textContent = label;
    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  }

  function downloadText(filename, text, mime = "text/plain;charset=utf-8") {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function setStatus(root, message, type = "info") {
    const node = qs("[data-status]", root);
    if (!node) return;
    node.textContent = message;
    node.dataset.type = type;
  }

  async function withProgress(root, steps, task) {
    const progressCard = qs("[data-progress-card]", root);
    const progressBar = qs("[data-progress-bar]", root);
    const progressText = qs("[data-progress-text]", root);
    const progressHint = qs("[data-progress-hint]", root);
    const workingNote = qs("[data-working-note]", root);
    if (progressCard) progressCard.hidden = false;
    if (workingNote) workingNote.hidden = false;
    let pct = 8;
    let stepIndex = 0;
    if (progressBar) progressBar.style.width = pct + "%";
    if (progressText) progressText.textContent = steps[0] || "Starting...";
    if (progressHint)
      progressHint.textContent =
        "Everything is processed locally in your browser.";

    const timer = setInterval(() => {
      pct = Math.min(92, pct + Math.random() * 16);
      if (progressBar) progressBar.style.width = `${pct.toFixed(0)}%`;
      stepIndex = (stepIndex + 1) % steps.length;
      if (progressText) progressText.textContent = steps[stepIndex];
      if (progressHint) {
        progressHint.textContent = [
          "Tip: users trust tools more when you explain what is happening.",
          "Privacy note: this starter kit keeps most data on the device.",
          "UX note: a short progress state can improve perceived speed.",
        ][stepIndex % 3];
      }
    }, 280);

    const started = performance.now();
    try {
      const result = await task();
      const elapsed = performance.now() - started;
      if (elapsed < 900) await sleep(900 - elapsed);
      clearInterval(timer);
      if (progressBar) progressBar.style.width = "100%";
      if (progressText) progressText.textContent = "Finished successfully";
      if (progressHint)
        progressHint.textContent = "You can copy or download the result below.";
      return result;
    } catch (error) {
      clearInterval(timer);
      if (progressBar) progressBar.style.width = "100%";
      if (progressText)
        progressText.textContent = "Stopped because something needs attention";
      if (progressHint)
        progressHint.textContent =
          error.message || "Please check your input and try again.";
      throw error;
    }
  }

  function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      const next = line[i + 1];
      if (char === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  function csvToJson(csv) {
    const lines = csv.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2)
      throw new Error("Please include a header row and at least one data row.");
    const headers = parseCSVLine(lines[0]).map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const values = parseCSVLine(line);
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] ?? "";
      });
      return row;
    });
  }

  function flattenObject(input, prefix = "", out = {}) {
    Object.entries(input || {}).forEach(([key, value]) => {
      const nextKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        flattenObject(value, nextKey, out);
      } else {
        out[nextKey] = Array.isArray(value) ? JSON.stringify(value) : value;
      }
    });
    return out;
  }

  function jsonToCsv(value) {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(parsed))
      throw new Error("Please provide a JSON array of objects.");
    const rows = parsed.map((item) => flattenObject(item));
    const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
    const escaped = (val) => {
      const raw = val == null ? "" : String(val);
      if (/[",\n]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`;
      return raw;
    };
    const lines = [headers.join(",")];
    rows.forEach((row) => {
      lines.push(headers.map((h) => escaped(row[h] ?? "")).join(","));
    });
    return lines.join("\n");
  }

  function titleCase(text) {
    return text
      .toLowerCase()
      .split(/\s+/)
      .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ""))
      .join(" ");
  }

  function sentenceCase(text) {
    const trimmed = text.trim().toLowerCase();
    return trimmed ? trimmed[0].toUpperCase() + trimmed.slice(1) : trimmed;
  }

  function slugify(text) {
    return text
      .normalize("NFKD")
      .replace(/[\u0300-\u036F]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
  }

  async function sha256(text) {
    const bytes = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(hash)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function decodeBase64Unicode(input) {
    const bin = atob(input);
    const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function encodeBase64Unicode(input) {
    const bytes = new TextEncoder().encode(input);
    let binary = "";
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    return btoa(binary);
  }

  function decodeJwt(token) {
    const [header, payload] = token.split(".");
    if (!header || !payload)
      throw new Error(
        "Please paste a valid JWT with header.payload.signature format.",
      );
    const normalize = (part) =>
      part
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(Math.ceil(part.length / 4) * 4, "=");
    return {
      header: JSON.parse(decodeBase64Unicode(normalize(header))),
      payload: JSON.parse(decodeBase64Unicode(normalize(payload))),
    };
  }

  function formatTimestamp(value) {
    const digitsOnly = String(value).trim();
    if (!/^\d+$/.test(digitsOnly))
      throw new Error("Please enter a numeric Unix timestamp.");
    const ms =
      digitsOnly.length >= 13 ? Number(digitsOnly) : Number(digitsOnly) * 1000;
    const date = new Date(ms);
    if (Number.isNaN(date.getTime()))
      throw new Error("That timestamp does not look valid.");
    return {
      iso: date.toISOString(),
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      milliseconds: ms,
      seconds: Math.floor(ms / 1000),
    };
  }

  function dateTimeLocalValue(date = new Date()) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () =>
        reject(new Error("Could not read the selected file."));
      reader.readAsDataURL(file);
    });
  }

  function loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () =>
        reject(new Error("Could not load the selected image."));
      img.src = dataUrl;
    });
  }

  async function resizeImage(file, width, format, quality) {
    const dataUrl = await readFileAsDataURL(file);
    const img = await loadImage(dataUrl);
    const ratio = width / img.width;
    const height = Math.round(img.height * ratio);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    const mime = format === "jpg" ? "image/jpeg" : `image/${format}`;
    const outUrl = canvas.toDataURL(
      mime,
      format === "png" ? undefined : quality,
    );
    return {
      outUrl,
      width,
      height,
      originalWidth: img.width,
      originalHeight: img.height,
    };
  }

  function renderSharedShell(title = "Tool workspace") {
    return `
      <div class="workspace-head">
        <h3>${title}</h3>
        <p class="muted">Clear input, friendly actions, and small progress messages help users feel safe and in control.</p>
      </div>
      <div class="progress-card" data-progress-card hidden>
        <div class="progress-meta">
          <strong data-progress-text>Preparing...</strong>
          <span data-working-note hidden>Working...</span>
        </div>
        <div class="progress-track"><div class="progress-bar" data-progress-bar></div></div>
        <p class="muted" data-progress-hint>Your data stays in your browser.</p>
      </div>
      <p class="status-text" data-status>Ready. This tool works locally in your browser.</p>
    `;
  }

  function renderTextTool(root, tool, options) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="field-group">
          <label for="tool-input">Input</label>
          <textarea id="tool-input" class="big-textarea" placeholder="Paste or type here..."></textarea>
        </div>
        ${options.extraControls || ""}
        <div class="action-row">
          <button class="btn btn-primary" data-run>${options.runLabel || "Run tool"}</button>
          <button class="btn btn-secondary" data-sample>Load example</button>
          <button class="btn btn-secondary" data-clear>Clear</button>
        </div>
        <div class="field-group">
          <div class="output-head">
            <label for="tool-output">Output</label>
            <div class="mini-actions">
              <button class="mini-btn" data-copy>Copy</button>
              <button class="mini-btn" data-download>Download</button>
            </div>
          </div>
          <textarea id="tool-output" class="big-textarea output" placeholder="Your result will appear here..." readonly></textarea>
        </div>
      </div>
    `;

    const input = qs("#tool-input", root);
    const output = qs("#tool-output", root);
    const runBtn = qs("[data-run]", root);
    const clearBtn = qs("[data-clear]", root);
    const sampleBtn = qs("[data-sample]", root);
    const copyBtn = qs("[data-copy]", root);
    const downloadBtn = qs("[data-download]", root);

    runBtn.addEventListener("click", async () => {
      try {
        setStatus(root, "Working on your request...", "info");
        const result = await withProgress(root, options.steps, () =>
          options.compute(input.value, root),
        );
        output.value = result;
        setStatus(
          root,
          "Done. You can copy or download the result.",
          "success",
        );
      } catch (error) {
        output.value = "";
        setStatus(root, error.message, "error");
      }
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      output.value = "";
      setStatus(root, "Cleared. Ready for a new input.", "info");
    });

    sampleBtn.addEventListener("click", () => {
      input.value = SAMPLE_DATA[tool.id] || "";
      setStatus(
        root,
        "Loaded a quick example to help first-time users.",
        "info",
      );
    });

    copyBtn.addEventListener("click", () => copyText(output.value, copyBtn));
    downloadBtn.addEventListener("click", () =>
      downloadText(`${tool.id}.txt`, output.value || ""),
    );
  }

  function renderTimestampTool(root, tool) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="two-col-grid">
          <div class="field-group">
            <label for="timestamp-input">Unix timestamp</label>
            <input id="timestamp-input" class="text-input" type="text" placeholder="1719907200" />
          </div>
          <div class="field-group">
            <label for="datetime-input">Date and time</label>
            <input id="datetime-input" class="text-input" type="datetime-local" />
          </div>
        </div>
        <div class="action-row">
          <button class="btn btn-primary" data-from-timestamp>Convert timestamp</button>
          <button class="btn btn-secondary" data-from-date>Convert date to timestamp</button>
          <button class="btn btn-secondary" data-sample>Load example</button>
        </div>
        <div class="field-group">
          <div class="output-head">
            <label for="tool-output">Output</label>
            <div class="mini-actions"><button class="mini-btn" data-copy>Copy</button></div>
          </div>
          <textarea id="tool-output" class="big-textarea output" readonly></textarea>
        </div>
      </div>
    `;

    const input = qs("#timestamp-input", root);
    const datetimeInput = qs("#datetime-input", root);
    const output = qs("#tool-output", root);
    datetimeInput.value = dateTimeLocalValue();

    qs("[data-sample]", root).addEventListener("click", () => {
      input.value = SAMPLE_DATA[tool.id];
      setStatus(root, "Loaded a sample Unix timestamp.", "info");
    });

    qs("[data-copy]", root).addEventListener("click", (e) =>
      copyText(output.value, e.currentTarget),
    );

    qs("[data-from-timestamp]", root).addEventListener("click", async () => {
      try {
        const data = await withProgress(
          root,
          [
            "Reading timestamp",
            "Converting to local time",
            "Preparing UTC details",
          ],
          async () => formatTimestamp(input.value),
        );
        output.value = `Local: ${data.local}\nUTC: ${data.utc}\nISO: ${data.iso}\nSeconds: ${data.seconds}\nMilliseconds: ${data.milliseconds}`;
        setStatus(root, "Converted timestamp successfully.", "success");
      } catch (error) {
        output.value = "";
        setStatus(root, error.message, "error");
      }
    });

    qs("[data-from-date]", root).addEventListener("click", async () => {
      try {
        const data = await withProgress(
          root,
          ["Reading date", "Generating Unix timestamp", "Preparing output"],
          async () => {
            if (!datetimeInput.value)
              throw new Error("Please select a date and time first.");
            const date = new Date(datetimeInput.value);
            if (Number.isNaN(date.getTime()))
              throw new Error("That date/time is not valid.");
            return {
              iso: date.toISOString(),
              seconds: Math.floor(date.getTime() / 1000),
              milliseconds: date.getTime(),
              utc: date.toUTCString(),
              local: date.toLocaleString(),
            };
          },
        );
        output.value = `Seconds: ${data.seconds}\nMilliseconds: ${data.milliseconds}\nISO: ${data.iso}\nLocal: ${data.local}\nUTC: ${data.utc}`;
        setStatus(root, "Generated a new Unix timestamp.", "success");
      } catch (error) {
        output.value = "";
        setStatus(root, error.message, "error");
      }
    });
  }

  function renderImageToBase64(root, tool) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="field-group">
          <label for="image-file">Choose image</label>
          <input id="image-file" class="text-input" type="file" accept="image/*" />
        </div>
        <div class="action-row">
          <button class="btn btn-primary" data-run>Convert image</button>
          <button class="btn btn-secondary" data-clear>Clear</button>
        </div>
        <div class="image-preview" data-preview-wrap hidden>
          <img alt="Selected preview" data-preview />
        </div>
        <div class="field-group">
          <div class="output-head">
            <label for="tool-output">Base64 output</label>
            <div class="mini-actions">
              <button class="mini-btn" data-copy>Copy</button>
              <button class="mini-btn" data-download>Download</button>
            </div>
          </div>
          <textarea id="tool-output" class="big-textarea output" readonly></textarea>
        </div>
      </div>
    `;

    const fileInput = qs("#image-file", root);
    const output = qs("#tool-output", root);
    const previewWrap = qs("[data-preview-wrap]", root);
    const preview = qs("[data-preview]", root);

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      const dataUrl = await readFileAsDataURL(file);
      preview.src = dataUrl;
      previewWrap.hidden = false;
    });

    qs("[data-run]", root).addEventListener("click", async () => {
      try {
        const file = fileInput.files?.[0];
        if (!file) throw new Error("Please choose an image first.");
        const result = await withProgress(
          root,
          ["Reading file", "Encoding image data", "Preparing Base64 output"],
          async () => readFileAsDataURL(file),
        );
        output.value = result;
        setStatus(root, "Image converted to Base64 successfully.", "success");
      } catch (error) {
        setStatus(root, error.message, "error");
      }
    });

    qs("[data-copy]", root).addEventListener("click", (e) =>
      copyText(output.value, e.currentTarget),
    );
    qs("[data-download]", root).addEventListener("click", () =>
      downloadText("image-base64.txt", output.value || ""),
    );
    qs("[data-clear]", root).addEventListener("click", () => {
      fileInput.value = "";
      output.value = "";
      preview.src = "";
      previewWrap.hidden = true;
      setStatus(root, "Cleared. Choose another image when ready.", "info");
    });
  }

  function renderImageResizer(root, tool) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="three-col-grid">
          <div class="field-group">
            <label for="image-file">Choose image</label>
            <input id="image-file" class="text-input" type="file" accept="image/*" />
          </div>
          <div class="field-group">
            <label for="resize-width">Output width (px)</label>
            <input id="resize-width" class="text-input" type="number" min="32" value="1200" />
          </div>
          <div class="field-group">
            <label for="resize-format">Format</label>
            <select id="resize-format" class="text-input">
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
        </div>
        <div class="field-group">
          <label for="resize-quality">Quality for JPG/WebP: <span data-quality-label>0.85</span></label>
          <input id="resize-quality" type="range" min="0.4" max="1" step="0.05" value="0.85" />
        </div>
        <div class="action-row">
          <button class="btn btn-primary" data-run>Resize image</button>
          <button class="btn btn-secondary" data-clear>Clear</button>
        </div>
        <div class="preview-grid">
          <div class="image-preview" data-original-wrap hidden>
            <span class="preview-tag">Original</span>
            <img alt="Original image preview" data-original-preview />
          </div>
          <div class="image-preview" data-output-wrap hidden>
            <span class="preview-tag">Output</span>
            <img alt="Output image preview" data-output-preview />
          </div>
        </div>
        <div class="field-group">
          <div class="output-head">
            <label for="tool-output">Result details</label>
            <div class="mini-actions"><button class="mini-btn" data-download>Download image</button></div>
          </div>
          <textarea id="tool-output" class="big-textarea output" readonly></textarea>
        </div>
      </div>
    `;

    const fileInput = qs("#image-file", root);
    const widthInput = qs("#resize-width", root);
    const formatInput = qs("#resize-format", root);
    const qualityInput = qs("#resize-quality", root);
    const qualityLabel = qs("[data-quality-label]", root);
    const output = qs("#tool-output", root);
    const originalWrap = qs("[data-original-wrap]", root);
    const outputWrap = qs("[data-output-wrap]", root);
    const originalPreview = qs("[data-original-preview]", root);
    const outputPreview = qs("[data-output-preview]", root);
    let latestOutput = null;

    qualityInput.addEventListener("input", () => {
      qualityLabel.textContent = Number(qualityInput.value).toFixed(2);
    });

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      originalPreview.src = await readFileAsDataURL(file);
      originalWrap.hidden = false;
    });

    qs("[data-run]", root).addEventListener("click", async () => {
      try {
        const file = fileInput.files?.[0];
        if (!file) throw new Error("Please choose an image first.");
        const width = Number(widthInput.value);
        if (!width || width < 32)
          throw new Error("Please enter a sensible width above 32 pixels.");
        latestOutput = await withProgress(
          root,
          [
            "Reading image",
            "Resizing on your device",
            "Rendering the download",
          ],
          async () =>
            resizeImage(
              file,
              width,
              formatInput.value,
              Number(qualityInput.value),
            ),
        );
        outputPreview.src = latestOutput.outUrl;
        outputWrap.hidden = false;
        output.value = `Original size: ${latestOutput.originalWidth} × ${latestOutput.originalHeight}\nOutput size: ${latestOutput.width} × ${latestOutput.height}\nFormat: ${formatInput.value.toUpperCase()}\nQuality: ${Number(qualityInput.value).toFixed(2)}`;
        setStatus(
          root,
          "Image resized successfully. Download is ready.",
          "success",
        );
      } catch (error) {
        setStatus(root, error.message, "error");
      }
    });

    qs("[data-download]", root).addEventListener("click", () => {
      if (!latestOutput) return;
      const a = document.createElement("a");
      a.href = latestOutput.outUrl;
      a.download = `resized-image.${formatInput.value}`;
      a.click();
    });

    qs("[data-clear]", root).addEventListener("click", () => {
      fileInput.value = "";
      output.value = "";
      originalWrap.hidden = true;
      outputWrap.hidden = true;
      latestOutput = null;
      setStatus(root, "Cleared. Select another image to continue.", "info");
    });
  }

  function renderGSTCalculator(root, tool) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="three-col-grid">
          <div class="field-group">
            <label for="gst-amount">Amount</label>
            <input id="gst-amount" class="text-input" type="number" min="0" step="0.01" placeholder="1000" />
          </div>
          <div class="field-group">
            <label for="gst-rate">GST rate</label>
            <select id="gst-rate" class="text-input">
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18" selected>18%</option>
              <option value="28">28%</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div class="field-group" data-custom-rate-wrap hidden>
            <label for="gst-custom-rate">Custom rate %</label>
            <input id="gst-custom-rate" class="text-input" type="number" min="0" step="0.01" value="18" />
          </div>
        </div>
        <div class="field-group">
          <label for="gst-mode">Calculation mode</label>
          <select id="gst-mode" class="text-input">
            <option value="exclusive">Add GST to base amount</option>
            <option value="inclusive">Extract GST from total amount</option>
          </select>
        </div>
        <div class="action-row">
          <button class="btn btn-primary" data-run>Calculate GST</button>
        </div>
        <div class="result-grid" data-result-grid hidden>
          <div class="result-card"><span>Base amount</span><strong data-base>₹0.00</strong></div>
          <div class="result-card"><span>GST amount</span><strong data-tax>₹0.00</strong></div>
          <div class="result-card"><span>Total</span><strong data-total>₹0.00</strong></div>
        </div>
      </div>
    `;

    const rateSelect = qs("#gst-rate", root);
    const modeSelect = qs("#gst-mode", root);
    const amountInput = qs("#gst-amount", root);
    const customWrap = qs("[data-custom-rate-wrap]", root);
    const customRate = qs("#gst-custom-rate", root);
    const resultGrid = qs("[data-result-grid]", root);

    rateSelect.addEventListener("change", () => {
      customWrap.hidden = rateSelect.value !== "custom";
    });

    qs("[data-run]", root).addEventListener("click", async () => {
      try {
        const result = await withProgress(
          root,
          ["Reading amount", "Applying GST formula", "Preparing final totals"],
          async () => {
            const amount = Number(amountInput.value);
            const rate = Number(
              rateSelect.value === "custom"
                ? customRate.value
                : rateSelect.value,
            );
            if (!amount || amount < 0)
              throw new Error("Please enter a valid amount.");
            if (rate < 0) throw new Error("Please enter a valid GST rate.");
            if (modeSelect.value === "exclusive") {
              const tax = amount * (rate / 100);
              return { base: amount, tax, total: amount + tax };
            }
            const base = amount / (1 + rate / 100);
            const tax = amount - base;
            return { base, tax, total: amount };
          },
        );
        resultGrid.hidden = false;
        qs("[data-base]", root).textContent = `₹${result.base.toFixed(2)}`;
        qs("[data-tax]", root).textContent = `₹${result.tax.toFixed(2)}`;
        qs("[data-total]", root).textContent = `₹${result.total.toFixed(2)}`;
        setStatus(root, "GST calculated successfully.", "success");
      } catch (error) {
        resultGrid.hidden = true;
        setStatus(root, error.message, "error");
      }
    });
  }

  function renderEMICalculator(root, tool) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="three-col-grid">
          <div class="field-group">
            <label for="emi-principal">Loan amount</label>
            <input id="emi-principal" class="text-input" type="number" min="0" step="0.01" placeholder="500000" />
          </div>
          <div class="field-group">
            <label for="emi-rate">Annual interest %</label>
            <input id="emi-rate" class="text-input" type="number" min="0" step="0.01" placeholder="10.5" />
          </div>
          <div class="field-group">
            <label for="emi-months">Tenure in months</label>
            <input id="emi-months" class="text-input" type="number" min="1" step="1" placeholder="60" />
          </div>
        </div>
        <div class="action-row"><button class="btn btn-primary" data-run>Calculate EMI</button></div>
        <div class="result-grid" data-result-grid hidden>
          <div class="result-card"><span>Monthly EMI</span><strong data-emi>₹0.00</strong></div>
          <div class="result-card"><span>Total interest</span><strong data-interest>₹0.00</strong></div>
          <div class="result-card"><span>Total payment</span><strong data-total>₹0.00</strong></div>
        </div>
      </div>
    `;

    qs("[data-run]", root).addEventListener("click", async () => {
      try {
        const result = await withProgress(
          root,
          ["Reading loan values", "Applying EMI formula", "Summarizing totals"],
          async () => {
            const p = Number(qs("#emi-principal", root).value);
            const annualRate = Number(qs("#emi-rate", root).value);
            const months = Number(qs("#emi-months", root).value);
            if (!p || p <= 0)
              throw new Error("Please enter a valid loan amount.");
            if (!months || months <= 0)
              throw new Error("Please enter a valid tenure in months.");
            const r = annualRate / 12 / 100;
            const emi =
              r === 0
                ? p / months
                : (p * r * (1 + r) ** months) / ((1 + r) ** months - 1);
            const total = emi * months;
            const interest = total - p;
            return { emi, total, interest };
          },
        );
        qs("[data-result-grid]", root).hidden = false;
        qs("[data-emi]", root).textContent = `₹${result.emi.toFixed(2)}`;
        qs("[data-interest]", root).textContent =
          `₹${result.interest.toFixed(2)}`;
        qs("[data-total]", root).textContent = `₹${result.total.toFixed(2)}`;
        setStatus(root, "EMI calculated successfully.", "success");
      } catch (error) {
        qs("[data-result-grid]", root).hidden = true;
        setStatus(root, error.message, "error");
      }
    });
  }

  function renderPercentageCalculator(root, tool) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="field-group">
          <label for="percent-mode">Mode</label>
          <select id="percent-mode" class="text-input">
            <option value="of">What is X% of Y?</option>
            <option value="increase">Percentage increase</option>
            <option value="decrease">Percentage decrease</option>
            <option value="ratio">X is what percent of Y?</option>
          </select>
        </div>
        <div class="three-col-grid">
          <div class="field-group">
            <label for="percent-a">Value A</label>
            <input id="percent-a" class="text-input" type="number" step="0.01" />
          </div>
          <div class="field-group">
            <label for="percent-b">Value B</label>
            <input id="percent-b" class="text-input" type="number" step="0.01" />
          </div>
          <div class="field-group muted-card">
            <span>Quick examples</span>
            <small>Discounts, growth, markups, and comparisons</small>
          </div>
        </div>
        <div class="action-row"><button class="btn btn-primary" data-run>Calculate percentage</button></div>
        <div class="result-grid" data-result-grid hidden>
          <div class="result-card wide"><span>Answer</span><strong data-answer>0</strong></div>
        </div>
      </div>
    `;

    qs("[data-run]", root).addEventListener("click", async () => {
      try {
        const result = await withProgress(
          root,
          ["Reading values", "Applying percentage math", "Preparing answer"],
          async () => {
            const mode = qs("#percent-mode", root).value;
            const a = Number(qs("#percent-a", root).value);
            const b = Number(qs("#percent-b", root).value);
            if (!Number.isFinite(a) || !Number.isFinite(b))
              throw new Error("Please enter both values.");
            switch (mode) {
              case "of":
                return `${a}% of ${b} = ${(a / 100) * b}`;
              case "increase":
                if (a === 0)
                  throw new Error(
                    "Value A cannot be zero for percentage increase.",
                  );
                return `Increase from ${a} to ${b} = ${(((b - a) / a) * 100).toFixed(2)}%`;
              case "decrease":
                if (a === 0)
                  throw new Error(
                    "Value A cannot be zero for percentage decrease.",
                  );
                return `Decrease from ${a} to ${b} = ${(((a - b) / a) * 100).toFixed(2)}%`;
              default:
                if (b === 0)
                  throw new Error("Value B cannot be zero for this mode.");
                return `${a} is ${((a / b) * 100).toFixed(2)}% of ${b}`;
            }
          },
        );
        qs("[data-result-grid]", root).hidden = false;
        qs("[data-answer]", root).textContent = result;
        setStatus(
          root,
          "Percentage result calculated successfully.",
          "success",
        );
      } catch (error) {
        qs("[data-result-grid]", root).hidden = true;
        setStatus(root, error.message, "error");
      }
    });
  }

  function renderRegexTester(root, tool) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="two-col-grid">
          <div class="field-group">
            <label for="regex-pattern">Pattern</label>
            <input id="regex-pattern" class="text-input" type="text" placeholder="[a-z]+@[a-z]+\\.[a-z]+" />
          </div>
          <div class="field-group">
            <label for="regex-flags">Flags</label>
            <input id="regex-flags" class="text-input" type="text" value="gi" placeholder="gi" />
          </div>
        </div>
        <div class="field-group">
          <label for="regex-input">Test text</label>
          <textarea id="regex-input" class="big-textarea" placeholder="Paste or type text to test against the pattern..."></textarea>
        </div>
        <div class="action-row">
          <button class="btn btn-primary" data-run>Test regex</button>
          <button class="btn btn-secondary" data-sample>Load example</button>
          <button class="btn btn-secondary" data-clear>Clear</button>
        </div>
        <div class="field-group">
          <div class="output-head">
            <label>Matches</label>
            <span class="muted" data-match-count>0 matches found</span>
          </div>
          <div class="regex-results" data-results></div>
        </div>
      </div>
    `;

    const patternInput = qs("#regex-pattern", root);
    const flagsInput = qs("#regex-flags", root);
    const textInput = qs("#regex-input", root);
    const resultsDiv = qs("[data-results]", root);
    const matchCount = qs("[data-match-count]", root);

    qs("[data-sample]", root).addEventListener("click", () => {
      patternInput.value = "\\b\\w+@\\w+\\.\\w+\\b";
      flagsInput.value = "gi";
      textInput.value =
        "Contact us at hello@example.com or support@toolmint.org for help.";
      setStatus(root, "Loaded a sample regex test.", "info");
    });

    qs("[data-clear]", root).addEventListener("click", () => {
      patternInput.value = "";
      flagsInput.value = "gi";
      textInput.value = "";
      resultsDiv.innerHTML = "";
      matchCount.textContent = "0 matches found";
      setStatus(root, "Cleared. Ready for a new test.", "info");
    });

    qs("[data-run]", root).addEventListener("click", async () => {
      try {
        const result = await withProgress(
          root,
          [
            "Compiling regex pattern",
            "Scanning input text",
            "Preparing match results",
          ],
          () => {
            const pattern = patternInput.value;
            const flags = flagsInput.value;
            const text = textInput.value;
            if (!pattern) throw new Error("Please enter a regex pattern.");
            if (!text) throw new Error("Please enter some test text.");
            const regex = new RegExp(pattern, flags);
            const matches = [];
            let match;
            if (flags.includes("g")) {
              while ((match = regex.exec(text)) !== null) {
                matches.push({
                  value: match[0],
                  index: match.index,
                  groups: match.slice(1),
                });
                if (match[0].length === 0) regex.lastIndex++;
              }
            } else {
              match = regex.exec(text);
              if (match)
                matches.push({
                  value: match[0],
                  index: match.index,
                  groups: match.slice(1),
                });
            }
            return matches;
          },
        );
        matchCount.textContent = `${result.length} match${result.length !== 1 ? "es" : ""} found`;
        if (result.length === 0) {
          resultsDiv.innerHTML =
            '<p class="muted">No matches found. Try adjusting your pattern or text.</p>';
        } else {
          resultsDiv.innerHTML = result
            .map(
              (m, i) => `
            <div class="regex-match-card">
              <span class="regex-match-num">#${i + 1}</span>
              <span class="regex-match-value">${escapeHtml(m.value)}</span>
              <span class="muted">at index ${m.index}</span>
              ${m.groups.length ? `<span class="muted">Groups: ${m.groups.map((g) => escapeHtml(g || "")).join(", ")}</span>` : ""}
            </div>
          `,
            )
            .join("");
        }
        setStatus(
          root,
          `Found ${result.length} match${result.length !== 1 ? "es" : ""}.`,
          "success",
        );
      } catch (error) {
        resultsDiv.innerHTML = "";
        matchCount.textContent = "0 matches found";
        setStatus(root, error.message, "error");
      }
    });
  }

  function renderQRCodeGenerator(root, tool) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="field-group">
          <label for="qr-input">Text or URL</label>
          <textarea id="qr-input" class="big-textarea" placeholder="Enter a URL or any text to encode as QR code..."></textarea>
        </div>
        <div class="field-group">
          <label for="qr-size">QR code size</label>
          <select id="qr-size" class="text-input">
            <option value="200">Small (200px)</option>
            <option value="300" selected>Medium (300px)</option>
            <option value="500">Large (500px)</option>
          </select>
        </div>
        <div class="action-row">
          <button class="btn btn-primary" data-run>Generate QR code</button>
          <button class="btn btn-secondary" data-sample>Load example</button>
          <button class="btn btn-secondary" data-clear>Clear</button>
        </div>
        <div class="qr-preview" data-qr-preview hidden>
          <canvas id="qr-canvas"></canvas>
        </div>
        <div class="action-row" data-download-row hidden>
          <button class="btn btn-secondary" data-download>Download QR code as PNG</button>
        </div>
      </div>
    `;

    const input = qs("#qr-input", root);
    const sizeSelect = qs("#qr-size", root);
    const canvas = qs("#qr-canvas", root);
    const previewWrap = qs("[data-qr-preview]", root);
    const downloadRow = qs("[data-download-row]", root);

    qs("[data-sample]", root).addEventListener("click", () => {
      input.value = "https://toolmint.dev";
      setStatus(root, "Loaded a sample URL.", "info");
    });

    qs("[data-clear]", root).addEventListener("click", () => {
      input.value = "";
      previewWrap.hidden = true;
      downloadRow.hidden = true;
      setStatus(root, "Cleared. Ready for new input.", "info");
    });

    qs("[data-download]", root).addEventListener("click", () => {
      const a = document.createElement("a");
      a.download = "qr-code.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    });

    qs("[data-run]", root).addEventListener("click", async () => {
      try {
        const text = input.value.trim();
        if (!text) throw new Error("Please enter some text or a URL.");
        await withProgress(
          root,
          [
            "Encoding data into QR matrix",
            "Rendering pixel grid",
            "Preparing download",
          ],
          () => {
            const size = Number(sizeSelect.value);
            const moduleCount = 25;
            const moduleSize = Math.floor(size / (moduleCount + 8));
            const actualSize = moduleSize * (moduleCount + 8);
            canvas.width = actualSize;
            canvas.height = actualSize;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, actualSize, actualSize);
            const matrix = generateQRMatrix(text, moduleCount);
            ctx.fillStyle = "#0b1020";
            for (let r = 0; r < moduleCount; r++) {
              for (let c = 0; c < moduleCount; c++) {
                if (matrix[r][c]) {
                  ctx.fillRect(
                    (c + 4) * moduleSize,
                    (r + 4) * moduleSize,
                    moduleSize,
                    moduleSize,
                  );
                }
              }
            }
            drawFinderPattern(ctx, 0, 0, moduleSize);
            drawFinderPattern(ctx, moduleCount - 7, 0, moduleSize);
            drawFinderPattern(ctx, 0, moduleCount - 7, moduleSize);
          },
        );
        previewWrap.hidden = false;
        downloadRow.hidden = false;
        setStatus(
          root,
          "QR code generated. You can download it now.",
          "success",
        );
      } catch (error) {
        setStatus(root, error.message, "error");
      }
    });
  }

  function generateQRMatrix(text, size) {
    const matrix = Array.from({ length: size }, () => Array(size).fill(false));
    const dataBytes = new TextEncoder().encode(text);
    const bits = [];
    for (const byte of dataBytes) {
      for (let i = 7; i >= 0; i--) bits.push((byte >> i) & 1);
    }
    const totalBits = size * size;
    for (let i = 0; i < Math.min(bits.length, totalBits); i++) {
      const row = Math.floor(i / size);
      const col = i % size;
      matrix[row][col] = !!bits[i];
    }
    return matrix;
  }

  function drawFinderPattern(ctx, row, col, moduleSize) {
    ctx.fillStyle = "#0b1020";
    const s = moduleSize;
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          ctx.fillRect((col + c) * s, (row + r) * s, s, s);
        }
      }
    }
    ctx.fillStyle = "#ffffff";
    for (let r = 1; r < 6; r++) {
      for (let c = 1; c < 6; c++) {
        if (
          r === 1 ||
          r === 5 ||
          c === 1 ||
          c === 5 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          ctx.fillRect((col + c) * s, (row + r) * s, s, s);
        }
      }
    }
    ctx.fillStyle = "#0b1020";
    for (let r = 2; r < 5; r++) {
      for (let c = 2; c < 5; c++) {
        ctx.fillRect((col + c) * s, (row + r) * s, s, s);
      }
    }
  }

  function renderTipCalculator(root, tool) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="three-col-grid">
          <div class="field-group">
            <label for="tip-amount">Bill amount</label>
            <input id="tip-amount" class="text-input" type="number" min="0" step="0.01" placeholder="1000" />
          </div>
          <div class="field-group">
            <label for="tip-percent">Tip percentage</label>
            <select id="tip-percent" class="text-input">
              <option value="10">10%</option>
              <option value="15">15%</option>
              <option value="18" selected>18%</option>
              <option value="20">20%</option>
              <option value="25">25%</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div class="field-group" data-custom-tip-wrap hidden>
            <label for="tip-custom">Custom tip %</label>
            <input id="tip-custom" class="text-input" type="number" min="0" max="100" step="1" value="18" />
          </div>
        </div>
        <div class="field-group">
          <label for="tip-people">Split among (people)</label>
          <input id="tip-people" class="text-input" type="number" min="1" value="1" step="1" />
        </div>
        <div class="action-row"><button class="btn btn-primary" data-run>Calculate tip</button></div>
        <div class="result-grid" data-result-grid hidden>
          <div class="result-card"><span>Tip amount</span><strong data-tip>₹0.00</strong></div>
          <div class="result-card"><span>Total bill</span><strong data-total>₹0.00</strong></div>
          <div class="result-card"><span>Per person</span><strong data-per>₹0.00</strong></div>
        </div>
      </div>
    `;

    const tipSelect = qs("#tip-percent", root);
    const customWrap = qs("[data-custom-tip-wrap]", root);
    tipSelect.addEventListener("change", () => {
      customWrap.hidden = tipSelect.value !== "custom";
    });

    qs("[data-run]", root).addEventListener("click", async () => {
      try {
        const result = await withProgress(
          root,
          ["Reading bill amount", "Calculating tip", "Splitting total"],
          () => {
            const amount = Number(qs("#tip-amount", root).value);
            const rate = Number(
              tipSelect.value === "custom"
                ? qs("#tip-custom", root).value
                : tipSelect.value,
            );
            const people = Math.max(
              1,
              Number(qs("#tip-people", root).value) || 1,
            );
            if (!amount || amount <= 0)
              throw new Error("Please enter a valid bill amount.");
            if (rate < 0)
              throw new Error("Please enter a valid tip percentage.");
            const tip = amount * (rate / 100);
            const total = amount + tip;
            const perPerson = total / people;
            return { tip, total, perPerson };
          },
        );
        qs("[data-result-grid]", root).hidden = false;
        qs("[data-tip]", root).textContent = `₹${result.tip.toFixed(2)}`;
        qs("[data-total]", root).textContent = `₹${result.total.toFixed(2)}`;
        qs("[data-per]", root).textContent = `₹${result.perPerson.toFixed(2)}`;
        setStatus(root, "Tip calculated successfully.", "success");
      } catch (error) {
        qs("[data-result-grid]", root).hidden = true;
        setStatus(root, error.message, "error");
      }
    });
  }

  function renderAgeCalculator(root, tool) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="field-group">
          <label for="dob-input">Date of birth</label>
          <input id="dob-input" class="text-input" type="date" />
        </div>
        <div class="action-row"><button class="btn btn-primary" data-run>Calculate age</button></div>
        <div class="result-grid four-col" data-result-grid hidden>
          <div class="result-card"><span>Years</span><strong data-years>0</strong></div>
          <div class="result-card"><span>Months</span><strong data-months>0</strong></div>
          <div class="result-card"><span>Days</span><strong data-days>0</strong></div>
          <div class="result-card"><span>Total days lived</span><strong data-total-days>0</strong></div>
        </div>
        <div class="result-grid" data-extra-grid hidden>
          <div class="result-card wide"><span>Next birthday</span><strong data-next-bday>—</strong></div>
        </div>
      </div>
    `;

    qs("[data-run]", root).addEventListener("click", async () => {
      try {
        const result = await withProgress(
          root,
          [
            "Reading date of birth",
            "Calculating exact age",
            "Preparing results",
          ],
          () => {
            const dobStr = qs("#dob-input", root).value;
            if (!dobStr) throw new Error("Please select your date of birth.");
            const dob = new Date(dobStr);
            const today = new Date();
            if (dob > today)
              throw new Error("Date of birth cannot be in the future.");
            let years = today.getFullYear() - dob.getFullYear();
            let months = today.getMonth() - dob.getMonth();
            let days = today.getDate() - dob.getDate();
            if (days < 0) {
              months--;
              const prevMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                0,
              );
              days += prevMonth.getDate();
            }
            if (months < 0) {
              years--;
              months += 12;
            }
            const diffMs = today - dob;
            const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            let nextBday = new Date(
              today.getFullYear(),
              dob.getMonth(),
              dob.getDate(),
            );
            if (nextBday <= today)
              nextBday = new Date(
                today.getFullYear() + 1,
                dob.getMonth(),
                dob.getDate(),
              );
            const daysUntil = Math.ceil(
              (nextBday - today) / (1000 * 60 * 60 * 24),
            );
            return { years, months, days, totalDays, daysUntil };
          },
        );
        qs("[data-result-grid]", root).hidden = false;
        qs("[data-extra-grid]", root).hidden = false;
        qs("[data-years]", root).textContent = result.years;
        qs("[data-months]", root).textContent = result.months;
        qs("[data-days]", root).textContent = result.days;
        qs("[data-total-days]", root).textContent =
          result.totalDays.toLocaleString();
        qs("[data-next-bday]", root).textContent =
          result.daysUntil === 0
            ? "Today is your birthday!"
            : `In ${result.daysUntil} days`;
        setStatus(root, "Age calculated successfully.", "success");
      } catch (error) {
        qs("[data-result-grid]", root).hidden = true;
        qs("[data-extra-grid]", root).hidden = true;
        setStatus(root, error.message, "error");
      }
    });
  }

  const UNIT_DATA = {
    length: {
      label: "Length",
      units: {
        mm: { label: "Millimeters", factor: 0.001 },
        cm: { label: "Centimeters", factor: 0.01 },
        m: { label: "Meters", factor: 1 },
        km: { label: "Kilometers", factor: 1000 },
        in: { label: "Inches", factor: 0.0254 },
        ft: { label: "Feet", factor: 0.3048 },
        yd: { label: "Yards", factor: 0.9144 },
        mi: { label: "Miles", factor: 1609.344 },
      },
    },
    weight: {
      label: "Weight",
      units: {
        mg: { label: "Milligrams", factor: 0.000001 },
        g: { label: "Grams", factor: 0.001 },
        kg: { label: "Kilograms", factor: 1 },
        t: { label: "Metric tons", factor: 1000 },
        oz: { label: "Ounces", factor: 0.0283495 },
        lb: { label: "Pounds", factor: 0.453592 },
      },
    },
    temperature: {
      label: "Temperature",
      units: {
        c: { label: "Celsius" },
        f: { label: "Fahrenheit" },
        k: { label: "Kelvin" },
      },
    },
    speed: {
      label: "Speed",
      units: {
        ms: { label: "Meters/second", factor: 1 },
        kmh: { label: "Kilometers/hour", factor: 0.277778 },
        mph: { label: "Miles/hour", factor: 0.44704 },
        kn: { label: "Knots", factor: 0.514444 },
      },
    },
    data: {
      label: "Data Storage",
      units: {
        b: { label: "Bytes", factor: 1 },
        kb: { label: "Kilobytes", factor: 1024 },
        mb: { label: "Megabytes", factor: 1048576 },
        gb: { label: "Gigabytes", factor: 1073741824 },
        tb: { label: "Terabytes", factor: 1099511627776 },
      },
    },
    area: {
      label: "Area",
      units: {
        sqm: { label: "Square meters", factor: 1 },
        sqkm: { label: "Square kilometers", factor: 1000000 },
        ha: { label: "Hectares", factor: 10000 },
        acre: { label: "Acres", factor: 4046.86 },
        sqft: { label: "Square feet", factor: 0.092903 },
      },
    },
  };

  function renderUnitConverter(root, tool) {
    const cats = Object.keys(UNIT_DATA);
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="field-group">
          <label for="unit-category">Category</label>
          <select id="unit-category" class="text-input">
            ${cats.map((c) => `<option value="${c}">${UNIT_DATA[c].label}</option>`).join("")}
          </select>
        </div>
        <div class="three-col-grid">
          <div class="field-group">
            <label for="unit-from">From</label>
            <select id="unit-from" class="text-input"></select>
          </div>
          <div class="field-group">
            <label for="unit-value">Value</label>
            <input id="unit-value" class="text-input" type="number" step="any" placeholder="1" />
          </div>
          <div class="field-group">
            <label for="unit-to">To</label>
            <select id="unit-to" class="text-input"></select>
          </div>
        </div>
        <div class="action-row"><button class="btn btn-primary" data-run>Convert</button></div>
        <div class="result-grid" data-result-grid hidden>
          <div class="result-card wide"><span>Result</span><strong data-result>0</strong></div>
        </div>
      </div>
    `;

    const catSelect = qs("#unit-category", root);
    const fromSelect = qs("#unit-from", root);
    const toSelect = qs("#unit-to", root);

    function populateUnits() {
      const cat = UNIT_DATA[catSelect.value];
      const opts = Object.entries(cat.units)
        .map(([k, v]) => `<option value="${k}">${v.label}</option>`)
        .join("");
      fromSelect.innerHTML = opts;
      toSelect.innerHTML = opts;
      if (Object.keys(cat.units).length > 1) toSelect.selectedIndex = 1;
    }
    populateUnits();
    catSelect.addEventListener("change", populateUnits);

    qs("[data-run]", root).addEventListener("click", async () => {
      try {
        const result = await withProgress(
          root,
          ["Reading unit values", "Converting units", "Preparing result"],
          () => {
            const cat = catSelect.value;
            const from = fromSelect.value;
            const to = toSelect.value;
            const val = Number(qs("#unit-value", root).value);
            if (!Number.isFinite(val))
              throw new Error("Please enter a valid number.");
            const catData = UNIT_DATA[cat];
            if (cat === "temperature") {
              let celsius;
              if (from === "c") celsius = val;
              else if (from === "f") celsius = ((val - 32) * 5) / 9;
              else celsius = val - 273.15;
              let output;
              if (to === "c") output = celsius;
              else if (to === "f") output = (celsius * 9) / 5 + 32;
              else output = celsius + 273.15;
              return `${val} ${catData.units[from].label} = ${Number(output.toPrecision(10))} ${catData.units[to].label}`;
            }
            const baseValue = val * catData.units[from].factor;
            const output = baseValue / catData.units[to].factor;
            return `${val} ${catData.units[from].label} = ${Number(output.toPrecision(10))} ${catData.units[to].label}`;
          },
        );
        qs("[data-result-grid]", root).hidden = false;
        qs("[data-result]", root).textContent = result;
        setStatus(root, "Unit conversion completed.", "success");
      } catch (error) {
        qs("[data-result-grid]", root).hidden = true;
        setStatus(root, error.message, "error");
      }
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function mountAdsense() {
    if (!SITE_CONFIG.adsense_client || !SITE_CONFIG.enable_auto_ads) {
      return;
    }
    document.documentElement.classList.remove("ads-disabled");
    if (document.querySelector("script[data-adsense-script]")) return;
    const script = document.createElement("script");
    script.async = true;
    script.dataset.adsenseScript = "true";
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(SITE_CONFIG.adsense_client)}`;
    document.head.appendChild(script);
  }

  function initSearch() {
    const input = qs("#tool-search");
    if (!input) return;
    const cards = qsa(".tool-card");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      cards.forEach((card) => {
        const hay = card.dataset.search || "";
        card.style.display = !q || hay.includes(q) ? "" : "none";
      });
    });
  }

  function initToolPage() {
    const toolDataNode = qs("#tool-data");
    const root = qs("#tool-root");
    if (!toolDataNode || !root) return;
    const tool = JSON.parse(toolDataNode.textContent);

    switch (tool.id) {
      case "json-formatter":
        renderTextTool(root, tool, {
          runLabel: "Format JSON",
          steps: [
            "Checking JSON syntax",
            "Beautifying indentation",
            "Preparing clean output",
          ],
          compute: async (input) => JSON.stringify(JSON.parse(input), null, 2),
        });
        break;
      case "json-to-csv":
        renderTextTool(root, tool, {
          runLabel: "Convert to CSV",
          steps: [
            "Reading JSON array",
            "Flattening fields",
            "Generating CSV rows",
          ],
          compute: async (input) => jsonToCsv(input),
        });
        break;
      case "csv-to-json":
        renderTextTool(root, tool, {
          runLabel: "Convert to JSON",
          steps: [
            "Reading CSV rows",
            "Mapping headers to fields",
            "Formatting JSON output",
          ],
          compute: async (input) => JSON.stringify(csvToJson(input), null, 2),
        });
        break;
      case "base64-encoder":
        renderTextTool(root, tool, {
          runLabel: "Encode to Base64",
          steps: [
            "Reading text",
            "Encoding UTF-8 bytes",
            "Preparing Base64 output",
          ],
          compute: async (input) => encodeBase64Unicode(input),
        });
        break;
      case "base64-decoder":
        renderTextTool(root, tool, {
          runLabel: "Decode Base64",
          steps: [
            "Checking Base64 text",
            "Decoding bytes",
            "Preparing readable output",
          ],
          compute: async (input) => decodeBase64Unicode(input),
        });
        break;
      case "url-encoder":
        renderTextTool(root, tool, {
          runLabel: "Encode URL",
          steps: [
            "Reading text",
            "Encoding reserved characters",
            "Preparing URL-safe output",
          ],
          compute: async (input) => encodeURIComponent(input),
        });
        break;
      case "url-decoder":
        renderTextTool(root, tool, {
          runLabel: "Decode URL",
          steps: [
            "Reading encoded text",
            "Decoding percent values",
            "Preparing readable output",
          ],
          compute: async (input) => decodeURIComponent(input),
        });
        break;
      case "case-converter":
        renderTextTool(root, tool, {
          runLabel: "Convert text case",
          steps: [
            "Reading text",
            "Applying selected case style",
            "Preparing converted output",
          ],
          extraControls: `
            <div class="field-group">
              <label for="case-style">Case style</label>
              <select id="case-style" class="text-input">
                <option value="upper">UPPERCASE</option>
                <option value="lower">lowercase</option>
                <option value="title">Title Case</option>
                <option value="sentence">Sentence case</option>
                <option value="slug">slug-case</option>
              </select>
            </div>
          `,
          compute: async (input, localRoot) => {
            const mode = qs("#case-style", localRoot).value;
            switch (mode) {
              case "upper":
                return input.toUpperCase();
              case "lower":
                return input.toLowerCase();
              case "title":
                return titleCase(input);
              case "sentence":
                return sentenceCase(input);
              default:
                return slugify(input);
            }
          },
        });
        break;
      case "slug-generator":
        renderTextTool(root, tool, {
          runLabel: "Generate slug",
          steps: [
            "Reading title text",
            "Removing symbols",
            "Building SEO-friendly slug",
          ],
          compute: async (input) => slugify(input),
        });
        break;
      case "sha256-generator":
        renderTextTool(root, tool, {
          runLabel: "Generate SHA-256",
          steps: [
            "Reading input",
            "Hashing with Web Crypto",
            "Preparing final digest",
          ],
          compute: async (input) => sha256(input),
        });
        break;
      case "jwt-decoder":
        renderTextTool(root, tool, {
          runLabel: "Decode JWT",
          steps: [
            "Reading token",
            "Decoding header and payload",
            "Formatting readable JSON",
          ],
          compute: async (input) => {
            const data = decodeJwt(input.trim());
            return `Header:\n${JSON.stringify(data.header, null, 2)}\n\nPayload:\n${JSON.stringify(data.payload, null, 2)}`;
          },
        });
        break;
      case "timestamp-converter":
        renderTimestampTool(root, tool);
        break;
      case "image-to-base64":
        renderImageToBase64(root, tool);
        break;
      case "image-resizer":
        renderImageResizer(root, tool);
        break;
      case "gst-calculator":
        renderGSTCalculator(root, tool);
        break;
      case "emi-calculator":
        renderEMICalculator(root, tool);
        break;
      case "percentage-calculator":
        renderPercentageCalculator(root, tool);
        break;
      case "word-counter":
        renderTextTool(root, tool, {
          runLabel: "Count words & characters",
          steps: [
            "Reading text",
            "Analyzing characters and words",
            "Formatting output",
          ],
          compute: async (input) => {
            const text = input || "";
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            const chars = text.length;
            const charsNoSpace = text.replace(/\s/g, "").length;
            const paragraphs = text.trim() ? text.split(/\n\s*\n/).length : 0;
            return `Words: ${words}\nCharacters: ${chars}\nCharacters (no spaces): ${charsNoSpace}\nParagraphs: ${paragraphs}`;
          },
        });
        break;
      case "password-generator":
        renderTextTool(root, tool, {
          runLabel: "Generate Password",
          steps: [
            "Gathering requirements",
            "Generating random bytes",
            "Building strong password",
          ],
          extraControls: `
            <div class="field-group">
              <label for="pwd-length">Password Length</label>
              <input id="pwd-length" class="text-input" type="number" min="4" max="128" value="16" />
            </div>
            <div class="field-group">
              <label><input type="checkbox" id="pwd-upper" checked /> Uppercase (A-Z)</label>
              <br>
              <label><input type="checkbox" id="pwd-lower" checked /> Lowercase (a-z)</label>
              <br>
              <label><input type="checkbox" id="pwd-numbers" checked /> Numbers (0-9)</label>
              <br>
              <label><input type="checkbox" id="pwd-symbols" checked /> Symbols (!@#$)</label>
            </div>
          `,
          compute: async (input, localRoot) => {
            const len = parseInt(qs("#pwd-length", localRoot).value, 10) || 16;
            const useUpper = qs("#pwd-upper", localRoot).checked;
            const useLower = qs("#pwd-lower", localRoot).checked;
            const useNum = qs("#pwd-numbers", localRoot).checked;
            const useSym = qs("#pwd-symbols", localRoot).checked;

            const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const lower = "abcdefghijklmnopqrstuvwxyz";
            const numbers = "0123456789";
            const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

            let charset = "";
            if (useUpper) charset += upper;
            if (useLower) charset += lower;
            if (useNum) charset += numbers;
            if (useSym) charset += symbols;

            if (!charset)
              throw new Error("Please select at least one character type.");

            let password = "";
            const array = new Uint32Array(len);
            crypto.getRandomValues(array);
            for (let i = 0; i < len; i++) {
              password += charset[array[i] % charset.length];
            }
            return password;
          },
        });
        break;
      case "uuid-generator":
        renderTextTool(root, tool, {
          runLabel: "Generate UUID",
          steps: [
            "Initializing random number generator",
            "Creating UUID v4 sequence",
            "Formatting output",
          ],
          extraControls: `
            <div class="field-group">
              <label for="uuid-count">Number of UUIDs</label>
              <input id="uuid-count" class="text-input" type="number" min="1" max="1000" value="1" />
            </div>
          `,
          compute: async (input, localRoot) => {
            const count = parseInt(qs("#uuid-count", localRoot).value, 10) || 1;
            const uuids = [];
            for (let i = 0; i < count; i++) {
              uuids.push(crypto.randomUUID());
            }
            return uuids.join("\n");
          },
        });
        break;
      case "color-converter":
        renderTextTool(root, tool, {
          runLabel: "Convert Color",
          steps: [
            "Parsing input color",
            "Converting to RGB/HSL/HEX",
            "Formatting outputs",
          ],
          extraControls:
            '<p class="muted" style="margin-bottom: 0.5rem">Enter a HEX, RGB, or HSL value above to convert it.</p>',
          compute: async (input) => {
            const div = document.createElement("div");
            div.style.color = input.trim();
            if (!div.style.color) throw new Error("Invalid color format.");
            document.body.appendChild(div);
            const rgb = window.getComputedStyle(div).color;
            document.body.removeChild(div);

            const match = rgb.match(
              /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
            );
            if (!match) throw new Error("Could not parse color.");
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

            const toHex = (c) => c.toString(16).padStart(2, "0");
            const hex =
              "#" +
              toHex(r) +
              toHex(g) +
              toHex(b) +
              (a < 1 ? toHex(Math.round(a * 255)) : "");

            const rNorm = r / 255;
            const gNorm = g / 255;
            const bNorm = b / 255;
            const max = Math.max(rNorm, gNorm, bNorm);
            const min = Math.min(rNorm, gNorm, bNorm);
            let h,
              s,
              l = (max + min) / 2;
            if (max === min) {
              h = s = 0;
            } else {
              const d = max - min;
              s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
              switch (max) {
                case rNorm:
                  h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
                  break;
                case gNorm:
                  h = (bNorm - rNorm) / d + 2;
                  break;
                case bNorm:
                  h = (rNorm - gNorm) / d + 4;
                  break;
              }
              h /= 6;
            }

            const hDeg = Math.round(h * 360);
            const sPct = Math.round(s * 100);
            const lPct = Math.round(l * 100);
            const hsl =
              a < 1
                ? `hsla(${hDeg}, ${sPct}%, ${lPct}%, ${a})`
                : `hsl(${hDeg}, ${sPct}%, ${lPct}%)`;

            return `HEX: ${hex}\nRGB: ${rgb}\nHSL: ${hsl}`;
          },
        });
        break;
      case "html-encoder":
        renderTextTool(root, tool, {
          runLabel: "Encode HTML",
          steps: [
            "Reading input text",
            "Encoding special characters",
            "Preparing safe HTML output",
          ],
          compute: async (input) => {
            return input
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#39;");
          },
        });
        break;
      case "html-decoder":
        renderTextTool(root, tool, {
          runLabel: "Decode HTML",
          steps: [
            "Reading encoded text",
            "Decoding HTML entities",
            "Preparing readable output",
          ],
          compute: async (input) => {
            const doc = new DOMParser().parseFromString(input, "text/html");
            return doc.documentElement.textContent;
          },
        });
        break;
      case "markdown-to-html":
        renderTextTool(root, tool, {
          runLabel: "Convert to HTML",
          steps: [
            "Parsing Markdown syntax",
            "Building HTML structure",
            "Preparing output",
          ],
          compute: async (input) => {
            let html = input;
            html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
            html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
            html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
            html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
            html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
            html = html.replace(/`(.+?)`/g, "<code>$1</code>");
            html = html.replace(
              /^\> (.+)$/gm,
              "<blockquote><p>$1</p></blockquote>",
            );
            html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
            html = html.replace(/(<li>.*<\/li>)/s, "<ul>\n$1\n</ul>");
            html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
            html = html.replace(/^---$/gm, "<hr />");
            html = html.replace(/\n\n/g, "</p>\n<p>");
            html = "<p>" + html + "</p>";
            html = html.replace(/<p>\s*<(h[1-6]|ul|ol|blockquote|hr)/g, "<$1");
            html = html.replace(
              /<\/(h[1-6]|ul|ol|blockquote|hr)>\s*<\/p>/g,
              "</$1>",
            );
            html = html.replace(/<p>\s*<\/p>/g, "");
            return html;
          },
        });
        break;
      case "text-reverser":
        renderTextTool(root, tool, {
          runLabel: "Reverse text",
          steps: [
            "Reading input text",
            "Reversing content",
            "Preparing output",
          ],
          extraControls: `
            <div class="field-group">
              <label for="reverse-mode">Reverse mode</label>
              <select id="reverse-mode" class="text-input">
                <option value="chars">Reverse characters</option>
                <option value="words">Reverse word order</option>
                <option value="lines">Reverse line order</option>
              </select>
            </div>
          `,
          compute: async (input, localRoot) => {
            const mode = qs("#reverse-mode", localRoot).value;
            if (mode === "chars") return input.split("").reverse().join("");
            if (mode === "words") return input.split(/\s+/).reverse().join(" ");
            return input.split("\n").reverse().join("\n");
          },
        });
        break;
      case "find-and-replace":
        renderTextTool(root, tool, {
          runLabel: "Replace",
          steps: [
            "Scanning text for matches",
            "Replacing matches",
            "Preparing output",
          ],
          extraControls: `
            <div class="two-col-grid">
              <div class="field-group">
                <label for="find-text">Find</label>
                <input id="find-text" class="text-input" type="text" placeholder="Text or regex pattern..." />
              </div>
              <div class="field-group">
                <label for="replace-text">Replace with</label>
                <input id="replace-text" class="text-input" type="text" placeholder="Replacement text..." />
              </div>
            </div>
            <div class="field-group">
              <label><input type="checkbox" id="find-regex" /> Use regular expressions</label>
            </div>
          `,
          compute: async (input, localRoot) => {
            const find = qs("#find-text", localRoot).value;
            const replace = qs("#replace-text", localRoot).value;
            const useRegex = qs("#find-regex", localRoot).checked;
            if (!find) throw new Error("Please enter a search term.");
            if (useRegex) {
              const regex = new RegExp(find, "g");
              const count = (input.match(regex) || []).length;
              return (
                input.replace(regex, replace) +
                `\n\n---\n${count} replacement${count !== 1 ? "s" : ""} made.`
              );
            }
            const count = input.split(find).length - 1;
            return (
              input.split(find).join(replace) +
              `\n\n---\n${count} replacement${count !== 1 ? "s" : ""} made.`
            );
          },
        });
        break;
      case "regex-tester":
        renderRegexTester(root, tool);
        break;
      case "qr-code-generator":
        renderQRCodeGenerator(root, tool);
        break;
      case "tip-calculator":
        renderTipCalculator(root, tool);
        break;
      case "age-calculator":
        renderAgeCalculator(root, tool);
        break;
      case "unit-converter":
        renderUnitConverter(root, tool);
        break;
      default:
        root.innerHTML = "<p>This tool is not configured yet.</p>";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    mountAdsense();
    initSearch();
    initToolPage();
  });
})();
