<?php
// Настройки для отправки в Telegram
$botToken = "7803594149:AAEQCYuCXLxtTBli0haikuhfehWJvzHcfLI";
$chatId = "-1002674869783";

// Получаем данные из формы
$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';
$device = $_POST['device'] ?? '';
$problem = $_POST['problem'] ?? '';

// Формируем сообщение для Telegram
$message = "Новая заявка с сайта:\n\n";
$message .= "Имя: " . $name . "\n";
$message .= "Телефон: " . $phone . "\n";
if ($device) $message .= "Тип техники: " . $device . "\n";
if ($problem) $message .= "Описание проблемы: " . $problem . "\n";

// Отправляем сообщение в Telegram
$url = "https://api.telegram.org/bot{$botToken}/sendMessage";
$data = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'HTML'
];

$options = [
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

// Возвращаем ответ
if ($result !== false) {
    echo json_encode(['success' => true, 'message' => 'Заявка успешно отправлена']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка при отправке заявки']);
}
?> 