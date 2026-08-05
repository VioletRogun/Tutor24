// ========== НАСТРОЙКИ ТЕЛЕГРАМ БОТА ==========
const BOT_TOKEN = '8855299225:AAFXNbrtpvsgvdt_ssCs87mTj6X7SKbqPws';
const CHAT_ID = '1173881910';

// Ждём полной загрузки страницы
document.addEventListener('DOMContentLoaded', function() {

    // ========== КНОПКА TELEGRAM ==========
    const telegramBtn = document.getElementById('telegramBtn');
    if (telegramBtn) {
        telegramBtn.addEventListener('click', function() {
            window.open('https://t.me/vetachoc0', '_blank');
        });
    } else {
        console.log('Кнопка telegramBtn не найдена');
    }

    // ========== КНОПКА ОТКРЫТЬ МОДАЛЬНОЕ ОКНО ==========
    const openModalBtn = document.getElementById('openModalBtn');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.modal-close');

    if (openModalBtn && modal) {
        openModalBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    } else {
        console.log('Кнопка openModalBtn или модальное окно не найдены');
    }

    if (closeModal && modal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    if (modal) {
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ========== ПЕРЕКЛЮЧЕНИЕ УЧЕНИК/РОДИТЕЛЬ ==========
    const whoIsRadios = document.querySelectorAll('#trialFormElement input[name="whoIs"]');
    const studentBlock = document.getElementById('studentBlock');
    const parentBlock = document.getElementById('parentBlock');

    function toggleFormBlocks() {
        if (!whoIsRadios.length) return;
        const selected = document.querySelector('#trialFormElement input[name="whoIs"]:checked');
        if (!selected) return;
        
        if (selected.value === 'ученик') {
            if (studentBlock) studentBlock.style.display = 'block';
            if (parentBlock) parentBlock.style.display = 'none';
            if (document.querySelector('input[name="studentName"]')) {
                document.querySelector('input[name="studentName"]').setAttribute('required', 'required');
                document.querySelector('input[name="studentPhone"]').setAttribute('required', 'required');
            }
            if (document.querySelectorAll('#parentBlock input')) {
                document.querySelectorAll('#parentBlock input').forEach(input => {
                    input.removeAttribute('required');
                });
            }
        } else {
            if (studentBlock) studentBlock.style.display = 'none';
            if (parentBlock) parentBlock.style.display = 'block';
            if (document.querySelector('input[name="studentName"]')) {
                document.querySelector('input[name="studentName"]').removeAttribute('required');
                document.querySelector('input[name="studentPhone"]').removeAttribute('required');
            }
            if (document.querySelectorAll('#parentBlock input')) {
                document.querySelectorAll('#parentBlock input').forEach(input => {
                    input.setAttribute('required', 'required');
                });
            }
        }
    }

    if (whoIsRadios.length) {
        whoIsRadios.forEach(radio => {
            radio.addEventListener('change', toggleFormBlocks);
        });
        toggleFormBlocks();
    }

    // ========== ОТПРАВКА ФОРМЫ ==========
    const form = document.getElementById('trialFormElement');
    const messageDiv = document.getElementById('formMessage');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const whoIsRadio = document.querySelector('#trialFormElement input[name="whoIs"]:checked');
            if (!whoIsRadio) return;
            
            const whoIs = whoIsRadio.value;
            let text = `📚 *НОВАЯ ЗАЯВКА НА ПРОБНОЕ ЗАНЯТИЕ* 📚\n\n`;
            text += `👤 *Кто:* ${whoIs}\n`;
            
            if (whoIs === 'ученик') {
                const studentName = document.querySelector('input[name="studentName"]')?.value || '';
                const studentPhone = document.querySelector('input[name="studentPhone"]')?.value || '';
                const parentPhone = document.querySelector('input[name="parentPhoneStudent"]')?.value || 'не указан';
                text += `🧑‍🎓 *Ученик:* ${studentName}\n`;
                text += `📞 *Телефон ученика:* ${studentPhone}\n`;
                text += `👩‍👧 *Телефон родителя:* ${parentPhone}\n`;
            } else {
                const parentName = document.querySelector('input[name="parentName"]')?.value || '';
                const parentPhone = document.querySelector('input[name="parentPhone"]')?.value || '';
                text += `👩‍👦 *Родитель:* ${parentName}\n`;
                text += `📞 *Телефон родителя:* ${parentPhone}\n`;
            }
            
            const childName = document.querySelector('input[name="childName"]')?.value || '';
            const childClass = document.querySelector('input[name="childClass"]')?.value || '';
            const datetime = document.querySelector('input[name="datetime"]')?.value || '';
            const details = document.querySelector('textarea[name="details"]')?.value || '—';
            
            text += `🧒 *Ребенок:* ${childName} (${childClass})\n`;
            text += `📅 *Дата и время:* ${datetime}\n`;
            text += `💬 *Подробности:* ${details}\n`;
            
            const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
            
            if (messageDiv) {
                messageDiv.className = 'form-message';
                messageDiv.textContent = 'Отправка...';
                messageDiv.style.display = 'block';
            }
            
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: text,
                        parse_mode: 'Markdown'
                    })
                });
                
                if (response.ok) {
                    if (messageDiv) {
                        messageDiv.className = 'form-message success';
                        messageDiv.textContent = '✅ Заявка отправлена! Я свяжусь с вами.';
                    }
                    form.reset();
                    toggleFormBlocks();
                    
                    setTimeout(() => {
                        if (modal) modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        if (messageDiv) messageDiv.style.display = 'none';
                    }, 2000);
                } else {
                    throw new Error('Ошибка');
                }
            } catch (error) {
                if (messageDiv) {
                    messageDiv.className = 'form-message error';
                    messageDiv.textContent = '❌ Ошибка. Напишите мне напрямую в Telegram: @vetachoc0';
                }
            }
            
            setTimeout(() => {
                if (messageDiv && messageDiv.style.display !== 'none') {
                    messageDiv.style.display = 'none';
                }
            }, 5000);
        });
    }
});