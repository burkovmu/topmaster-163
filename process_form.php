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

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Проверяем результат
if ($result === false) {
    // Ошибка cURL
    error_log("Telegram API Error: " . $error);
    echo json_encode(['success' => false, 'message' => 'Ошибка при отправке заявки: ' . $error]);
} else {
    $response = json_decode($result, true);
    if ($response && $response['ok']) {
        echo json_encode(['success' => true, 'message' => 'Заявка успешно отправлена']);
    } else {
        error_log("Telegram API Response: " . $result);
        echo json_encode(['success' => false, 'message' => 'Ошибка при отправке заявки. Пожалуйста, попробуйте позже.']);
    }
}
?> 