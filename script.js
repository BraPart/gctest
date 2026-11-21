(() => {
  'use strict';

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  const closeNav = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', e => { if (e.target.closest('a, button')) closeNav(); });

  // Accessible tabs (arrow keys, Home, End)
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const tabs = [...group.querySelectorAll('[role=tab]')];
    const select = tab => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        group.querySelector('#' + t.getAttribute('aria-controls')).hidden = !on;
      });
      tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', e => {
        const keys = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (e.key in keys) {
          e.preventDefault();
          select(tabs[(keys[e.key] + tabs.length) % tabs.length]);
        }
      });
    });
  });

  // Count-up numbers (runs once when the stats strip scrolls into view)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = document.querySelectorAll('[data-count]');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        const el = entry.target, end = +el.dataset.count, suffix = el.dataset.suffix || '';
        const start = performance.now(), dur = 1400;
        const tick = now => {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suffix : '');
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach(c => io.observe(c));
  }

  // Dialogs: open, close, click outside to close
  document.querySelectorAll('[data-open]').forEach(btn =>
    btn.addEventListener('click', () => document.getElementById(btn.dataset.open).showModal()));
  document.querySelectorAll('dialog').forEach(d => {
    d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  });

  // Project lightbox
  const box = document.getElementById('lightbox');
  const boxImg = box.querySelector('img');
  document.querySelector('.gallery').addEventListener('click', e => {
    const b = e.target.closest('button[data-full]');
    if (!b) return;
    boxImg.src = b.dataset.full;
    boxImg.alt = b.querySelector('img').alt;
    box.showModal();
  });

  // Join us form: country, dependent city list and phone country code
  const join = document.querySelector('#join-dialog form');
  if (join && window.GEO) {
    const { countries, cities } = window.GEO;
    const byName = new Map(countries.map(c => [c.name, c]));
    const cSel = join.querySelector('[name=country]');
    const citySel = join.querySelector('#city-select');
    const cityTxt = join.querySelector('#city-text');
    const cityVal = join.querySelector('[name=city]');
    const dial = join.querySelector('#dial-code');
    const tel = join.querySelector('[name=tel]');
    const full = join.querySelector('[name=phone_full]');

    cSel.append(new Option('Select country', ''));
    const near = document.createElement('optgroup'); near.label = 'Where we operate';
    ['Saudi Arabia', 'United Arab Emirates', 'Qatar'].forEach(n => near.append(new Option(n, n)));
    const all = document.createElement('optgroup'); all.label = 'All countries';
    countries.forEach(c => all.append(new Option(c.name, c.name)));
    cSel.append(near, all);
    near.firstChild.defaultSelected = true;   // Saudi Arabia is the default
    cSel.value = 'Saudi Arabia';

    const showText = on => { cityTxt.hidden = !on; cityTxt.disabled = !on; if (!on) cityTxt.value = ''; };
    const sync = () => {
      const digits = tel.value.replace(/\D/g, '').replace(/^0+/, '');
      full.value = digits ? dial.textContent + digits : '';
      cityVal.value = !cityTxt.hidden ? cityTxt.value.trim() : (citySel.value === '__other' ? '' : citySel.value);
    };
    const update = () => {
      const c = byName.get(cSel.value);
      const list = c && cities[c.name];
      dial.textContent = c ? '+' + c.dial : '+';
      citySel.innerHTML = '';
      if (!c) {
        citySel.append(new Option('Select country first', ''));
        citySel.hidden = false; citySel.disabled = true; showText(false);
      } else if (list) {
        citySel.append(new Option('Select city', ''));
        list.forEach(n => citySel.append(new Option(n, n)));
        citySel.append(new Option('Other city…', '__other'));
        citySel.hidden = false; citySel.disabled = false; showText(false);
      } else {
        citySel.hidden = true; citySel.disabled = true; showText(true);   // no list: type the city
      }
      sync();
    };
    cSel.addEventListener('change', update);
    citySel.addEventListener('change', () => {
      const other = citySel.value === '__other';
      showText(other);
      if (other) cityTxt.focus();
      sync();
    });
    cityTxt.addEventListener('input', sync);
    tel.addEventListener('input', sync);
    join.addEventListener('reset', () => setTimeout(update, 0));
    update();
  }

  // Forms: validation + submit.
  // Set data-endpoint on each <form> to your server URL (it receives a multipart POST).
  document.querySelectorAll('[data-form]').forEach(form => {
    const status = form.querySelector('.status');
    const fields = [...form.querySelectorAll('input[required], textarea[required], select[required]')];

    const check = f => {
      const bad = !f.checkValidity() || (f.type === 'file' && f.files[0] && f.files[0].type !== 'application/pdf');
      f.closest('label').classList.toggle('invalid', bad);
      return !bad;
    };
    fields.forEach(f => f.addEventListener('blur', () => check(f)));
    fields.forEach(f => f.addEventListener('input', () => f.closest('label').classList.contains('invalid') && check(f)));

    form.addEventListener('submit', async e => {
      e.preventDefault();
      status.className = 'status full'; status.textContent = '';
      const results = fields.map(check);
      if (results.includes(false)) {
        form.querySelector('.invalid input, .invalid textarea, .invalid select')?.focus();
        status.textContent = 'Fix the highlighted fields and send again.';
        status.classList.add('err');
        return;
      }
      const endpoint = form.dataset.endpoint;
      const submit = form.querySelector('[type=submit]');
      submit.disabled = true;
      try {
        if (!endpoint) throw new Error('No endpoint set');
        const res = await fetch(endpoint, { method: 'POST', body: new FormData(form) });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.textContent = 'Thank you. We received your message and will reply soon.';
        status.classList.add('ok');
      } catch (err) {
        status.textContent = 'We could not send this. Try again, or email zulfikar@ecgcc.org.';
        status.classList.add('err');
      } finally {
        submit.disabled = false;
      }
    });
  });
})();
