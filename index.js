/**
 * Master of ABC: The Hishigata Method
 * Game Logic
 */

const game = {
    // State
    currentPhase: 1,
    currentQuestion: 1,
    totalScore: 0,
    answers: {},

    // Category definitions
    categories: {
        A: {
            min: 20,
            max: 24,
            name: 'Категория A',
            title: 'Самые перспективные',
            action: 'Звоним каждый месяц',
            icon: '🏆',
            class: 'category-a'
        },
        B: {
            min: 14,
            max: 19,
            name: 'Категория B',
            title: 'Хорошие клиенты с потенциалом',
            action: 'Звоним раз в 3 месяца',
            icon: '⭐',
            class: 'category-b'
        },
        C: {
            min: 10,
            max: 13,
            name: 'Категория C',
            title: 'Слабые',
            action: 'Звоним раз в полгода',
            icon: '📋',
            class: 'category-c'
        },
        D: {
            min: 0,
            max: 9,
            name: 'Категория D',
            title: 'Не перспективные',
            action: 'Сразу закрываем или автоматизируем',
            icon: '⚠️',
            class: 'category-d'
        }
    },

    // Initialize
    init() {
        this.updateProgress();
    },

    // Show a specific phase
    showPhase(phaseId) {
        // Hide all phases
        document.querySelectorAll('.phase').forEach(phase => {
            phase.classList.remove('active');
        });

        // Show target phase
        const targetPhase = document.getElementById(`phase-${phaseId}`);
        if (targetPhase) {
            targetPhase.classList.add('active');
        }

        this.currentPhase = phaseId;
        this.updateProgress();
    },

    // Update progress bar
    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        let progress = 20;
        let step = 1;

        if (this.currentPhase === 2) {
            progress = 40;
            step = 2;
        } else if (this.currentPhase === 3) {
            progress = 40 + (this.currentQuestion * 10);
            step = 3;
        } else if (this.currentPhase === 4) {
            progress = 80;
            step = 4;
        } else if (this.currentPhase === 5 || this.currentPhase === 'exit') {
            progress = 100;
            step = 5;
        }

        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        if (progressText) {
            progressText.textContent = `Шаг ${step} из 5`;
        }
    },

    // Start the game (Phase 1 → Phase 2)
    startGame() {
        this.showPhase(2);
    },

    // Exit game
    exitGame() {
        this.showPhase('exit');
    },

    // Show questions (Phase 2 → Phase 3)
    showQuestions() {
        this.currentQuestion = 1;
        this.showPhase(3);
        this.showQuestion(1);
    },

    // Show specific question
    showQuestion(questionNum) {
        // Hide all questions
        document.querySelectorAll('.question-block').forEach(q => {
            q.classList.add('hidden');
        });

        // Show target question
        const targetQuestion = document.getElementById(`question-${questionNum}`);
        if (targetQuestion) {
            targetQuestion.classList.remove('hidden');
        }

        this.currentQuestion = questionNum;
        this.updateProgress();
    },

    // Handle answer selection
    answer(questionNum, letter, points) {
        // Store answer
        this.answers[questionNum] = { letter, points };
        this.totalScore = Object.values(this.answers).reduce((sum, a) => sum + a.points, 0);

        // Mark selected option
        const questionBlock = document.getElementById(`question-${questionNum}`);
        if (questionBlock) {
            questionBlock.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            event.currentTarget.classList.add('selected');
        }

        // Move to next question or show results
        setTimeout(() => {
            if (questionNum < 3) {
                this.showQuestion(questionNum + 1);
            } else {
                this.showResults();
            }
        }, 300);
    },

    // Calculate category based on score
    getCategory(score) {
        if (score >= 20) return 'A';
        if (score >= 14) return 'B';
        if (score >= 10) return 'C';
        return 'D';
    },

    // Show results (Phase 3 → Phase 4)
    showResults() {
        const category = this.getCategory(this.totalScore);
        const catData = this.categories[category];

        // Update score display
        document.getElementById('total-score').textContent = this.totalScore;
        document.getElementById('result-icon').textContent = catData.icon;

        // Update category display
        const categoryDisplay = document.getElementById('category-display');
        categoryDisplay.className = `category-display ${catData.class}`;
        categoryDisplay.innerHTML = `
            <div class="category-letter">${catData.name}</div>
            <div class="category-name">${catData.title}</div>
            <div class="category-action">${catData.action}</div>
        `;

        this.showPhase(4);
    },

    // Show CTA (Phase 4 → Phase 5)
    showCTA() {
        this.showPhase(5);
    },

    // Restart game
    restart() {
        // Reset state
        this.currentPhase = 1;
        this.currentQuestion = 1;
        this.totalScore = 0;
        this.answers = {};

        // Reset UI
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });

        this.showPhase(1);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    game.init();
});
