export default async function handler(req, res) {
    if (req.method !== 'POST') {
        console.log('Неправильный метод запроса:', req.method);
        return res.status(405).json({ success: false, message: 'Метод не разрешен' });
    }

    const { name, phone, device, model, problem, district, time } = req.body;
    console.log('Получены данные формы:', { name, phone, device, model, problem, district, time });

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

    console.log('Отправляем сообщение в Telegram:', message);

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
        console.log('Ответ от Telegram API:', data);

        if (data.ok) {
            console.log('Сообщение успешно отправлено в Telegram');
            return res.status(200).json({ success: true, message: 'Заявка успешно отправлена' });
        } else {
            console.error('Ошибка Telegram API:', data);
            return res.status(500).json({ success: false, message: 'Ошибка при отправке заявки в Telegram' });
        }
    } catch (error) {
        console.error('Ошибка при отправке в Telegram:', error);
        return res.status(500).json({ success: false, message: 'Ошибка при отправке заявки' });
    }
} 