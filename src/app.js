// Renders the form and live preview for the document named in <body data-slug>.
(function () {
  const slug = document.body.dataset.slug;
  const doc = slug && DOCS.find(d => d.slug === slug);
  if (!doc) return;

  const form = document.getElementById('form');
  const preview = document.getElementById('preview');

  for (const f of doc.fields) {
    const wrap = document.createElement('label');
    wrap.className = 'field';
    const title = document.createElement('span');
    title.textContent = f.label + (f.optional ? ' (valinnainen)' : '');
    wrap.appendChild(title);

    let input;
    if (f.type === 'select') {
      input = document.createElement('select');
      for (const o of f.options) input.add(new Option(o, o));
    } else if (f.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = f.type || 'text';
    }
    input.name = f.id;
    if (f.placeholder) input.placeholder = f.placeholder;
    if (f.def) input.value = typeof f.def === 'function' ? f.def() : f.def;
    wrap.appendChild(input);

    if (f.help) {
      const help = document.createElement('small');
      help.textContent = f.help;
      wrap.appendChild(help);
    }
    form.appendChild(wrap);
  }

  function values() {
    return Object.fromEntries(new FormData(form).entries());
  }
  function update() {
    preview.textContent = doc.render(values());
  }
  form.addEventListener('input', update);
  update();

  document.getElementById('print').addEventListener('click', () => window.print());
  document.getElementById('copy').addEventListener('click', async e => {
    try {
      await navigator.clipboard.writeText(preview.textContent);
      e.target.textContent = 'Kopioitu ✓';
    } catch {
      e.target.textContent = 'Kopiointi ei onnistunut';
    }
    setTimeout(() => (e.target.textContent = 'Kopioi teksti'), 2000);
  });
})();
