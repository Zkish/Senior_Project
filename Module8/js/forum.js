document.addEventListener('DOMContentLoaded', () => {
  loadThreads();

  const form = document.getElementById('forumForm');
  if (form) {
    form.addEventListener('submit', submitThread);
  }
});

async function loadThreads() {
  const postsContainer = document.getElementById('postsContainer');
  if (!postsContainer) return;

  postsContainer.innerHTML = '';

  const res = await fetch('/threads');
  const threads = await res.json();

  threads.forEach(thread => {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';

    postDiv.innerHTML = `
      <h3>${thread.title}</h3>
      <p>${thread.body}</p>
      <small>
        Posted by <b>${thread.username}</b>
        • ${new Date(thread.created_at).toLocaleString()}
      </small>
      <br>
      <button onclick="openThread(${thread.id})">View Replies</button>
    `;

    postsContainer.appendChild(postDiv);
  });
}

async function submitThread(e) {
  e.preventDefault();

  const title = document.getElementById('topic').value.trim();
  const body = document.getElementById('message').value.trim();
  if (!title || !body) return;

  await fetch('/threads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body })
  });

  e.target.reset();
  loadThreads();
}

function openThread(threadId) {
  window.location.href = `thread.html?id=${threadId}`;
}

function toggleMenu() {
  document.getElementById("nav-links").classList.toggle("active");
}
