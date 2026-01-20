// Vercel Serverless Function to save memorials
const { Octokit } = require("@octokit/rest");

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password, memorials } = req.body;

    // Simple password protection
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'memorial123';
    
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // GitHub configuration
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = 'JM010101';
    const GITHUB_REPO = 'memoral_html';
    const FILE_PATH = 'data/memorials.json';

    if (!GITHUB_TOKEN) {
      return res.status(500).json({ error: 'GitHub token not configured' });
    }

    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    // Get current file to get its SHA
    let currentSha;
    try {
      const { data } = await octokit.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: FILE_PATH,
      });
      currentSha = data.sha;
    } catch (error) {
      // File doesn't exist, that's okay
      currentSha = null;
    }

    // Prepare content
    const content = JSON.stringify({ memorials }, null, 2);
    const contentBase64 = Buffer.from(content).toString('base64');

    // Update or create file
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: FILE_PATH,
      message: 'Update memorials via admin panel',
      content: contentBase64,
      sha: currentSha,
      branch: 'master',
    });

    return res.status(200).json({ success: true, message: 'Memorials saved successfully!' });
  } catch (error) {
    console.error('Error saving memorials:', error);
    return res.status(500).json({ error: error.message || 'Failed to save memorials' });
  }
};
