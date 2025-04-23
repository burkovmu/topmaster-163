<?php
// Настройки для отправки email
$to = "Arkadii1988arkadii@yandex.ru";
$subject = "Новая заявка с сайта";

// Получаем данные из формы
$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';
$device = $_POST['device'] ?? '';
$problem = $_POST['problem'] ?? '';

// Формируем тело письма
$message = "Новая заявка с сайта:\n\n";
$message .= "Имя: " . $name . "\n";
$message .= "Телефон: " . $phone . "\n";
if ($device) $message .= "Тип техники: " . $device . "\n";
if ($problem) $message .= "Описание проблемы: " . $problem . "\n";

// Заголовки письма
$headers = "From: noreply@yourdomain.com\r\n";
$headers .= "Reply-To: noreply@yourdomain.com\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Отправляем письмо
$mailSent = mail($to, $subject, $message, $headers);

// Возвращаем ответ
if ($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Заявка успешно отправлена']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка при отправке заявки']);
}
?> 