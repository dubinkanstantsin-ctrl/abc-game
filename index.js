/**
 * Master of ABC: The Hishigata Method
 * Game Logic — B2B + B2C branches
 */

const game = {
    // State
    currentPhase: 1,
    currentQuestion: 0,
    totalScore: 0,
    answers: {},
    direction: null, // 'b2b' or 'b2c'

    // Question banks per direction
    questionBanks: {
        b2c: {
            icon: '🚪',
            title: 'Кейс: Межкомнатные двери',
            context: 'Вы продаёте межкомнатные двери через дизайнеров. Давайте оценим потенциального партнёра.',
            questions: [
                {
                    text: 'В работе с заказчиками какая сторона принимает окончательное решение по выбору поставщика?',
                    options: [
                        { letter: 'A', text: 'Я рекомендую бренд и конкретного поставщика, и заказчики чаще всего пользуются рекомендацией', points: 8 },
                        { letter: 'B', text: 'Я рекомендую бренд и поставщика, но окончательный выбор за заказчиком', points: 6 },
                        { letter: 'C', text: 'Я рекомендую только бренд, а поставщика выбирает заказчик', points: 4 },
                        { letter: 'D', text: 'Бренд дверей и поставщика выбирает заказчик', points: 2 }
                    ]
                },
                {
                    text: 'Как часто в работе с заказчиками вы приобретаете межкомнатные двери?',
                    options: [
                        { letter: 'A', text: '2 и более раза в 3 месяца', points: 8 },
                        { letter: 'B', text: '1 раз в 3 месяца', points: 6 },
                        { letter: 'C', text: '1 раз в 3-6 месяцев', points: 4 },
                        { letter: 'D', text: 'Реже 1 раза в 6 месяцев', points: 2 }
                    ]
                },
                {
                    text: 'Какой средний чек на покупку межкомнатных дверей у ваших заказчиков?',
                    options: [
                        { letter: 'A', text: 'Более 250 тыс.', points: 8 },
                        { letter: 'B', text: 'От 150 до 250 тыс.', points: 6 },
                        { letter: 'C', text: 'От 80 до 150 тыс.', points: 4 },
                        { letter: 'D', text: 'До 80 тыс.', points: 2 }
                    ]
                }
            ]
        },
        b2b: {
            icon: '🏢',
            title: 'Кейс: IT-аутсорсинг',
            context: 'Вы — руководитель отдела продаж IT-компании. Вам нужно оценить потенциального корпоративного клиента, который хочет передать разработку на аутсорс.',
            questions: [
                {
                    text: 'Как устроен процесс принятия решений у потенциального клиента?',
                    options: [
                        { letter: 'A', text: 'Наш контакт — ЛПР (CTO/CEO), он единолично принимает решение', points: 8 },
                        { letter: 'B', text: 'ЛПР вовлечён, но нужно согласование с закупками или финансами', points: 6 },
                        { letter: 'C', text: 'Общаемся с менеджером проекта, решение принимает кто-то выше', points: 4 },
                        { letter: 'D', text: 'Контакт — рядовой сотрудник, до ЛПР далеко, тендерная процедура', points: 2 }
                    ]
                },
                {
                    text: 'Какой предполагаемый годовой бюджет клиента на IT-услуги?',
                    options: [
                        { letter: 'A', text: 'Более 10 млн ₽ в год', points: 8 },
                        { letter: 'B', text: 'От 5 до 10 млн ₽ в год', points: 6 },
                        { letter: 'C', text: 'От 1 до 5 млн ₽ в год', points: 4 },
                        { letter: 'D', text: 'Менее 1 млн ₽ в год или «пока не определён»', points: 2 }
                    ]
                },
                {
                    text: 'Насколько срочна потребность клиента?',
                    options: [
                        { letter: 'A', text: 'Горит: дедлайн в ближайший месяц, бюджет выделен, команда нужна вчера', points: 8 },
                        { letter: 'B', text: 'Планируют запуск в ближайший квартал, активно ищут подрядчика', points: 6 },
                        { letter: 'C', text: 'Изучают рынок, сроки размыты, возможно в следующем полугодии', points: 4 },
                        { letter: 'D', text: '«Просто прицениваемся» — нет конкретного проекта и сроков', points: 2 }
                    ]
                },
                {
                    text: 'Был ли у клиента опыт работы с внешними IT-командами?',
                    options: [
                        { letter: 'A', text: 'Да, работают с аутсорсом постоянно, понимают процессы и риски', points: 8 },
                        { letter: 'B', text: 'Был один-два проекта, опыт средний, но открыты к формату', points: 6 },
                        { letter: 'C', text: 'Нет опыта, но есть внутренняя IT-команда — понимают специфику', points: 4 },
                        { letter: 'D', text: 'Нет опыта, нет IT-команды, плохо понимают, чего хотят', points: 2 }
                    ]
                }
            ]
        }
    },

    // Category definitions
    categories: {
        A: {
            name: 'Категория A',
            title: 'Самые перспективные',
            action: 'Звоним каждый месяц',
            icon: '🏆',
            class: 'category-a'
        },
        B: {
            name: 'Категория B',
            title: 'Хорошие клиенты с потенциалом',
            action: 'Звоним раз в 3 месяца',
            icon: '⭐',
            class: 'category-b'
        },
        C: {
            name: 'Категория C',
            title: 'Слабые',
            action: 'Звоним раз в полгода',
            icon: '📋',
            class: 'category-c'
        },
        D: {
            name: 'Категория D',
            title: 'Не перспективные',
            action: 'Сразу закрываем или автоматизируем',
            icon: '⚠️',
            class: 'category-d'
        }
    },

    // Thresholds per direction (different number of questions)
    thresholds: {
        b2c: { A: 20, B: 14, C: 10, maxScore: 24 },
        b2b: { A: 26, B: 18, C: 12, maxScore: 32 }
    },

    // Initialize
    init() {
        this.updateProgress();
    },

    // Show a specific phase
    showPhase(phaseId) {
        document.querySelectorAll('.phase').forEach(phase => {
            phase.classList.remove('active');
        });

        const targetPhase = document.getElementById(`phase-${phaseId}`);
        if (targetPhase) {
            targetPhase.classList.add('active');
        }

        this.currentPhase = phaseId;
        this.updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Update progress bar
    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const totalSteps = 6;

        let progress = 0;
        let step = 1;

        const phaseMap = {
            1: { progress: 10, step: 1 },
            direction: { progress: 20, step: 2 },
            2: { progress: 35, step: 3 },
            3: { progress: 50, step: 4 },
            4: { progress: 80, step: 5 },
            5: { progress: 100, step: 6 },
            exit: { progress: 100, step: 6 }
        };

        const mapped = phaseMap[this.currentPhase];
        if (mapped) {
            progress = mapped.progress;
            step = mapped.step;
        }

        // Refine progress during questions
        if (this.currentPhase === 3 && this.direction) {
            const bank = this.questionBanks[this.direction];
            const questionProgress = bank ? (this.currentQuestion / bank.questions.length) : 0;
            progress = 50 + Math.round(questionProgress * 30);
        }

        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `Шаг ${step} из ${totalSteps}`;
    },

    // Phase 1 → Direction choice
    startGame() {
        this.showPhase('direction');
    },

    // Exit game
    exitGame() {
        this.showPhase('exit');
    },

    // Select direction (B2B or B2C)
    selectDirection(dir) {
        this.direction = dir;
        this.answers = {};
        this.totalScore = 0;
        this.currentQuestion = 0;
        this.showPhase(2);
    },

    // Phase 2 → Phase 3 (build questions)
    showQuestions() {
        const bank = this.questionBanks[this.direction];
        if (!bank) return;

        // Set simulation header
        document.getElementById('simulation-icon').textContent = bank.icon;
        document.getElementById('simulation-title').textContent = bank.title;
        document.getElementById('simulation-context').textContent = bank.context;

        // Build question HTML
        this.renderQuestion(0);
        this.showPhase(3);
    },

    // Render a single question by index
    renderQuestion(index) {
        const bank = this.questionBanks[this.direction];
        if (!bank || index >= bank.questions.length) return;

        const q = bank.questions[index];
        const total = bank.questions.length;
        const container = document.getElementById('questions-container');

        let optionsHTML = '';
        q.options.forEach(opt => {
            optionsHTML += `
                <button class="option" onclick="game.answer(${index}, '${opt.letter}', ${opt.points}, this)">
                    <span class="option-letter">${opt.letter}</span>
                    <span class="option-text">${opt.text}</span>
                </button>
            `;
        });

        container.innerHTML = `
            <div class="question-block" id="question-${index}">
                <div class="question-header">
                    <span class="question-number">Вопрос ${index + 1} / ${total}</span>
                </div>
                <p class="question-text">${q.text}</p>
                <div class="options">
                    ${optionsHTML}
                </div>
            </div>
        `;

        this.currentQuestion = index;
        this.updateProgress();
    },

    // Handle answer selection
    answer(questionIndex, letter, points, el) {
        const bank = this.questionBanks[this.direction];
        if (!bank) return;

        // Store answer
        this.answers[questionIndex] = { letter, points };
        this.totalScore = Object.values(this.answers).reduce((sum, a) => sum + a.points, 0);

        // Mark selected
        const questionBlock = document.getElementById(`question-${questionIndex}`);
        if (questionBlock) {
            questionBlock.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            el.classList.add('selected');
        }

        // Advance after delay
        setTimeout(() => {
            if (questionIndex < bank.questions.length - 1) {
                this.renderQuestion(questionIndex + 1);
            } else {
                this.showResults();
            }
        }, 350);
    },

    // Get category based on score and direction thresholds
    getCategory(score) {
        const t = this.thresholds[this.direction] || this.thresholds.b2c;
        if (score >= t.A) return 'A';
        if (score >= t.B) return 'B';
        if (score >= t.C) return 'C';
        return 'D';
    },

    // Show results
    showResults() {
        const category = this.getCategory(this.totalScore);
        const catData = this.categories[category];
        const t = this.thresholds[this.direction] || this.thresholds.b2c;

        document.getElementById('total-score').textContent = this.totalScore;
        document.getElementById('score-max').textContent = `/ ${t.maxScore}`;
        document.getElementById('result-icon').textContent = catData.icon;

        // Direction badge
        const dirBadge = document.getElementById('direction-badge-result');
        const dirLabel = this.direction === 'b2b' ? '🏢 B2B' : '🚪 B2C';
        dirBadge.textContent = dirLabel;
        dirBadge.className = `direction-badge-result dir-${this.direction}`;

        const categoryDisplay = document.getElementById('category-display');
        categoryDisplay.className = `category-display ${catData.class}`;
        categoryDisplay.innerHTML = `
            <div class="category-letter">${catData.name}</div>
            <div class="category-name">${catData.title}</div>
            <div class="category-action">${catData.action}</div>
        `;

        // Update "other direction" button text
        const otherDir = this.direction === 'b2b' ? 'B2C 🚪' : 'B2B 🏢';
        document.getElementById('btn-other-dir').textContent = `Пройти кейс ${otherDir}`;

        this.showPhase(4);
    },

    // Show CTA
    showCTA() {
        this.showPhase(5);
    },

    // Play the other direction
    playOtherDirection() {
        const otherDir = this.direction === 'b2b' ? 'b2c' : 'b2b';
        this.selectDirection(otherDir);
    },

    // Restart game completely
    restart() {
        this.currentPhase = 1;
        this.currentQuestion = 0;
        this.totalScore = 0;
        this.answers = {};
        this.direction = null;

        const container = document.getElementById('questions-container');
        if (container) container.innerHTML = '';

        this.showPhase(1);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    game.init();
});
