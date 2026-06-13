exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Api-Key',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };

  const apiKey = event.headers['x-api-key'] || event.headers['X-Api-Key'];
  if (apiKey !== process.env.PROJECT_API_KEY) {
    return { statusCode: 403, headers, body: JSON.stringify({ reply: '❌ غلط API Key' }) };
  }

  try {
    const { message, modelType = 'gmdspark' } = JSON.parse(event.body);
    
    const MODELS = {
      gmdspark: 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-7B-Instruct',
      qwen: 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-7B-Instruct',
      deepseek: 'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Coder-6.7B-Instruct',
      codellama: 'https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-Instruct-hf'
    };
    
    const HF_URL = MODELS[modelType] || MODELS.gmdspark;
    
    const res = await fetch(HF_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: `صارف: ${message}\nAI:`,
        parameters: { 
          max_new_tokens: 300, 
          temperature: 0.6, 
          return_full_text: false, 
          wait_for_model: true
        }
      })
    });

    if (res.status === 503) {
      return { statusCode: 503, headers, body: JSON.stringify({ reply: '⏳ ماڈل لوڈ ہو رہا ہے، 20 سیکنڈ بعد ٹرائی کریں۔' }) };
    }

    const ct = res.headers.get('content-type');
    if (!ct?.includes('application/json')) {
      return { statusCode: 502, headers, body: JSON.stringify({ reply: '❌ سرور فارمیٹ غلط ہے۔' }) };
    }

    const data = await res.json();
    let reply = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
    reply = reply ? reply.replace(/<\|.*?\|>/g, '').trim() : 'جواب نہیں ملا۔';

    return { statusCode: 200, headers, body: JSON.stringify({ reply }) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ reply: '❌ ' + err.message }) };
  }
};
