const HF_API_URL = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct";
const GMD_ULTRA_KEY = "GMD_ULTRA_310f1c31e862d9b0_91c5c58c37b9e91a_58984a5aa2778e26_063D3915779B_SECURE";

exports.handler = async function(event) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, X-GMD-Key',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    const incomingKey = event.headers['x-gmd-key'] || event.headers['X-GMD-Key'];
    if (incomingKey !== GMD_ULTRA_KEY) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ reply: '❌ Unauthorized: Invalid ULTRA Key' })
        };
    }

    try {
        const body = JSON.parse(event.body);
        const response = await fetch(HF_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HF_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: body.message || "",
                parameters: { max_new_tokens: 200, return_full_text: false }
            })
        });

        if (!response.ok) throw new Error('API Error: ' + response.status);

        const result = await response.json();
        const reply = (Array.isArray(result) && result[0]?.generated_text)
            ? result[0].generated_text
            : 'جواب نہیں ملا';

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply: reply })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ reply: '❌ ' + err.message })
        };
    }
};