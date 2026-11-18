export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    try {
        const { amount, description, external_id, payerName, payerDocument } = req.body;

        // INSIRA SEUS DADOS DA MISTICPAY AQUI
        const CLIENT_ID = 'pk_3baabbbe3e584ed1619de86dc619eeb6';
        const CLIENT_SECRET = 'sk_cfd24914f1936ab5dc24514f03d3c5351895529f4e792c8fbb7866bdd9fe7c20';

        // A MisticPay exige autenticação Basic (Base64 do client_id:client_secret)
        const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

        const response = await fetch('https://api.misticpay.com/api/transactions/create', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: parseFloat(amount),
                payerName: payerName || 'Doador Aliança do Bem',
                payerDocument: payerDocument || '00000000000', // A API exige CPF. Se for anônimo, tente enviar zeros ou peça ao usuário.
                transactionId: external_id,
                description: description
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Erro MisticPay:', data);
            return res.status(response.status).json(data);
        }

        // A MisticPay retorna os dados do QR Code. 
        // Vamos mapear para o formato que seu front-end já espera (qrcode_url e pix_code)
        return res.status(200).json({
            qrcode_url: data.qrcode || data.qrCode, 
            pix_code: data.pixCode || data.copyAndPaste
        });

    } catch (error) {
        console.error('Erro interno MisticPay:', error);
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
}
