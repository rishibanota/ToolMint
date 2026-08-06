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
    "lorem-ipsum-generator": "Generate placeholder text for design mockups.",
    "yaml-to-json": "name: ToolMint\nversion: 2.0\nfeatures:\n  - fast\n  - private\n  - browser-side\nsettings:\n  theme: dark\n  notifications: true",
    "json-to-yaml": "{\n  \"name\": \"ToolMint\",\n  \"version\": 2,\n  \"features\": [\n    \"fast\",\n    \"private\",\n    \"browser-side\"\n  ],\n  \"settings\": {\n    \"theme\": \"dark\",\n    \"notifications\": true\n  }\n}",
    "md5-generator": "Hello World from ToolMint",
    "text-cleaner": "   This line has extra spaces at start and end.   \n\n\n  This line has   multiple    spaces   between words.\n   This line has extra spaces at start and end.   \n\n<div><p>HTML paragraph to strip</p></div>",
    "diff-checker": "Line 1: Original text\nLine 2: Unchanged content\nLine 3: Text to be deleted",
    "binary-converter": "Hello World",
    "json-minifier": "{\n  \"name\": \"ToolMint\",\n  \"features\": [\n    \"fast\",\n    \"private\"\n  ]\n}",
    "random-number-generator": "10",
    "mac-address-generator": "5",
    "morse-code-converter": "HELLO WORLD",
    "hex-to-text": "48 65 6c 6c 6f 20 57 6f 72 6c 64",
    "text-to-hex": "Hello World",
    "vowel-counter": "Hello from ToolMint! Counting vowels and consonants.",
    "palindrome-checker": "A man a plan a canal Panama",
    "number-to-words": "12345",
    "html-minifier": "<div>\n  <p>Hello World</p>\n  <!-- comment -->\n</div>",
    "sql-formatter": "select user_id, first_name, last_name, email from users where status = 'active' and created_at >= '2026-01-01' order by created_at desc limit 10;",
    "xml-to-json": "<company><name>ToolMint</name><employees><employee><id>101</id><name>Alice</name><role>Developer</role></employee><employee><id>102</id><name>Bob</name><role>Designer</role></employee></employees></company>",
    "url-parser": "https://admin:secret@example.com:8080/api/v1/users?role=developer&status=active&page=2#section-results",
    "duplicate-line-remover": "Apple\nBanana\nApple\nCherry\nBanana\nDate\nApple\nElderberry\nCherry",
    "line-sorter": "Zebra\nApple\nMonkey\nBanana\nElephant\nCat\nDog",
    "sha512-generator": "ToolMint SHA-512 hash example text",
    "json-escape": "Line 1: \"Hello World\"\nLine 2: C:\\Program Files\\ToolMint",
    "simple-interest-calculator": "10000",
    "compound-interest-calculator": "15000",
    "ip-calculator": "192.168.1.50/24",
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
      showToast("Copied to clipboard!", "success");
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      flashButton(trigger, "Copied");
      showToast("Copied to clipboard!", "success");
    }
  }

  function showToast(message, type = "success") {
    let container = qs("#toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${type === "error" ? "✕" : "✓"}</span><span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 2400);
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
      if (workingNote) workingNote.textContent = "";
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
      if (tool.id === "diff-checker") {
        const modInput = qs("#diff-modified-text", root);
        if (modInput) {
          modInput.value = "Line 1: Original text updated\nLine 2: Unchanged content\nLine 4: Newly added text";
        }
      }
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
        <div class="two-col-grid">
          <div class="field-group">
            <label for="qr-size">QR code size</label>
            <select id="qr-size" class="text-input">
              <option value="200">Small (200px)</option>
              <option value="300" selected>Medium (300px)</option>
              <option value="500">Large (500px)</option>
            </select>
          </div>
          <div class="field-group">
            <label for="qr-ec">Error correction</label>
            <select id="qr-ec" class="text-input">
              <option value="L">Low (7%)</option>
              <option value="M" selected>Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
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
    const ecSelect = qs("#qr-ec", root);
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
        if (typeof qrcode === "undefined")
          throw new Error(
            "QR library not loaded. Please refresh and try again.",
          );
        await withProgress(
          root,
          [
            "Encoding data into QR matrix",
            "Applying error correction",
            "Rendering pixel grid",
          ],
          () => {
            const ecLevel = ecSelect.value;
            const qr = qrcode(0, ecLevel);
            qr.addData(text);
            qr.make();
            const moduleCount = qr.getModuleCount();
            const targetSize = Number(sizeSelect.value);
            const margin = 4;
            const totalModules = moduleCount + margin * 2;
            const moduleSize = Math.floor(targetSize / totalModules);
            const actualSize = moduleSize * totalModules;
            canvas.width = actualSize;
            canvas.height = actualSize;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, actualSize, actualSize);
            ctx.fillStyle = "#0b1020";
            for (let r = 0; r < moduleCount; r++) {
              for (let c = 0; c < moduleCount; c++) {
                if (qr.isDark(r, c)) {
                  ctx.fillRect(
                    (c + margin) * moduleSize,
                    (r + margin) * moduleSize,
                    moduleSize,
                    moduleSize,
                  );
                }
              }
            }
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


  function md5(string) {
    function md5cycle(x, k) {
      var a = x[0], b = x[1], c = x[2], d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22, 1236535329);

      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -144468057);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);

      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364409);
      d = hh(d, a, b, c, k[12], 11, -343485551);
      c = hh(c, d, a, b, k[15], 16, -41086007);
      b = hh(b, c, d, a, k[2], 23, 1163531501);

      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894980194);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);

      x[0] = add32(a, x[0]);
      x[1] = add32(b, x[1]);
      x[2] = add32(c, x[2]);
      x[3] = add32(d, x[3]);
    }
    function cmn(q, a, b, x, s, t) {
      a = add32(add32(a, q), add32(x, t));
      return add32((a << s) | (a >>> (32 - s)), b);
    }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
    function add32(a, b) { return (a + b) & 0xFFFFFFFF; }
    
    var utf8 = unescape(encodeURIComponent(string));
    var n = utf8.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= utf8.length; i += 64) {
      var sub = utf8.substring(i - 64, i), k = [];
      for (var j = 0; j < 64; j += 4) {
        k[j >> 2] = sub.charCodeAt(j) + (sub.charCodeAt(j + 1) << 8) + (sub.charCodeAt(j + 2) << 16) + (sub.charCodeAt(j + 3) << 24);
      }
      md5cycle(state, k);
    }
    utf8 = utf8.substring(i - 64);
    var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
    for (i = 0; i < utf8.length; i++) tail[i >> 2] |= utf8.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    var hex = "";
    for (i = 0; i < 4; i++) {
      for (var j = 0; j < 32; j += 8) hex += ("0" + ((state[i] >> j) & 0xFF).toString(16)).slice(-2);
    }
    return hex;
  }

  function yamlToJson(yamlStr) {
    const lines = yamlStr.split("\n");
    const result = {};
    const stack = [{ indent: -1, obj: result }];

    for (let rawLine of lines) {
      const line = rawLine.replace(/#.*/, "");
      if (!line.trim()) continue;
      const indent = rawLine.search(/\S/);
      const trimmed = line.trim();

      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }
      const parent = stack[stack.length - 1].obj;

      if (trimmed.includes(":")) {
        const colonIdx = trimmed.indexOf(":");
        const key = trimmed.slice(0, colonIdx).trim().replace(/^["']|["']$/g, "");
        const valStr = trimmed.slice(colonIdx + 1).trim();

        if (!valStr) {
          const newObj = {};
          parent[key] = newObj;
          stack.push({ indent, obj: newObj });
        } else {
          parent[key] = parseYamlVal(valStr);
        }
      }
    }
    return result;
  }

  function parseYamlVal(str) {
    if (!str) return null;
    if (str === "true") return true;
    if (str === "false") return false;
    if (str === "null" || str === "~") return null;
    if (!isNaN(Number(str)) && str.trim() !== "") return Number(str);
    if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
      return str.slice(1, -1);
    }
    if (str.startsWith("[") && str.endsWith("]")) {
      try { return JSON.parse(str); } catch(e) {}
    }
    return str;
  }

  function jsonToYaml(obj, indent = 0) {
    const spaces = " ".repeat(indent);
    if (obj === null || obj === undefined) return "null";
    if (typeof obj === "boolean" || typeof obj === "number") return String(obj);
    if (typeof obj === "string") {
      if (obj.includes("\n") || obj.includes(":") || obj.includes("#")) {
        return `"${obj.replace(/"/g, '\\"')}"`;
      }
      return obj || '""';
    }
    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]";
      return obj.map(item => {
        if (typeof item === "object" && item !== null) {
          const sub = jsonToYaml(item, indent + 2).trimStart();
          return `${spaces}- ${sub}`;
        }
        return `${spaces}- ${jsonToYaml(item, 0)}`;
      }).join("\n");
    }
    if (typeof obj === "object") {
      const keys = Object.keys(obj);
      if (keys.length === 0) return "{}";
      return keys.map(key => {
        const val = obj[key];
        const formattedKey = key.includes(" ") || key.includes(":") ? `"${key}"` : key;
        if (typeof val === "object" && val !== null) {
          if (Array.isArray(val) && val.length === 0) return `${spaces}${formattedKey}: []`;
          if (!Array.isArray(val) && Object.keys(val).length === 0) return `${spaces}${formattedKey}: {}`;
          return `${spaces}${formattedKey}:\n${jsonToYaml(val, indent + 2)}`;
        }
        return `${spaces}${formattedKey}: ${jsonToYaml(val, 0)}`;
      }).join("\n");
    }
    return String(obj);
  }

  function renderBMICalculator(root, tool) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="field-group">
          <label for="bmi-system">Unit System</label>
          <select id="bmi-system" class="text-input">
            <option value="metric" selected>Metric (kg, cm)</option>
            <option value="imperial">Imperial (lbs, inches)</option>
          </select>
        </div>
        <div class="two-col-grid">
          <div class="field-group">
            <label id="bmi-height-label" for="bmi-height">Height (cm)</label>
            <input id="bmi-height" class="text-input" type="number" min="1" placeholder="175" />
          </div>
          <div class="field-group">
            <label id="bmi-weight-label" for="bmi-weight">Weight (kg)</label>
            <input id="bmi-weight" class="text-input" type="number" min="1" step="0.1" placeholder="70" />
          </div>
        </div>
        <div class="action-row"><button class="btn btn-primary" data-run>Calculate BMI</button><button class="btn btn-secondary" data-sample>Load example</button></div>
        <div class="result-grid" data-result-grid hidden>
          <div class="result-card"><span>BMI Score</span><strong data-bmi>0.0</strong></div>
          <div class="result-card"><span>Category</span><strong data-category>Normal</strong></div>
          <div class="result-card"><span>Healthy Range</span><strong data-range>18.5 - 24.9</strong></div>
        </div>
      </div>
    `;

    const sysSelect = qs("#bmi-system", root);
    sysSelect.addEventListener("change", () => {
      if (sysSelect.value === "metric") {
        qs("#bmi-height-label", root).textContent = "Height (cm)";
        qs("#bmi-height", root).placeholder = "175";
        qs("#bmi-weight-label", root).textContent = "Weight (kg)";
        qs("#bmi-weight", root).placeholder = "70";
      } else {
        qs("#bmi-height-label", root).textContent = "Height (inches)";
        qs("#bmi-height", root).placeholder = "69";
        qs("#bmi-weight-label", root).textContent = "Weight (lbs)";
        qs("#bmi-weight", root).placeholder = "154";
      }
    });

    qs("[data-run]", root).addEventListener("click", async () => {
      try {
        const result = await withProgress(
          root,
          ["Reading physical parameters", "Calculating BMI index", "Determining weight category"],
          () => {
            const system = sysSelect.value;
            const height = Number(qs("#bmi-height", root).value);
            const weight = Number(qs("#bmi-weight", root).value);

            if (!height || height <= 0) throw new Error("Please enter a valid height.");
            if (!weight || weight <= 0) throw new Error("Please enter a valid weight.");

            let bmi;
            if (system === "metric") {
              const heightMeters = height / 100;
              bmi = weight / (heightMeters * heightMeters);
            } else {
              bmi = (weight / (height * height)) * 703;
            }

            let cat = "";
            if (bmi < 18.5) cat = "Underweight";
            else if (bmi < 25) cat = "Normal weight";
            else if (bmi < 30) cat = "Overweight";
            else cat = "Obese";

            return { bmi: bmi.toFixed(1), category: cat };
          }
        );
        qs("[data-result-grid]", root).hidden = false;
        qs("[data-bmi]", root).textContent = result.bmi;
        qs("[data-category]", root).textContent = result.category;
        setStatus(root, "BMI calculation complete.", "success");
      } catch (err) {
        qs("[data-result-grid]", root).hidden = true;
        setStatus(root, err.message, "error");
      }
    });

    qs("[data-sample]", root).addEventListener("click", () => {
      qs("#bmi-system", root).value = "metric";
      qs("#bmi-height", root).value = "175";
      qs("#bmi-weight", root).value = "70";
      setStatus(root, "Loaded a quick example.", "info");
    });
  }

  function renderDiscountCalculator(root, tool) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="three-col-grid">
          <div class="field-group">
            <label for="disc-price">Original price</label>
            <input id="disc-price" class="text-input" type="number" min="0" step="0.01" placeholder="100" />
          </div>
          <div class="field-group">
            <label for="disc-percent">Discount (%)</label>
            <input id="disc-percent" class="text-input" type="number" min="0" max="100" step="0.1" placeholder="20" />
          </div>
          <div class="field-group">
            <label for="disc-tax">Sales Tax (%)</label>
            <input id="disc-tax" class="text-input" type="number" min="0" max="100" step="0.1" value="0" />
          </div>
        </div>
        <div class="action-row"><button class="btn btn-primary" data-run>Calculate Savings</button><button class="btn btn-secondary" data-sample>Load example</button></div>
        <div class="result-grid" data-result-grid hidden>
          <div class="result-card"><span>Final Price</span><strong data-final>₹0.00</strong></div>
          <div class="result-card"><span>You Save</span><strong data-saved>₹0.00</strong></div>
          <div class="result-card"><span>Tax Amount</span><strong data-tax-amt>₹0.00</strong></div>
        </div>
      </div>
    `;

    qs("[data-run]", root).addEventListener("click", async () => {
      try {
        const result = await withProgress(
          root,
          ["Reading price & discount", "Calculating discount savings", "Applying sales tax"],
          () => {
            const price = Number(qs("#disc-price", root).value);
            const discPct = Number(qs("#disc-percent", root).value);
            const taxPct = Number(qs("#disc-tax", root).value) || 0;

            if (!price || price < 0) throw new Error("Please enter a valid original price.");
            if (discPct < 0 || discPct > 100) throw new Error("Please enter a valid discount percentage (0 - 100).");

            const saved = price * (discPct / 100);
            const discountedPrice = price - saved;
            const taxAmt = discountedPrice * (taxPct / 100);
            const finalPrice = discountedPrice + taxAmt;

            return {
              finalPrice: finalPrice.toFixed(2),
              saved: saved.toFixed(2),
              taxAmt: taxAmt.toFixed(2)
            };
          }
        );
        qs("[data-result-grid]", root).hidden = false;
        qs("[data-final]", root).textContent = `₹${result.finalPrice}`;
        qs("[data-saved]", root).textContent = `₹${result.saved}`;
        qs("[data-tax-amt]", root).textContent = `₹${result.taxAmt}`;
        setStatus(root, "Discount calculated successfully.", "success");
      } catch (err) {
        qs("[data-result-grid]", root).hidden = true;
        setStatus(root, err.message, "error");
      }
    });

    qs("[data-sample]", root).addEventListener("click", () => {
      qs("#disc-price", root).value = "1000";
      qs("#disc-percent", root).value = "20";
      qs("#disc-tax", root).value = "5";
      setStatus(root, "Loaded a quick example.", "info");
    });
  }

  function renderSimpleInterestCalculator(root, tool) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="three-col-grid">
          <div class="field-group">
            <label for="si-principal">Principal Amount ($)</label>
            <input id="si-principal" class="text-input" type="number" min="0" step="0.01" placeholder="10000" />
          </div>
          <div class="field-group">
            <label for="si-rate">Interest Rate (% per year)</label>
            <input id="si-rate" class="text-input" type="number" min="0" step="0.1" placeholder="6.5" />
          </div>
          <div class="field-group">
            <label for="si-time">Time Period (Years)</label>
            <input id="si-time" class="text-input" type="number" min="0" step="0.1" placeholder="3" />
          </div>
        </div>
        <div class="action-row">
          <button class="btn btn-primary" data-run>Calculate Interest</button>
          <button class="btn btn-secondary" data-sample>Load example</button>
        </div>
        <div class="result-grid" data-result-grid hidden>
          <div class="result-card"><span>Simple Interest</span><strong data-interest>$0.00</strong></div>
          <div class="result-card"><span>Total Amount</span><strong data-total>$0.00</strong></div>
          <div class="result-card"><span>Monthly Interest</span><strong data-monthly>$0.00</strong></div>
        </div>
      </div>
    `;

    qs("[data-run]", root).addEventListener("click", async () => {
      try {
        const result = await withProgress(
          root,
          ["Reading principal & rate", "Calculating simple interest", "Computing total maturity amount"],
          () => {
            const principal = Number(qs("#si-principal", root).value);
            const rate = Number(qs("#si-rate", root).value);
            const time = Number(qs("#si-time", root).value);

            if (!principal || principal <= 0) throw new Error("Please enter a valid principal amount.");
            if (!rate || rate <= 0) throw new Error("Please enter a valid interest rate.");
            if (!time || time <= 0) throw new Error("Please enter a valid time period in years.");

            const interest = (principal * rate * time) / 100;
            const total = principal + interest;
            const monthly = interest / (time * 12);

            return {
              interest: interest.toFixed(2),
              total: total.toFixed(2),
              monthly: monthly.toFixed(2)
            };
          }
        );
        qs("[data-result-grid]", root).hidden = false;
        qs("[data-interest]", root).textContent = `$${result.interest}`;
        qs("[data-total]", root).textContent = `$${result.total}`;
        qs("[data-monthly]", root).textContent = `$${result.monthly}`;
        setStatus(root, "Simple interest calculated successfully.", "success");
      } catch (err) {
        qs("[data-result-grid]", root).hidden = true;
        setStatus(root, err.message, "error");
      }
    });

    qs("[data-sample]", root).addEventListener("click", () => {
      qs("#si-principal", root).value = "10000";
      qs("#si-rate", root).value = "6.5";
      qs("#si-time", root).value = "3";
      setStatus(root, "Loaded a quick example.", "info");
    });
  }

  function renderCompoundInterestCalculator(root, tool) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="two-col-grid">
          <div class="field-group">
            <label for="ci-principal">Initial Principal ($)</label>
            <input id="ci-principal" class="text-input" type="number" min="0" step="0.01" placeholder="15000" />
          </div>
          <div class="field-group">
            <label for="ci-rate">Annual Interest Rate (%)</label>
            <input id="ci-rate" class="text-input" type="number" min="0" step="0.1" placeholder="7" />
          </div>
        </div>
        <div class="two-col-grid">
          <div class="field-group">
            <label for="ci-time">Investment Term (Years)</label>
            <input id="ci-time" class="text-input" type="number" min="0" step="0.5" placeholder="5" />
          </div>
          <div class="field-group">
            <label for="ci-freq">Compounding Frequency</label>
            <select id="ci-freq" class="text-input">
              <option value="1" selected>Annually (1/yr)</option>
              <option value="2">Semi-Annually (2/yr)</option>
              <option value="4">Quarterly (4/yr)</option>
              <option value="12">Monthly (12/yr)</option>
            </select>
          </div>
        </div>
        <div class="action-row">
          <button class="btn btn-primary" data-run>Calculate Growth</button>
          <button class="btn btn-secondary" data-sample>Load example</button>
        </div>
        <div class="result-grid" data-result-grid hidden>
          <div class="result-card"><span>Ending Balance</span><strong data-balance>$0.00</strong></div>
          <div class="result-card"><span>Compound Interest</span><strong data-interest>$0.00</strong></div>
          <div class="result-card"><span>Total Principal</span><strong data-principal>$0.00</strong></div>
        </div>
      </div>
    `;

    qs("[data-run]", root).addEventListener("click", async () => {
      try {
        const result = await withProgress(
          root,
          ["Reading principal & rate", "Calculating compounding growth", "Formatting ending balance"],
          () => {
            const principal = Number(qs("#ci-principal", root).value);
            const rate = Number(qs("#ci-rate", root).value);
            const time = Number(qs("#ci-time", root).value);
            const freq = Number(qs("#ci-freq", root).value) || 1;

            if (!principal || principal <= 0) throw new Error("Please enter a valid principal amount.");
            if (!rate || rate <= 0) throw new Error("Please enter a valid interest rate.");
            if (!time || time <= 0) throw new Error("Please enter a valid investment term.");

            const r = rate / 100;
            const balance = principal * Math.pow(1 + r / freq, freq * time);
            const interest = balance - principal;

            return {
              balance: balance.toFixed(2),
              interest: interest.toFixed(2),
              principal: principal.toFixed(2)
            };
          }
        );
        qs("[data-result-grid]", root).hidden = false;
        qs("[data-balance]", root).textContent = `$${result.balance}`;
        qs("[data-interest]", root).textContent = `$${result.interest}`;
        qs("[data-principal]", root).textContent = `$${result.principal}`;
        setStatus(root, "Compound interest calculated successfully.", "success");
      } catch (err) {
        qs("[data-result-grid]", root).hidden = true;
        setStatus(root, err.message, "error");
      }
    });

    qs("[data-sample]", root).addEventListener("click", () => {
      qs("#ci-principal", root).value = "15000";
      qs("#ci-rate", root).value = "7";
      qs("#ci-time", root).value = "5";
      qs("#ci-freq", root).value = "1";
      setStatus(root, "Loaded a quick example.", "info");
    });
  }

  function renderAspectRatioCalculator(root, tool) {
    root.innerHTML = `
      ${renderSharedShell(tool.title)}
      <div class="tool-workspace">
        <div class="two-col-grid">
          <div class="field-group">
            <label for="ar-w1">Original Width (px)</label>
            <input id="ar-w1" class="text-input" type="number" min="1" placeholder="1920" value="1920" />
          </div>
          <div class="field-group">
            <label for="ar-h1">Original Height (px)</label>
            <input id="ar-h1" class="text-input" type="number" min="1" placeholder="1080" value="1080" />
          </div>
        </div>
        <div class="two-col-grid">
          <div class="field-group">
            <label for="ar-w2">New Target Width (px)</label>
            <input id="ar-w2" class="text-input" type="number" min="1" placeholder="1280" />
          </div>
          <div class="field-group">
            <label for="ar-h2">New Target Height (px)</label>
            <input id="ar-h2" class="text-input" type="number" min="1" placeholder="Optional..." />
          </div>
        </div>
        <div class="action-row"><button class="btn btn-primary" data-run>Calculate Aspect Ratio</button><button class="btn btn-secondary" data-sample>Load example</button></div>
        <div class="result-grid" data-result-grid hidden>
          <div class="result-card"><span>Aspect Ratio</span><strong data-ratio>16:9</strong></div>
          <div class="result-card"><span>New Dimensions</span><strong data-dim>1280 × 720 px</strong></div>
        </div>
      </div>
    `;

    qs("[data-run]", root).addEventListener("click", async () => {
      try {
        const result = await withProgress(
          root,
          ["Reading original dimensions", "Calculating ratio", "Computing target dimensions"],
          () => {
            const w1 = Number(qs("#ar-w1", root).value);
            const h1 = Number(qs("#ar-h1", root).value);
            let w2 = Number(qs("#ar-w2", root).value);
            let h2 = Number(qs("#ar-h2", root).value);

            if (!w1 || w1 <= 0 || !h1 || h1 <= 0) {
              throw new Error("Please enter valid positive original dimensions.");
            }

            const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
            const common = gcd(w1, h1);
            const ratioStr = `${w1 / common}:${h1 / common}`;

            if (w2 && w2 > 0) {
              h2 = Math.round((w2 * h1) / w1);
            } else if (h2 && h2 > 0) {
              w2 = Math.round((h2 * w1) / h1);
            } else {
              w2 = 1280;
              h2 = Math.round((w2 * h1) / w1);
            }

            return { ratio: ratioStr, dimensions: `${w2} × ${h2} px` };
          }
        );
        qs("[data-result-grid]", root).hidden = false;
        qs("[data-ratio]", root).textContent = result.ratio;
        qs("[data-dim]", root).textContent = result.dimensions;
        setStatus(root, "Aspect ratio calculated successfully.", "success");
      } catch (err) {
        qs("[data-result-grid]", root).hidden = true;
        setStatus(root, err.message, "error");
      }
    });

    qs("[data-sample]", root).addEventListener("click", () => {
      qs("#ar-w1", root).value = "1920";
      qs("#ar-h1", root).value = "1080";
      qs("#ar-w2", root).value = "1280";
      qs("#ar-h2", root).value = "";
      setStatus(root, "Loaded a quick example.", "info");
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
        const matches = !q || hay.includes(q);
        if (matches) {
          card.classList.remove("card-hide");
        } else {
          card.classList.add("card-hide");
        }
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
      case "lorem-ipsum-generator":
        renderTextTool(root, tool, {
          runLabel: "Generate Lorem Ipsum",
          steps: ["Configuring text parameters", "Building paragraph structures", "Formatting text output"],
          extraControls: `
            <div class="two-col-grid">
              <div class="field-group">
                <label for="lorem-count">Amount</label>
                <input id="lorem-count" class="text-input" type="number" min="1" max="100" value="3" />
              </div>
              <div class="field-group">
                <label for="lorem-unit">Unit</label>
                <select id="lorem-unit" class="text-input">
                  <option value="paragraphs">Paragraphs</option>
                  <option value="sentences">Sentences</option>
                  <option value="words">Words</option>
                </select>
              </div>
            </div>
            <div class="field-group">
              <label><input type="checkbox" id="lorem-start" checked /> Start with "Lorem ipsum dolor sit amet..."</label>
            </div>
          `,
          compute: async (input, localRoot) => {
            const count = parseInt(qs("#lorem-count", localRoot).value, 10) || 3;
            const unit = qs("#lorem-unit", localRoot).value;
            const startWithLorem = qs("#lorem-start", localRoot).checked;

            const wordsList = [
              "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
              "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
              "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
              "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
              "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
              "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
              "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
              "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
            ];

            const getRandomWord = () => wordsList[Math.floor(Math.random() * wordsList.length)];
            const getRandomSentence = (numWords = 8) => {
              let s = [];
              for (let i = 0; i < numWords; i++) s.push(getRandomWord());
              return s[0].charAt(0).toUpperCase() + s.slice(1).join(" ") + ".";
            };

            if (unit === "words") {
              let res = [];
              if (startWithLorem && count >= 5) {
                res = ["Lorem", "ipsum", "dolor", "sit", "amet"];
                for (let i = 5; i < count; i++) res.push(getRandomWord());
              } else {
                for (let i = 0; i < count; i++) res.push(getRandomWord());
              }
              return res.join(" ");
            } else if (unit === "sentences") {
              let res = [];
              for (let i = 0; i < count; i++) res.push(getRandomSentence(6 + Math.floor(Math.random() * 6)));
              if (startWithLorem && res.length > 0) {
                res[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
              }
              return res.join(" ");
            } else {
              let paragraphs = [];
              for (let p = 0; p < count; p++) {
                let sentences = [];
                const sCount = 3 + Math.floor(Math.random() * 3);
                for (let s = 0; s < sCount; s++) sentences.push(getRandomSentence(7 + Math.floor(Math.random() * 6)));
                paragraphs.push(sentences.join(" "));
              }
              if (startWithLorem && paragraphs.length > 0) {
                paragraphs[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + paragraphs[0].slice(paragraphs[0].indexOf(".") + 2);
              }
              return paragraphs.join("\n\n");
            }
          }
        });
        break;

      case "yaml-to-json":
        renderTextTool(root, tool, {
          runLabel: "Convert YAML to JSON",
          steps: ["Parsing YAML syntax", "Converting data hierarchy", "Formatting JSON output"],
          compute: async (input) => {
            if (!input.trim()) throw new Error("Please enter YAML data.");
            const parsed = yamlToJson(input);
            return JSON.stringify(parsed, null, 2);
          }
        });
        break;

      case "json-to-yaml":
        renderTextTool(root, tool, {
          runLabel: "Convert JSON to YAML",
          steps: ["Validating JSON input", "Mapping object keys", "Generating clean YAML structure"],
          compute: async (input) => {
            if (!input.trim()) throw new Error("Please enter JSON data.");
            const parsed = JSON.parse(input);
            return jsonToYaml(parsed);
          }
        });
        break;

      case "md5-generator":
        renderTextTool(root, tool, {
          runLabel: "Generate MD5 Hash",
          steps: ["Reading input string", "Calculating MD5 digest", "Formatting hexadecimal output"],
          compute: async (input) => {
            return md5(input);
          }
        });
        break;

      case "text-cleaner":
        renderTextTool(root, tool, {
          runLabel: "Clean Text",
          steps: ["Scanning lines and whitespace", "Applying selected filters", "Formatting clean result"],
          extraControls: `
            <div class="field-group">
              <label><input type="checkbox" id="clean-trim-lines" checked /> Trim spaces at line start/end</label><br>
              <label><input type="checkbox" id="clean-extra-spaces" checked /> Collapse multiple spaces into one space</label><br>
              <label><input type="checkbox" id="clean-empty-lines" checked /> Remove empty lines</label><br>
              <label><input type="checkbox" id="clean-dup-lines" /> Remove duplicate lines</label><br>
              <label><input type="checkbox" id="clean-strip-html" /> Strip HTML tags</label>
            </div>
          `,
          compute: async (input, localRoot) => {
            const trimLines = qs("#clean-trim-lines", localRoot).checked;
            const collapseSpaces = qs("#clean-extra-spaces", localRoot).checked;
            const removeEmpty = qs("#clean-empty-lines", localRoot).checked;
            const removeDups = qs("#clean-dup-lines", localRoot).checked;
            const stripHtml = qs("#clean-strip-html", localRoot).checked;

            let text = input;
            if (stripHtml) {
              text = text.replace(/<[^>]*>/g, "");
            }
            let lines = text.split("\n");
            if (trimLines) {
              lines = lines.map((l) => l.trim());
            }
            if (collapseSpaces) {
              lines = lines.map((l) => l.replace(/ +/g, " "));
            }
            if (removeEmpty) {
              lines = lines.filter((l) => l.length > 0);
            }
            if (removeDups) {
              lines = Array.from(new Set(lines));
            }
            return lines.join("\n");
          }
        });
        break;

      case "diff-checker":
        renderTextTool(root, tool, {
          runLabel: "Compare Text",
          steps: ["Analyzing original text", "Analyzing modified text", "Calculating line differences"],
          extraControls: `
            <div class="field-group">
              <label for="diff-modified-text">Modified Text (Comparison)</label>
              <textarea id="diff-modified-text" class="big-textarea" placeholder="Paste modified text here..."></textarea>
            </div>
          `,
          compute: async (input, localRoot) => {
            const modified = qs("#diff-modified-text", localRoot).value;
            const origLines = input.split("\n");
            const modLines = modified.split("\n");

            let diffOutput = [];
            let added = 0;
            let removed = 0;
            let unchanged = 0;

            let i = 0, j = 0;

            while (i < origLines.length || j < modLines.length) {
              if (i < origLines.length && j < modLines.length) {
                if (origLines[i] === modLines[j]) {
                  diffOutput.push(`  ${origLines[i]}`);
                  i++; j++; unchanged++;
                } else if (modLines.slice(j).includes(origLines[i])) {
                  diffOutput.push(`+ ${modLines[j]}`);
                  j++; added++;
                } else {
                  diffOutput.push(`- ${origLines[i]}`);
                  i++; removed++;
                }
              } else if (i < origLines.length) {
                diffOutput.push(`- ${origLines[i]}`);
                i++; removed++;
              } else {
                diffOutput.push(`+ ${modLines[j]}`);
                j++; added++;
              }
            }

            return `--- Differences ---\n+ Added: ${added} line(s)\n- Removed: ${removed} line(s)\n  Unchanged: ${unchanged} line(s)\n\n--- Line Diff ---\n${diffOutput.join("\n")}`;
          }
        });
        break;

      case "bmi-calculator":
        renderBMICalculator(root, tool);
        break;

      case "discount-calculator":
        renderDiscountCalculator(root, tool);
        break;

      case "aspect-ratio-calculator":
        renderAspectRatioCalculator(root, tool);
        break;

      case "binary-converter":
        renderTextTool(root, tool, {
          runLabel: "Convert Binary",
          steps: ["Reading input data", "Executing binary transformation", "Formatting result"],
          extraControls: `
            <div class="field-group">
              <label for="binary-mode">Conversion mode</label>
              <select id="binary-mode" class="text-input">
                <option value="text-to-bin">Text to Binary</option>
                <option value="bin-to-text">Binary to Text</option>
                <option value="dec-to-bin">Decimal Number to Binary</option>
                <option value="bin-to-dec">Binary to Decimal Number</option>
              </select>
            </div>
          `,
          compute: async (input, localRoot) => {
            const mode = qs("#binary-mode", localRoot).value;
            const str = input.trim();
            if (!str) throw new Error("Please enter input text or binary code.");

            if (mode === "text-to-bin") {
              return str
                .split("")
                .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
                .join(" ");
            } else if (mode === "bin-to-text") {
              const cleanBin = str.replace(/[^01\s]/g, "");
              const bytes = cleanBin.split(/\s+/).filter(Boolean);
              return bytes.map((b) => String.fromCharCode(parseInt(b, 2))).join("");
            } else if (mode === "dec-to-bin") {
              const num = parseInt(str, 10);
              if (isNaN(num)) throw new Error("Invalid decimal number.");
              return num.toString(2);
            } else {
              const cleanBin = str.replace(/[^01]/g, "");
              if (!cleanBin) throw new Error("Invalid binary string.");
              return parseInt(cleanBin, 2).toString(10);
            }
          }
        });
        break;

      case "json-minifier":
        renderTextTool(root, tool, {
          runLabel: "Minify JSON",
          steps: ["Parsing JSON", "Minifying data", "Preparing output"],
          compute: async (input) => {
            if (!input.trim()) throw new Error("Please enter JSON data.");
            const parsed = JSON.parse(input);
            return JSON.stringify(parsed);
          }
        });
        break;

      case "random-number-generator":
        renderTextTool(root, tool, {
          runLabel: "Generate Numbers",
          steps: ["Parsing range", "Generating random numbers", "Formatting output"],
          extraControls: `
            <div class="two-col-grid">
              <div class="field-group">
                <label for="rand-min">Min</label>
                <input id="rand-min" class="text-input" type="number" value="1" />
              </div>
              <div class="field-group">
                <label for="rand-max">Max</label>
                <input id="rand-max" class="text-input" type="number" value="100" />
              </div>
            </div>
          `,
          compute: async (input, localRoot) => {
            const count = parseInt(input.trim()) || 1;
            const min = parseInt(qs("#rand-min", localRoot).value);
            const max = parseInt(qs("#rand-max", localRoot).value);
            if (isNaN(min) || isNaN(max)) throw new Error("Min and Max must be valid numbers.");
            if (min > max) throw new Error("Min must be less than or equal to Max.");
            const result = [];
            for (let i = 0; i < count; i++) {
              result.push(Math.floor(Math.random() * (max - min + 1)) + min);
            }
            return result.join("\n");
          }
        });
        break;

      case "mac-address-generator":
        renderTextTool(root, tool, {
          runLabel: "Generate MAC Addresses",
          steps: ["Generating random bytes", "Formatting MAC addresses", "Preparing output"],
          compute: async (input) => {
            const count = parseInt(input.trim()) || 1;
            const result = [];
            const hexChars = "0123456789ABCDEF";
            for (let i = 0; i < count; i++) {
              let mac = [];
              for (let j = 0; j < 6; j++) {
                mac.push(hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)]);
              }
              result.push(mac.join(":"));
            }
            return result.join("\n");
          }
        });
        break;

      case "morse-code-converter":
        renderTextTool(root, tool, {
          runLabel: "Convert Morse",
          steps: ["Parsing input", "Converting characters", "Formatting result"],
          extraControls: `
            <div class="field-group">
              <label for="morse-mode">Conversion mode</label>
              <select id="morse-mode" class="text-input">
                <option value="text-to-morse">Text to Morse</option>
                <option value="morse-to-text">Morse to Text</option>
              </select>
            </div>
          `,
          compute: async (input, localRoot) => {
            const mode = qs("#morse-mode", localRoot).value;
            const morseMap = {
              'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
              'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
              'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
              'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
              'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
              '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
              '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
              '\'': '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
              '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
              '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
              ' ': '/'
            };
            if (mode === "text-to-morse") {
              return input.toUpperCase().split('').map(char => morseMap[char] || char).join(' ');
            } else {
              const reverseMap = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]));
              return input.split(' ').map(code => reverseMap[code] || code).join('').replace(/\//g, ' ');
            }
          }
        });
        break;

      case "hex-to-text":
        renderTextTool(root, tool, {
          runLabel: "Convert Hex to Text",
          steps: ["Parsing hex pairs", "Decoding characters", "Preparing output"],
          compute: async (input) => {
            const hex = input.replace(/\s/g, "");
            let text = "";
            for (let i = 0; i < hex.length; i += 2) {
              text += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            }
            return text;
          }
        });
        break;

      case "text-to-hex":
        renderTextTool(root, tool, {
          runLabel: "Convert Text to Hex",
          steps: ["Reading characters", "Encoding to hex", "Preparing output"],
          compute: async (input) => {
            return input.split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
          }
        });
        break;

      case "vowel-counter":
        renderTextTool(root, tool, {
          runLabel: "Count Vowels",
          steps: ["Scanning text", "Counting characters", "Formatting result"],
          compute: async (input) => {
            const vowels = (input.match(/[aeiou]/gi) || []).length;
            const consonants = (input.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
            return `Vowels: ${vowels}\nConsonants: ${consonants}\nTotal letters: ${vowels + consonants}`;
          }
        });
        break;

      case "palindrome-checker":
        renderTextTool(root, tool, {
          runLabel: "Check Palindrome",
          steps: ["Sanitizing text", "Comparing strings", "Preparing result"],
          compute: async (input) => {
            const clean = input.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
            const reversed = clean.split("").reverse().join("");
            if (clean.length === 0) throw new Error("Please enter some text.");
            const isPal = clean === reversed;
            return isPal ? "Yes, this is a palindrome!" : "No, this is not a palindrome.";
          }
        });
        break;

      case "number-to-words":
        renderTextTool(root, tool, {
          runLabel: "Convert to Words",
          steps: ["Parsing number", "Translating digits", "Preparing output"],
          compute: async (input) => {
            const num = parseInt(input.trim().replace(/,/g, ""));
            if (isNaN(num)) throw new Error("Please enter a valid number.");
            
            const a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
            const b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

            const inWords = (num) => {
                if ((num = num.toString()).length > 9) return 'overflow';
                const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
                if (!n) return '';
                let str = '';
                str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
                str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
                str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
                str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
                str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
                return str.trim();
            };
            if (num === 0) return "zero";
            return inWords(num);
          }
        });
        break;

      case "html-minifier":
        renderTextTool(root, tool, {
          runLabel: "Minify HTML",
          steps: ["Parsing HTML", "Removing whitespace", "Preparing output"],
          compute: async (input) => {
            return input
              .replace(/<!--[\s\S]*?-->/g, "")
              .replace(/>\s+</g, "><")
              .replace(/\s{2,}/g, " ")
              .trim();
          }
        });
        break;

      case "sql-formatter":
        renderTextTool(root, tool, {
          runLabel: "Format SQL",
          steps: ["Parsing SQL tokens", "Capitalizing keywords", "Formatting clauses"],
          compute: async (input) => {
            if (!input || !input.trim()) throw new Error("Please enter a SQL query to format.");
            let sql = input.trim();
            const keywords = [
              "SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN",
              "CROSS JOIN", "ON", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "INSERT INTO",
              "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE", "ALTER TABLE", "DROP TABLE",
              "AND", "OR", "NOT", "IN", "IS NULL", "IS NOT NULL", "LIKE", "AS", "UNION", "ALL",
              "CASE", "WHEN", "THEN", "ELSE", "END", "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT"
            ];
            keywords.forEach((kw) => {
              const regex = new RegExp(`\\b${kw.replace(" ", "\\s+")}\\b`, "gi");
              sql = sql.replace(regex, kw);
            });
            const newLineClauses = [
              "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
              "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "CROSS JOIN",
              "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM"
            ];
            newLineClauses.forEach((clause) => {
              const regex = new RegExp(`\\s+\\b${clause.replace(" ", "\\s+")}\\b`, "g");
              sql = sql.replace(regex, `\n${clause}`);
            });
            sql = sql.replace(/,([^\s\n])/g, ", $1");
            return sql;
          }
        });
        break;

      case "xml-to-json":
        renderTextTool(root, tool, {
          runLabel: "Convert to JSON",
          steps: ["Reading XML markup", "Building document tree", "Formatting JSON output"],
          compute: async (input) => {
            if (!input || !input.trim()) throw new Error("Please enter XML data.");
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(input.trim(), "text/xml");
            const parserError = xmlDoc.querySelector("parsererror");
            if (parserError) throw new Error("Invalid XML: " + parserError.textContent);

            function domToObj(node) {
              if (node.nodeType === 3) return node.nodeValue.trim();
              if (node.nodeType !== 1) return null;
              let obj = {};
              if (node.attributes && node.attributes.length > 0) {
                for (let i = 0; i < node.attributes.length; i++) {
                  const attr = node.attributes[i];
                  obj[`@${attr.nodeName}`] = attr.nodeValue;
                }
              }
              let hasElementChildren = false;
              for (let i = 0; i < node.childNodes.length; i++) {
                const child = node.childNodes[i];
                if (child.nodeType === 1) {
                  hasElementChildren = true;
                  const childName = child.nodeName;
                  const childObj = domToObj(child);
                  if (obj[childName] !== undefined) {
                    if (!Array.isArray(obj[childName])) {
                      obj[childName] = [obj[childName]];
                    }
                    obj[childName].push(childObj);
                  } else {
                    obj[childName] = childObj;
                  }
                }
              }
              if (!hasElementChildren) {
                const text = node.textContent.trim();
                if (Object.keys(obj).length === 0) return text;
                if (text) obj["#text"] = text;
              }
              return obj;
            }

            const rootObj = {};
            rootObj[xmlDoc.documentElement.nodeName] = domToObj(xmlDoc.documentElement);
            return JSON.stringify(rootObj, null, 2);
          }
        });
        break;

      case "url-parser":
        renderTextTool(root, tool, {
          runLabel: "Parse URL",
          steps: ["Validating URL", "Extracting parameters", "Generating JSON summary"],
          compute: async (input) => {
            if (!input || !input.trim()) throw new Error("Please enter a URL to parse.");
            let str = input.trim();
            if (!/^https?:\/\//i.test(str)) {
              str = "https://" + str;
            }
            const u = new URL(str);
            const queryParams = {};
            u.searchParams.forEach((val, key) => {
              if (queryParams[key] !== undefined) {
                if (!Array.isArray(queryParams[key])) {
                  queryParams[key] = [queryParams[key]];
                }
                queryParams[key].push(val);
              } else {
                queryParams[key] = val;
              }
            });
            return JSON.stringify(
              {
                href: u.href,
                protocol: u.protocol,
                origin: u.origin,
                host: u.host,
                hostname: u.hostname,
                port: u.port || (u.protocol === "https:" ? "443" : "80"),
                pathname: u.pathname,
                search: u.search,
                hash: u.hash,
                queryParameters: queryParams,
              },
              null,
              2
            );
          }
        });
        break;

      case "duplicate-line-remover":
        renderTextTool(root, tool, {
          runLabel: "Remove Duplicates",
          steps: ["Scanning lines", "Filtering unique entries", "Preparing output"],
          compute: async (input) => {
            if (!input) return "";
            const lines = input.split("\n");
            const seen = new Set();
            const result = [];
            lines.forEach((line) => {
              if (!seen.has(line)) {
                seen.add(line);
                result.push(line);
              }
            });
            return result.join("\n");
          }
        });
        break;

      case "line-sorter":
        renderTextTool(root, tool, {
          runLabel: "Sort Lines",
          steps: ["Reading lines", "Sorting alphabetically", "Preparing output"],
          extraControls: `
            <div class="field-group">
              <label for="sort-direction">Sort Order</label>
              <select id="sort-direction" class="text-input">
                <option value="asc">A to Z (Alphabetical)</option>
                <option value="desc">Z to A (Reverse Alphabetical)</option>
                <option value="length">By Line Length (Short to Long)</option>
              </select>
            </div>
          `,
          compute: async (input, localRoot) => {
            if (!input) return "";
            const dir = qs("#sort-direction", localRoot).value;
            const lines = input.split("\n");
            if (dir === "asc") {
              lines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
            } else if (dir === "desc") {
              lines.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: "base" }));
            } else if (dir === "length") {
              lines.sort((a, b) => a.length - b.length);
            }
            return lines.join("\n");
          }
        });
        break;

      case "sha512-generator":
        renderTextTool(root, tool, {
          runLabel: "Generate SHA-512 Hash",
          steps: ["Encoding text bytes", "Computing SHA-512 digest", "Formatting hex hash"],
          compute: async (input) => {
            const encoder = new TextEncoder();
            const data = encoder.encode(input || "");
            const hashBuffer = await crypto.subtle.digest("SHA-512", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
          }
        });
        break;

      case "json-escape":
        renderTextTool(root, tool, {
          runLabel: "Escape / Unescape",
          steps: ["Reading input string", "Applying JSON escape rules", "Preparing output"],
          compute: async (input) => {
            if (!input) return "";
            const trimmed = input.trim();
            if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
              try {
                return JSON.parse(trimmed);
              } catch {
                // fallthrough
              }
            }
            return JSON.stringify(input);
          }
        });
        break;

      case "ip-calculator":
        renderTextTool(root, tool, {
          runLabel: "Calculate Subnet",
          steps: ["Parsing IPv4 address", "Calculating CIDR mask", "Formatting network info"],
          compute: async (input) => {
            if (!input || !input.trim()) throw new Error("Please enter an IPv4 address with CIDR (e.g. 192.168.1.1/24).");
            const match = input.trim().match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
            if (!match) throw new Error("Invalid CIDR format. Use format like 192.168.1.1/24");
            const ipStr = match[1];
            const maskBits = parseInt(match[2], 10);
            if (maskBits < 0 || maskBits > 32) throw new Error("Prefix length must be between 0 and 32.");
            const ipOctets = ipStr.split(".").map(Number);
            if (ipOctets.some((o) => o < 0 || o > 255)) throw new Error("Invalid IPv4 address octets.");

            const maskNum = maskBits === 0 ? 0 : (~0 << (32 - maskBits)) >>> 0;
            const wildcardNum = (~maskNum) >>> 0;
            const ipNum = ((ipOctets[0] << 24) | (ipOctets[1] << 16) | (ipOctets[2] << 8) | ipOctets[3]) >>> 0;
            const netNum = (ipNum & maskNum) >>> 0;
            const bcastNum = (netNum | wildcardNum) >>> 0;

            const numToIp = (num) =>
              [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join(".");

            const totalHosts = Math.pow(2, 32 - maskBits);
            const usableHosts = maskBits >= 31 ? 0 : totalHosts - 2;
            const firstHost = maskBits >= 31 ? "N/A" : numToIp(netNum + 1);
            const lastHost = maskBits >= 31 ? "N/A" : numToIp(bcastNum - 1);

            return JSON.stringify(
              {
                ipAddress: ipStr,
                cidr: `/${maskBits}`,
                subnetMask: numToIp(maskNum),
                wildcardMask: numToIp(wildcardNum),
                networkAddress: numToIp(netNum),
                broadcastAddress: numToIp(bcastNum),
                firstUsableHost: firstHost,
                lastUsableHost: lastHost,
                totalHosts: totalHosts,
                usableHosts: usableHosts,
              },
              null,
              2
            );
          }
        });
        break;

      case "simple-interest-calculator":
        renderSimpleInterestCalculator(root, tool);
        break;

      case "compound-interest-calculator":
        renderCompoundInterestCalculator(root, tool);
        break;

      default:
        root.innerHTML = "<p>This tool is not configured yet.</p>";
    }
  }

  function initAnimations() {
    // Utility to throttle mousemove with requestAnimationFrame
    function addThrottledMouseMove(element, cssVarPrefix) {
      if (!element) return;
      let ticking = false;
      element.addEventListener("mousemove", (e) => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const rect = element.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            element.style.setProperty(`--${cssVarPrefix}-x`, `${x.toFixed(1)}%`);
            element.style.setProperty(`--${cssVarPrefix}-y`, `${y.toFixed(1)}%`);
            ticking = false;
          });
          ticking = true;
        }
      });
    }

    // 1. Mouse Spotlight Glow Tracking on Cards
    const interactiveCards = qsa(".tool-card, .category-card, .info-card, .side-card, .stat, .preview-card");
    interactiveCards.forEach((card) => {
      addThrottledMouseMove(card, "mouse");
    });

    // 1b. Mouse Spotlight Glow Tracking on Hero & Main Background
    const heroSections = qsa(".hero, .page-hero");
    heroSections.forEach((hero) => {
      addThrottledMouseMove(hero, "hero-mouse");
    });

    const mainElement = qs("main");
    addThrottledMouseMove(mainElement, "main-mouse");

    // 2. Ripple Effect on Buttons & Interactive Links
    document.addEventListener("click", (e) => {
      const target = e.target.closest(".btn, .mini-btn, .pill, .tool-card, .category-card");
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      target.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });

    // 3. Header Scroll Glassmorphic Transformation
    const header = qs(".site-header");
    if (header) {
      const handleScroll = () => {
        if (window.scrollY > 20) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
    }

    // 4. Scroll Reveal with IntersectionObserver
    const observerElements = qsa(".stat, .info-card, .preview-card, .section-heading, .faq-item");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
      );

      observerElements.forEach((el, index) => {
        el.classList.add("reveal-on-scroll");
        el.style.transitionDelay = `${(index % 6) * 0.07}s`;
        observer.observe(el);
      });
    } else {
      observerElements.forEach((el) => el.classList.add("is-visible"));
    }

    // 5. Stat Counter Count-up Animation
    const stats = qsa(".stat strong");
    if (stats.length > 0 && "IntersectionObserver" in window) {
      const statObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const text = el.textContent.trim();
              const numMatch = text.match(/\d+/);
              if (numMatch) {
                const targetNum = parseInt(numMatch[0], 10);
                const suffix = text.replace(numMatch[0], "");
                const duration = 1200;
                const startTime = performance.now();
                const animateCount = (now) => {
                  const elapsed = now - startTime;
                  const progress = Math.min(1, elapsed / duration);
                  const easeProgress = 1 - Math.pow(1 - progress, 3);
                  const current = Math.floor(easeProgress * targetNum);
                  el.textContent = `${current}${suffix}`;
                  if (progress < 1) {
                    requestAnimationFrame(animateCount);
                  } else {
                    el.textContent = text;
                  }
                };
                requestAnimationFrame(animateCount);
              }
              statObserver.unobserve(el);
            }
          });
        },
        { threshold: 0.5 }
      );
      stats.forEach((stat) => statObserver.observe(stat));
    }
  }


  function initFeedbackSection() {
    const main = qs("main");
    if (!main || qs("#feedback-section")) return;

    const feedbackSec = document.createElement("section");
    feedbackSec.id = "feedback-section";
    feedbackSec.className = "section feedback-section";
    feedbackSec.innerHTML = `
      <div class="container">
        <div class="feedback-card">
          <div class="feedback-head">
            <span class="eyebrow">💬 We value your thoughts</span>
            <h2>Have Feedback or Tool Suggestions?</h2>
            <p class="hero-copy">Found a bug, want a new tool added, or have an idea to improve ToolMint? Type your message below to send it directly to our team!</p>
          </div>
          <form id="feedback-form" class="feedback-form">
            <div class="two-col-grid">
              <div class="field-group">
                <label for="fb-name">Your Name (Optional)</label>
                <input id="fb-name" class="text-input" type="text" placeholder="e.g. Alex" />
              </div>
              <div class="field-group">
                <label for="fb-subject">Feedback Type</label>
                <select id="fb-subject" class="text-input">
                  <option value="General Feedback" selected>General Feedback</option>
                  <option value="New Tool Request">New Tool Request</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Other">Other Inquiry</option>
                </select>
              </div>
            </div>
            <div class="field-group">
              <label for="fb-message">Your Message *</label>
              <textarea id="fb-message" class="big-textarea" rows="4" placeholder="Write your feedback or tool suggestion here..." required></textarea>
            </div>
            <div class="action-row">
              <button type="submit" class="btn btn-primary btn-glow">
                <span>Send Feedback via Email</span>
                <span aria-hidden="true">✉️</span>
              </button>
            </div>
            <div id="fb-status" class="fb-status-msg" hidden></div>
          </form>
        </div>
      </div>
    `;

    main.appendChild(feedbackSec);

    const form = qs("#feedback-form", feedbackSec);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = qs("#fb-name", feedbackSec).value.trim() || "Anonymous";
      const subject = qs("#fb-subject", feedbackSec).value;
      const message = qs("#fb-message", feedbackSec).value.trim();
      const statusNode = qs("#fb-status", feedbackSec);

      if (!message) {
        statusNode.hidden = false;
        statusNode.className = "fb-status-msg error";
        statusNode.textContent = "Please write a message before sending.";
        return;
      }

      const recipientEmail = "rishibanota837@gmail.com";
      const emailSubject = `[ToolMint Feedback] ${subject}`;
      const pageUrl = window.location.href;
      const pageTitle = document.title;
      
      const emailBody = `Name: ${name}
Page Title: ${pageTitle}
Page URL: ${pageUrl}
Feedback Type: ${subject}

Message:
${message}`;

      const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      statusNode.hidden = false;
      statusNode.className = "fb-status-msg success";
      statusNode.textContent = "Redirecting to your email app to send your message to rishibanota837@gmail.com...";

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);
    });
  }

  function initMobileNav() {
    const headerInner = qs(".header-inner");
    const nav = qs(".nav");
    if (!headerInner || !nav) return;

    let toggle = qs(".mobile-nav-toggle");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.className = "mobile-nav-toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-label", "Toggle Navigation");
      toggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line class="line-1" x1="4" y1="6" x2="20" y2="6"></line><line class="line-2" x1="4" y1="12" x2="20" y2="12"></line><line class="line-3" x1="4" y1="18" x2="20" y2="18"></line></svg>`;
      headerInner.appendChild(toggle);
    }

    toggle.onclick = (e) => {
      e.stopPropagation();
      nav.classList.toggle("open");
      toggle.classList.toggle("active");
    };

    document.addEventListener("click", (e) => {
      if (!headerInner.contains(e.target) && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.classList.remove("active");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    mountAdsense();
    initSearch();
    initToolPage();
    initAnimations();
    initMobileNav();
    initFeedbackSection();
  });
})();
