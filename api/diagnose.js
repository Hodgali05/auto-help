export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Только POST-запросы' });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Опишите проблему' });
    }

    const response = await fetch('https://apinex.bond', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.APINEX_API_KEY}`
      },
      body: JSON.stringify({
        model: 'free/gpt-6-luna',
        messages: [
          {
            role: 'system',
            content: 'Ты опытный автодиагност сервиса «АвтоЭксперт» (легковые и грузовые авто). Проанализируй симптомы или код ошибки OBD-II от водителя. Ответь структурированно и кратко (до 120 слов): 1) 2–3 вероятные причины; 2) Можно ли безопасно продолжать движение; 3) Что проверить в первую очередь. В конце мягко предложи оформить экспресс-разбор со специалистом ниже на сайте, если нужна точная проверка по параметрам.'
          },
          { role: 'user', content: message }
        ],
        max_tokens: 450
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Не удалось получить ответ от нейросети.';
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({ error: 'Ошибка соединения с сервером ИИ' });
  }
}
