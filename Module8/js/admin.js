document.addEventListener('DOMContentLoaded', loadMessages);

async function loadMessages() {
  const res = await fetch('/admin');
  if (!res.ok) return;

  const data = await res.json();
  const container = document.getElementById('messagesContainer');
  container.innerHTML = '';

  data.forEach(m => {
    const div = document.createElement('div');
    div.className = 'post';

    div.innerHTML = `
      <h3>${m.first_name} ${m.last_name}</h3>
      <p>${m.message}</p>
      <small>
        ${m.email}
        ${m.mobile ? ' | ' + m.mobile : ''}
        • ${new Date(m.created_at).toLocaleString()}
      </small>
    `;

    container.appendChild(div);
  });
}

function toggleMenu() {
  const nav = document.getElementById("nav-links");
  if (nav) nav.classList.toggle("active");
}