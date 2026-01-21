// Serverless function to submit a comment (pending approval)
export default async function handler(req, res) {
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

    const { memorialId, name, email, comment } = req.body;

    if (!memorialId || !name || !comment) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const REPO_OWNER = process.env.REPO_OWNER || 'JM010101';
        const REPO_NAME = process.env.REPO_NAME || 'memoral_html';

        // Fetch current comments.json
        const getResponse = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/comments.json`,
            {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        let comments = [];
        let sha = null;

        if (getResponse.ok) {
            const data = await getResponse.json();
            sha = data.sha;
            const content = Buffer.from(data.content, 'base64').toString('utf-8');
            comments = JSON.parse(content);
        }

        // Add new comment (pending approval)
        const newComment = {
            id: `comment-${Date.now()}`,
            memorialId,
            name,
            email: email || '',
            comment,
            status: 'pending', // pending, approved, rejected
            timestamp: new Date().toISOString(),
            approvedAt: null
        };

        comments.push(newComment);

        // Update comments.json
        const updatedContent = Buffer.from(JSON.stringify(comments, null, 2)).toString('base64');

        const updateResponse = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/comments.json`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `New comment from ${name} on memorial ${memorialId}`,
                    content: updatedContent,
                    sha: sha,
                    branch: 'master'
                })
            }
        );

        if (!updateResponse.ok) {
            const error = await updateResponse.json();
            throw new Error(error.message || 'Failed to save comment');
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Comment submitted! It will appear after approval.',
            commentId: newComment.id
        });

    } catch (error) {
        console.error('Error submitting comment:', error);
        return res.status(500).json({ error: error.message });
    }
}
