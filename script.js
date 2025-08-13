const API_KEY = '6c2fb373e98ce077054f9bc9bceb7368'; 

document.addEventListener('DOMContentLoaded', function () {

  const input = document.getElementById('countryInput');
  const list = document.getElementById('countries');
  const codeInput = document.getElementById('countryCode');

    if (!API_KEY || API_KEY === 'INSERT_YOUR_KEY_HERE') {
    console.warn('Set your Countrylayer API key in API_KEY.');
    return;


  }

  fetch(`https://api.countrylayer.com/v2/all?access_key=${encodeURIComponent(API_KEY)}`)
  .then(res => res.json())
  .then(data => {

      data
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      .forEach (c => {

          if (!c.name) return; 
          const opt = document.createElement('option');
          opt.value = c.name;
          opt.dataset.code = c.alpha2code || '';
          list.appendChild(opt);

      });
  });

  input.addEventListener('input', () => {

    const val = input.value.trim();
    const match = Array.from(list.options).find(o => o.value === val);
    codeInput.value = match ? (match.dataset.code || '') : '';



  });

});