export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    try {
        const { amount, description, external_id, shop_id, expiration } = req.body;

        // VERIFIQUE SE ESTA CHAVE É LIVE OU TESTE NA DASHBOARD
        const API_KEY = 'smoke_live_7147fc2a2326f3654ef405e82da2e8c1dc745dbcd1894189b9651a9e63288427';

        const response = await fetch('https://smokepay.com.br/api/pix/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                amount: parseFloat(amount), // Força a conversão para número decimal
                description,
                external_id,
                shop_id,
                expiration
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Resposta de Erro da SmokePay:', JSON.stringify(data));
            return res.status(response.status).json(data);
        }

        // Se a resposta for OK, mas não vier o qrcode_url, avisamos o front-end
        if (!data || !data.qrcode_url) {
            console.error('API respondeu OK, mas sem QR Code:', data);
            return res.status(400).json({ message: 'A API não retornou o link do QR Code. Verifique as permissões da conta.' });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Erro crítico no servidor:', error);
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
}
