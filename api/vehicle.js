import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.', details: '' });
  }

  const { reg } = req.body;
  if (!reg) {
    return res.status(400).json({ error: 'Registration number is required', details: '' });
  }

  const apiKey = process.env.DVLA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'DVLA_API_KEY is missing', details: '' });
  }

  try {
    const dvlaRes = await fetch(
      'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles',
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registrationNumber: reg }),
      }
    );

    if (!dvlaRes.ok) {
      const text = await dvlaRes.text();
      return res.status(dvlaRes.status).json({ error: 'DVLA API error', details: text });
    }

    const data = await dvlaRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
