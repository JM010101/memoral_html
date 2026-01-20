// Simple GitHub OAuth handler for Netlify CMS on Vercel
const randomString = () => Math.random().toString(36).substring(2, 15);

module.exports = (req, res) => {
  const { host } = req.headers;
  
  // GitHub OAuth credentials
  const clientId = 'Ov23liiowtV9u7Or66Ni';
  const clientSecret = '70b720fd7b06a47306db40646bc00522bde698f3';
  
  // Handle callback from GitHub
  if (req.query.code) {
    const code = req.query.code;
    
    // Exchange code for access token
    fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          // Send token back to Netlify CMS
          const content = `
            <html>
              <head>
                <title>Success</title>
              </head>
              <body>
                <script>
                  (function() {
                    function receiveMessage(e) {
                      console.log("receiveMessage %o", e);
                      window.opener.postMessage(
                        'authorization:github:success:${JSON.stringify({
                          token: data.access_token,
                          provider: 'github'
                        })}',
                        e.origin
                      );
                      window.removeEventListener("message", receiveMessage, false);
                    }
                    window.addEventListener("message", receiveMessage, false);
                    console.log("Posting message");
                    window.opener.postMessage("authorizing:github", "*");
                  })()
                </script>
              </body>
            </html>
          `;
          res.setHeader('Content-Type', 'text/html');
          res.status(200).send(content);
        } else {
          res.status(400).json({ error: 'Failed to get access token' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  } else {
    // Redirect to GitHub OAuth
    const redirectUri = `https://${host}/api/auth`;
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`;
    res.redirect(authUrl);
  }
};
