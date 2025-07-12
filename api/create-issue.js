// Vercel Serverless Function
const axios = require('axios');
const repoLink = process.env.GH_LINK

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { videoUrl, description = '' } = req.body;

  if (!videoUrl || !videoUrl.startsWith('http')) {
    return res.status(400).json({ error: 'Invalid or missing video URL' });
  }

  try {
    const response = await axios.post(
      repoLink,
      {
        title: 'Transcript Request',
        body: `${videoUrl}\n\n${description}`
      },
      {
        headers: {
          Authorization: `token ${process.env.GH_TOKEN}`,
          'User-Agent': 'transcript-automation',
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    return res.status(200).json({ success: true, issueUrl: response.data.html_url });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to create issue' });
  }
};
