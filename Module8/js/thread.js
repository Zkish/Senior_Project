const threadId = new URLSearchParams(location.search).get('id');

document.addEventListener('DOMContentLoaded', () => {
  if (!threadId) return;

  loadThread();
  loadReplies();

  document.getElementById('replyForm')?.addEventListener('submit', postReply);
});

async function loadThread() {
  const res = await fetch(`/threads/${threadId}`);
  if (!res.ok) return;

  const { thread } = await res.json();
  if (!thread) return;

  document.getElementById('threadContainer').innerHTML = `
    <h2>${thread.title}</h2>
    <p>${thread.body}</p>
    <small>
      Posted by <b>${thread.username}</b>
      • ${new Date(thread.created_at).toLocaleString()}
    </small>
  `;
}

async function loadReplies() {
  const res = await fetch(`/threads/${threadId}/replies`);
  if (!res.ok) return;

  const replies = await res.json();
  const container = document.getElementById('repliesContainer');
  if (!container) return;

  container.innerHTML = replies.map(r => `
    <div class="post">
      <p>${r.body}</p>
      <small>
        Posted by <b>${r.username}</b>
        • ${new Date(r.created_at).toLocaleString()}
      </small>
    </div>
  `).join('');
}

async function postReply(e) {
  e.preventDefault();
  const body = document.getElementById('replyBody')?.value.trim();
  if (!body) return;

  const res = await fetch(`/threads/${threadId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body })
  });
  if (!res.ok) return;
  document.getElementById('replyBody').value = '';
  loadReplies();
}

function toggleMenu() {
  document.getElementById("nav-links")?.classList.toggle("active");
}
