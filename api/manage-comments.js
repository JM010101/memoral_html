// Serverless function to approve/reject comments
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

    const { commentId, action, password } = req.body;

    // Verify admin password
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'memorial2024';
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!commentId || !action || !['approve', 'reject', 'delete'].includes(action)) {
        return res.status(400).json({ error: 'Invalid request' });
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

        if (!getResponse.ok) {
            throw new Error('Failed to fetch comments');
        }

        const data = await getResponse.json();
        const sha = data.sha;
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        let comments = JSON.parse(content);

        // Find and update the comment
        const commentIndex = comments.findIndex(c => c.id === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (action === 'delete') {
            comments.splice(commentIndex, 1);
        } else if (action === 'approve') {
            comments[commentIndex].status = 'approved';
            comments[commentIndex].approvedAt = new Date().toISOString();
        } else if (action === 'reject') {
            comments[commentIndex].status = 'rejected';
        }

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
                    message: `${action} comment ${commentId}`,
                    content: updatedContent,
                    sha: sha,
                    branch: 'master'
                })
            }
        );

        if (!updateResponse.ok) {
            const error = await updateResponse.json();
            throw new Error(error.message || 'Failed to update comment');
        }

        return res.status(200).json({ 
            success: true, 
            message: `Comment ${action}d successfully`
        });

    } catch (error) {
        console.error('Error managing comment:', error);
        return res.status(500).json({ error: error.message });
    }
}
