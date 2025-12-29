
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, tx_ref, amount, fullname } = req.body;
  const secretKey = process.env.FLW_SECRET_KEY;

  if (!secretKey) {
    return res.status(500).json({ error: 'Server misconfiguration: Missing Secret Key' });
  }

  try {
    const response = await fetch('https://api.flutterwave.com/v3/charges?type=bank_transfer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref,
        amount,
        currency: 'NGN',
        email,
        fullname,
        is_permanent: false, // Creates a dynamic account that expires
      }),
    });

    const data = await response.json();

    if (data.status === 'success') {
      return res.status(200).json(data);
    } else {
      return res.status(400).json(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
