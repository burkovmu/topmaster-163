document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Обработка формы
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Отправляем данные в Telegram
            fetch('/api/send-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formObject.name,
                    phone: formObject.phone,
                    equipment: formObject.device,
                    model: formObject.model,
                    address: formObject.address,
                    problem: formObject.problem
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Успешно отправлено:', data);
                showNotification('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
            })
            .catch(error => {
                console.error('Ошибка:', error);
                showNotification('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.', 'error');
            });
            
            // Очищаем форму
            this.reset();
        });
    }

    // Добавляем класс для фиксированного хедера при прокрутке
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Отслеживание прокрутки для изменения стиля шапки
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Form Application Logic
    const formSteps = document.querySelectorAll('.step');
    const optionButtons = document.querySelectorAll('.option-btn');
    const optionsList = document.querySelector('.options-list');
    
    let currentStep = 0;
    const totalSteps = formSteps.length;
    const selectedOptions = {
        equipment: '',
        district: '',
        time: '',
        problem: ''
    };

    // Show current step
    function showStep(step) {
        formSteps.forEach(s => s.classList.remove('active'));
        formSteps[step].classList.add('active');
        currentStep = step;

        // Update selected options list on last step
        if (step === totalSteps - 1) {
            updateOptionsList();
        }
    }

    // Обработка выбора опции
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const step = this.closest('.step');
            const buttonsInStep = step.querySelectorAll('.option-btn');
            
            // Снимаем выделение со всех кнопок в текущем шаге
            buttonsInStep.forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Выделяем выбранную кнопку
            this.classList.add('selected');
            
            // Сохраняем выбранное значение
            const stepNumber = step.getAttribute('data-step') || '1'; // Если атрибут не установлен, считаем что это первый шаг
            console.log('Шаг:', stepNumber);
            console.log('Текст кнопки:', this.textContent.trim());
            
            if (stepNumber) {
                switch(stepNumber) {
                    case '1':
                        const equipmentText = this.textContent.trim();
                        selectedOptions.equipment = equipmentText;
                        console.log('Сохранен тип техники:', equipmentText);
                        break;
                    case '2':
                        selectedOptions.district = this.textContent.trim();
                        console.log('Сохранен район:', selectedOptions.district);
                        break;
                    case '3':
                        selectedOptions.time = this.textContent.trim();
                        console.log('Сохранено время:', selectedOptions.time);
                        break;
                    case '4':
                        selectedOptions.problem = this.textContent.trim();
                        console.log('Сохранена проблема:', selectedOptions.problem);
                        break;
                }
                
                // Проверяем состояние объекта после сохранения
                console.log('Текущее состояние selectedOptions:', selectedOptions);
            }

            // Если это не последний шаг, переходим к следующему
            if (currentStep < totalSteps - 1) {
                showStep(currentStep + 1);
            }
        });
    });

    // Обработка кнопки отправки заявки
    const submitButton = document.querySelector('.step[data-step="5"] .next-btn');
    if (submitButton) {
        submitButton.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('Нажата кнопка отправки');
            
            const name = document.querySelector('.step[data-step="5"] input[type="text"]').value;
            const phone = document.querySelector('.step[data-step="5"] input[type="tel"]').value;

            if (!name || !phone) {
                console.log('Пустые поля формы');
                showNotification('Пожалуйста, заполните все поля', 'error');
                return;
            }

            // Получаем выбранный тип техники
            const equipment = selectedOptions.equipment || '';
            console.log('Выбранный тип техники:', equipment);

            // Получаем выбранный район
            const district = selectedOptions.district || '';
            console.log('Выбранный район:', district);

            // Получаем выбранное время
            const time = selectedOptions.time || '';
            console.log('Выбранное время:', time);

            // Получаем выбранную проблему
            const problem = selectedOptions.problem || '';
            console.log('Выбранная проблема:', problem);

            console.log('Отправка данных:', { name, phone, equipment, district, time, problem });

            // Показываем индикатор загрузки
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitButton.disabled = true;

            try {
                // Отправка данных на сервер
                const response = await fetch('/api/send-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        phone,
                        device: equipment,
                        problem: problem,
                        district: district,
                        time: time
                    })
                });

                console.log('Статус ответа:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Данные ответа:', data);

                // Всегда показываем успешное уведомление, так как форма отправлена
                console.log('Успешная отправка формы');
                // Очищаем форму
                document.querySelector('.step[data-step="5"] .contact-form').reset();
                // Показываем уведомление об успехе
                showNotification('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
                // Возвращаемся к первому шагу
                showStep(0);
            } catch (error) {
                console.error('Ошибка при отправке формы:', error);
                showNotification('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.', 'error');
            } finally {
                // Восстанавливаем кнопку
                submitButton.innerHTML = 'Отправить заявку <i class="fas fa-paper-plane"></i>';
                submitButton.disabled = false;
            }
        });
    }

    // Обработка кнопки "Назад"
    const prevButtons = document.querySelectorAll('.prev-btn');
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    });

    // Update selected options list
    function updateOptionsList() {
        if (!optionsList) return;
        
        optionsList.innerHTML = '';
        for (const [key, value] of Object.entries(selectedOptions)) {
            if (value) {
                const li = document.createElement('li');
                li.textContent = `${getOptionLabel(key)}: ${value}`;
                optionsList.appendChild(li);
            }
        }
    }

    // Get option label
    function getOptionLabel(key) {
        const labels = {
            equipment: 'Тип техники',
            district: 'Район',
            time: 'Время ремонта',
            problem: 'Проблема'
        };
        return labels[key] || key;
    }

    // Initialize form
    showStep(0);

    // Функции для работы модального окна заказа
    function openOrderModal() {
        const modal = document.getElementById('orderModal');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeOrderModal() {
        const modal = document.getElementById('orderModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Закрытие модального окна при клике вне его области
    document.getElementById('orderModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeOrderModal();
        }
    });

    // Обработка отправки формы
    document.querySelector('.order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[name="name"]').value;
        const phone = this.querySelector('input[name="phone"]').value;
        const deviceType = this.querySelector('select[name="device"]').value;
        const deviceModel = this.querySelector('input[name="model"]').value;
        const problemDescription = this.querySelector('textarea[name="problem"]').value;
        
        if (!name || !phone || !deviceType || !deviceModel || !problemDescription) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        // Отправка данных на сервер
        fetch('/api/send-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                phone,
                device: deviceType,
                model: deviceModel,
                problem: problemDescription
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Очистка формы и закрытие модального окна
                this.reset();
                closeOrderModal();
                // Показываем сообщение об успешной отправке
                alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
            } else {
                throw new Error(data.message || 'Ошибка при отправке формы');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
        });
    });

    // Добавляем обработчики для всех кнопок "Заказать"
    document.querySelectorAll('.order-button').forEach(button => {
        button.addEventListener('click', openOrderModal);
    });

    // Бургер-меню
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Закрытие меню при клике вне его области
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !burgerMenu.contains(e.target)) {
                burgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Price list functionality
    const showMoreButtons = document.querySelectorAll('.show-more-btn');
    
    showMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const priceList = this.previousElementSibling;
            const hiddenItems = priceList.querySelectorAll('.price-item.hidden');
            const isHidden = hiddenItems.length > 0;
            
            if (isHidden) {
                // Показываем все скрытые элементы
                hiddenItems.forEach(item => {
                    item.classList.remove('hidden');
                });
                this.textContent = 'Скрыть';
            } else {
                // Скрываем все элементы, кроме первых 5
                const allItems = priceList.querySelectorAll('.price-item');
                allItems.forEach((item, index) => {
                    if (index >= 5) {
                        item.classList.add('hidden');
                    }
                });
                this.textContent = 'Показать все';
            }
        });
    });

    // Обработка отправки форм
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitButton.disabled = true;

            try {
                const formData = new FormData(form);
                const formObject = {};
                formData.forEach((value, key) => {
                    formObject[key] = value;
                });

                const response = await fetch('/api/send-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formObject)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification('Успешно!', 'Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
                    form.reset();
                } else {
                    showNotification('Ошибка!', result.message || 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Ошибка!', 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.', 'error');
            } finally {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    });

    // Функция для показа уведомлений
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Добавляем иконку в зависимости от типа
        const icon = type === 'success' ? '✓' : '⚠️';
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <p>${message}</p>
            </div>
        `;
        
        // Добавляем уведомление в DOM
        document.body.appendChild(notification);
        
        // Принудительно обновляем стили
        notification.style.display = 'block';
        
        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
});