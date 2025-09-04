export async function apiGet(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
  const json = await res.json();
  if (!json.success) throw new Error('API error');
  return json.data;
}

export async function apiPost(path, body) {
  const res = await fetch(path, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
  const json = await res.json();
  if (!json.success) throw new Error('API error');
  return json.data;
}
