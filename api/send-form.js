export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Метод не разрешен' });
    }

    const { name, phone, device, model, problem, district, time } = req.body;

    // Настройки для отправки в Telegram
    const botToken = "7803594149:AAEQCYuCXLxtTBli0haikuhfehWJvzHcfLI";
    const chatId = "-1002674869783";

    // Формируем сообщение для Telegram
    let message = "📝 Новая заявка с сайта:\n\n";
    message += `👤 Имя: ${name}\n`;
    message += `📱 Телефон: ${phone}\n`;
    if (device) message += `🔧 Тип техники: ${device}\n`;
    if (model) message += `📦 Модель техники: ${model}\n`;
    if (problem) message += `⚠️ Описание проблемы: ${problem}\n`;
    if (district) message += `📍 Район: ${district}\n`;
    if (time) message += `⏰ Время ремонта: ${time}\n`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();

        if (data.ok) {
            return res.status(200).json({ success: true, message: 'Заявка успешно отправлена' });
        } else {
            console.error('Telegram API Error:', data);
            return res.status(500).json({ success: false, message: 'Ошибка при отправке заявки' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Ошибка при отправке заявки' });
    }
} 