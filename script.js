/* ============================================================
   BlueHaven Health — Behavior
   Mobile nav · form validation/submission · fade-in · footer year
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. FOOTER YEAR — auto-fill current year
     --------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     2. MOBILE NAV — toggle open/close, close on link click
     --------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the menu when any nav link is clicked (mobile)
    navMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------------------------------------------------
     3. FADE-IN ON SCROLL — IntersectionObserver
     --------------------------------------------------------- */
  var faders = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // reveal once, then stop watching
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    faders.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: no IO support -> just show everything
    faders.forEach(function (el) { el.classList.add('is-visible'); });
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_RE = /^[+()\-\s\d]{7,}$/; // at least 7 chars of digits/phone punctuation

  /* ---------------------------------------------------------
     4. LEAD MAGNET — email-only capture (Family Health Checklist)
     --------------------------------------------------------- */
  var leadForm = document.getElementById('leadForm');
  if (leadForm) {
    var leadInput = document.getElementById('leadEmail');
    var leadStatus = document.getElementById('leadStatus');
    var leadErr = document.getElementById('err-leadEmail');

    leadInput.addEventListener('input', function () {
      leadInput.closest('.form-group').classList.remove('invalid');
      if (leadErr) leadErr.textContent = '';
    });

    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (leadStatus) { leadStatus.hidden = true; leadStatus.textContent = ''; }

      var email = leadInput.value.trim();
      if (!email || !EMAIL_RE.test(email)) {
        leadInput.closest('.form-group').classList.add('invalid');
        if (leadErr) leadErr.textContent = 'Please enter a valid email address.';
        leadInput.focus();
        return;
      }

      // TODO: POST to your email/ESP endpoint here (e.g. Mailchimp, ConvertKit).
      console.log('Lead magnet signup:', { email: email, magnet: 'family-health-checklist', submittedAt: new Date().toISOString() });

      if (leadStatus) {
        leadStatus.textContent = "You're in! Check your inbox for the Family Health Checklist.";
        leadStatus.hidden = false;
      }
      leadForm.reset();
    });
  }

  /* ---------------------------------------------------------
     5. ENQUIRY FORM — validation + submission
     --------------------------------------------------------- */
  var form = document.getElementById('enquiryForm');
  if (!form) return;

  var statusEl = document.getElementById('formStatus');

  // Helpers to show/clear a field-level error message
  function setError(fieldId, message) {
    var input = document.getElementById(fieldId);
    var errEl = document.getElementById('err-' + fieldId);
    if (input) input.closest('.form-group').classList.add('invalid');
    if (errEl) errEl.textContent = message;
  }

  function clearError(fieldId) {
    var input = document.getElementById(fieldId);
    var errEl = document.getElementById('err-' + fieldId);
    if (input) input.closest('.form-group').classList.remove('invalid');
    if (errEl) errEl.textContent = '';
  }

  // Clear a field's error as soon as the user edits it
  ['name', 'email', 'phone'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { clearError(id); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Reset previous state
    if (statusEl) { statusEl.hidden = true; statusEl.textContent = ''; }

    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var date = document.getElementById('date').value;
    var message = document.getElementById('message').value.trim();

    var isValid = true;
    var firstInvalid = null;

    // --- Validate required fields ---
    if (!name) {
      setError('name', 'Please enter your full name.');
      isValid = false; firstInvalid = firstInvalid || 'name';
    } else {
      clearError('name');
    }

    if (!email) {
      setError('email', 'Please enter your email address.');
      isValid = false; firstInvalid = firstInvalid || 'email';
    } else if (!EMAIL_RE.test(email)) {
      setError('email', 'Please enter a valid email address.');
      isValid = false; firstInvalid = firstInvalid || 'email';
    } else {
      clearError('email');
    }

    if (!phone) {
      setError('phone', 'Please enter your phone number.');
      isValid = false; firstInvalid = firstInvalid || 'phone';
    } else if (!PHONE_RE.test(phone)) {
      setError('phone', 'Please enter a valid phone number.');
      isValid = false; firstInvalid = firstInvalid || 'phone';
    } else {
      clearError('phone');
    }

    if (!isValid) {
      // Move focus to the first field with an error for accessibility
      var focusEl = document.getElementById(firstInvalid);
      if (focusEl) focusEl.focus();
      return;
    }

    // --- Success: build the data object ---
    var formData = {
      name: name,
      email: email,
      phone: phone,
      preferredDate: date || null,
      message: message || null,
      submittedAt: new Date().toISOString()
    };

    // ============================================================
    // TODO: POST to a real API endpoint here.
    // Replace the console.log below with e.g.:
    //   fetch('https://api.bluehavenhealth.com/appointments', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    //   })
    //   .then(function (res) { ... })
    //   .catch(function (err) { ... });
    // ============================================================
    console.log('Appointment request submitted:', formData);

    // Show inline confirmation and reset the form
    if (statusEl) {
      statusEl.textContent = "Thank you! We'll contact you shortly to confirm your appointment.";
      statusEl.hidden = false;
    }
    form.reset();
  });
})();
