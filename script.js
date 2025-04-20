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

            // Здесь можно добавить отправку данных на сервер
            console.log('Отправка формы:', formObject);
            
            // Очищаем форму
            this.reset();
            
            // Показываем сообщение об успехе
            alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
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

    // Form Application Logic
    const formSteps = document.querySelectorAll('.step');
    const optionBtns = document.querySelectorAll('.option-btn');
    const optionsList = document.querySelector('.options-list');
    const submitBtn = document.querySelector('.submit-btn');
    
    let currentStep = 1;
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
        formSteps[step - 1].classList.add('active');
        currentStep = step;
        
        // Update navigation buttons
        const prevBtn = formSteps[step - 1].querySelector('.prev-btn');
        const nextBtn = formSteps[step - 1].querySelector('.next-btn');
        
        if (prevBtn) {
            prevBtn.disabled = step === 1;
        }
        
        if (nextBtn) {
            nextBtn.textContent = step === totalSteps - 1 ? 'Отправить' : 'Далее';
            nextBtn.disabled = true;
        }

        // Update selected options list on last step
        if (step === totalSteps) {
            updateOptionsList();
        }
    }

    // Handle option selection
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const step = this.closest('.step').dataset.step;
            const value = this.dataset.value;
            const text = this.textContent;

            // Remove selected class from all buttons in current step
            this.closest('.options-grid').querySelectorAll('.option-btn').forEach(b => {
                b.classList.remove('selected');
            });

            // Add selected class to clicked button
            this.classList.add('selected');

            // Store selected option
            switch(step) {
                case '1':
                    selectedOptions.equipment = text;
                    break;
                case '2':
                    selectedOptions.district = text;
                    break;
                case '3':
                    selectedOptions.time = text;
                    break;
                case '4':
                    selectedOptions.problem = text;
                    break;
            }

            // Enable next button and show next step after delay
            const nextBtn = this.closest('.step').querySelector('.next-btn');
            if (nextBtn) {
                nextBtn.disabled = false;
                setTimeout(() => {
                    if (currentStep < totalSteps) {
                        showStep(currentStep + 1);
                    }
                }, 300);
            }
        });
    });

    // Handle back button
    document.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    });

    // Update selected options list
    function updateOptionsList() {
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

    // Form submission
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const name = document.querySelector('input[type="text"]').value;
        const phone = document.querySelector('input[type="tel"]').value;

        if (!name || !phone) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        // Here you would typically send the data to your server
        console.log('Form submitted:', {
            name,
            phone,
            ...selectedOptions
        });

        // Show success message
        alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
    });

    // Initialize form
    showStep(1);

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
        
        // Здесь можно добавить отправку данных на сервер
        console.log('Отправка формы:', { name, phone });
        
        // Очистка формы и закрытие модального окна
        this.reset();
        closeOrderModal();
        
        // Показываем сообщение об успешной отправке
        alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
    });

    // Добавляем обработчики для всех кнопок "Заказать"
    document.querySelectorAll('.order-button').forEach(button => {
        button.addEventListener('click', openOrderModal);
    });
}); 