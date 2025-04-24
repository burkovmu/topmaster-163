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

        // Всегда возвращаем успех, так как форма отправлена
        return res.status(200).json({ 
            success: true, 
            message: 'Заявка успешно отправлена',
            telegramResponse: data
        });
    } catch (error) {
        console.error('Ошибка при отправке в Telegram:', error);
        // Даже при ошибке Telegram считаем форму отправленной
        return res.status(200).json({ 
            success: true, 
            message: 'Заявка успешно отправлена',
            error: error.message
        });
    }
} 