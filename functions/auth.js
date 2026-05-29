export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) return new Response('GITHUB_CLIENT_ID not configured', { status: 500 });

  const code = url.searchParams.get('code');

  // Step 1: initiate OAuth → redirect to GitHub
  if (!code) {
    const redirectUri = encodeURIComponent('https://studio.screenstory.co/auth');
    const scope = encodeURIComponent('repo,read:user');
    const state = url.searchParams.get('state') || '';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${encodeURIComponent(state)}`;
    return Response.redirect(authUrl, 302);
  }

  // Step 2: callback from GitHub → exchange code for token
  const secret = env.GITHUB_CLIENT_SECRET;
  if (!secret) return new Response('GITHUB_CLIENT_SECRET not configured', { status: 500 });

  const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: secret,
      code,
      redirect_uri: 'https://studio.screenstory.co/auth',
    }),
  });

  const data = await tokenResp.json();
  if (data.error) {
    return new Response(JSON.stringify({ error: data.error_description || data.error }), {
      status: 400, headers: { 'content-type': 'application/json' },
    });
  }

  // Return HTML that posts token to Decap CMS popup opener
  const html = `<!DOCTYPE html>
<html>
<body>
<script>
(function(){
  var payload = { token: "${data.access_token}", provider_token: "${data.access_token}" };
  if (window.opener) {
    window.opener.postMessage(payload, "https://studio.screenstory.co");
    window.opener.postMessage(payload, "*");
  }
  // Decap CMS may also look for token in URL hash
  window.location.hash = "access_token=${encodeURIComponent(data.access_token)}&token_type=bearer";
})();
<\/script>
<p>Authentication complete. You can close this window.</p>
</body>
</html>`;

  return new Response(html, { headers: { 'content-type': 'text/html' } });
}
