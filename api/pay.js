export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    try {
        const { amount, description, external_id, shop_id, expiration } = req.body;

        const API_KEY = 'smoke_live_7147fc2a2326f3654ef405e82da2e8c1dc745dbcd1894189b9651a9e63288427';

        const response = await fetch('https://smokepay.com.br/api/pix/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                amount,
                description,
                external_id,
                shop_id,
                expiration
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Isso vai imprimir o erro real da SmokePay nos logs da Vercel
            console.error('Erro da SmokePay:', data);
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Erro interno:', error);
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
}
