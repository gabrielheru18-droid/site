export default async function handler(req, res) {
    // Só aceita requisições do tipo POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    try {
        const { amount, description, external_id, shop_id, expiration } = req.body;

        // A CHAVE FICA AQUI. Ninguém consegue ver isso pelo navegador (F12).
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
        
        // Retorna a resposta da SmokePay para o seu Front-end
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
}
