
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Theme toggle (default dark; light uses Sky accent)
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  if (savedTheme === 'light') root.classList.add('light');
}
toggle?.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
});

// Contact form submission
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

function setStatus(msg, good=false){
  if(!statusEl) return;
  statusEl.textContent = msg;
  statusEl.style.opacity = 1;
  statusEl.style.color = good ? 'inherit' : '#ffb4b4';
  setTimeout(()=>{ statusEl.style.opacity = 0; }, 6000);
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  if(!data.name || !data.email || !data.message){
    setStatus('Please fill in all fields.');
    return;
  }
  setStatus('Sending...');
  try{
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if(json.ok){
      setStatus('Message sent! I will get back to you soon.', true);
      form.reset();
    } else {
      setStatus(json.error || 'Failed to send. Try again.');
    }
  }catch(err){
    setStatus('Network error. Please try again.');
  }
});
