import fetch from 'node-fetch';

export default async function handler(req, res) {
 res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { reg } = req.body;
  if (!reg) {
    return res.status(400).json({ error: 'Bad Request. Registration number is required.' });
  }

  const apiKey = process.env.DVLA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server Error. DVLA_API_KEY is missing.' });
  }

  try {
    const response = await fetch(
      'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles',
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ registrationNumber: reg })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'DVLA API Error',
        details: errorText
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: 'Server Error',
      details: err.message
    });
  }
}
