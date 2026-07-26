// ---------- Album mosaic (covers; ~25% marked snoozed) ----------
(function buildMosaic() {
  const mosaic = document.getElementById('mosaic');
  if (!mosaic) return;

  const SIZE = 30;
  const TOTAL = SIZE * SIZE; // 900
  const ALBUM_COUNT = 864;
  const EMPTY_RATE = 0.05;
  const BLOCKED_RATE = 0.25;

  const images = [];
  for (let n = 1; n <= ALBUM_COUNT; n++) {
    images.push('assets/albums/album_' + String(n).padStart(3, '0') + '.jpg');
  }

  // Fisher–Yates shuffle, then cycle through to fill 900 cells (repeats last ~36).
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = images[i];
    images[i] = images[j];
    images[j] = tmp;
  }

  let imageIndex = 0;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < TOTAL; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';

    if (Math.random() < EMPTY_RATE) {
      tile.classList.add('empty');
    } else {
      tile.style.backgroundImage = 'url("' + images[imageIndex % images.length] + '")';
      imageIndex++;

      if (Math.random() < BLOCKED_RATE) {
        tile.classList.add('blocked');
      }

      if (Math.random() < 0.06) {
        tile.classList.add('pulse');
        tile.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
      }
    }

    frag.appendChild(tile);
  }

  mosaic.appendChild(frag);
})();

// ---------- Beta signup form (Web3Forms) ----------
(function wireSignupForm() {
  const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
  const ACCESS_KEY = '7125c7ea-2de2-4491-8871-6b1ba6428b75';

  const form = document.getElementById('signup-form');
  const note = document.getElementById('form-note');
  const submitBtn = form && form.querySelector('button[type="submit"]');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const email = emailInput && emailInput.value.trim();

    if (!email || !email.includes('@')) {
      note.textContent = 'Please enter a valid email address.';
      note.style.color = '#ff6b6b';
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    note.textContent = 'Submitting…';
    note.style.color = '#a3a4b3';

    const payload = {
      access_key: ACCESS_KEY,
      subject: 'Curate My Playlist beta signup',
      from_name: 'Curate My Playlist',
      email: email,
      botcheck: ''
    };

    try {
      const response = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok && data.success) {
        note.textContent = "You're on the list. We'll be in touch.";
        note.style.color = '#4d63ff';
        form.reset();
      } else {
        note.textContent = data.message || 'Something went wrong. Please try again.';
        note.style.color = '#ff6b6b';
        console.error('Web3Forms error:', data);
      }
    } catch (err) {
      note.textContent = 'Could not submit. Check your connection and try again.';
      note.style.color = '#ff6b6b';
      console.error('Web3Forms fetch failed:', err);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();
