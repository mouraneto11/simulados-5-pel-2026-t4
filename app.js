let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval;
let timeRemaining = 30 * 60; // 30 minutos em segundos
const TOTAL_TIME = 30 * 60;

// Elementos do DOM
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');

const startBtn = document.getElementById('startBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const finishBtn = document.getElementById('finishBtn');
const restartBtn = document.getElementById('restartBtn');

const questionCountInfo = document.getElementById('questionCountInfo');
const timerElement = document.getElementById('timer');
const timerContainer = document.getElementById('timerContainer');
const progressBar = document.getElementById('progressBar');

const questionNumberEl = document.getElementById('questionNumber');
const questionTextEl = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');

const finalScoreText = document.getElementById('finalScoreText');
const correctCountEl = document.getElementById('correctCount');
const incorrectCountEl = document.getElementById('incorrectCount');

const simuladoSelect = document.getElementById('simuladoSelect');
const simuladoTitle = document.getElementById('simuladoTitle');

let allSimulados = [];

// Variáveis para PWA
const installBanner = document.getElementById('installBanner');
const installBtn = document.getElementById('installBtn');
let deferredPrompt;

// Inicialização
async function init() {
    try {
        // Tenta carregar o JSON (pode vir do cache do SW ou da rede)
        const response = await fetch('./simulados.json');
        if (!response.ok) throw new Error('Falha ao carregar os simulados');
        
        allSimulados = await response.json();
        
        if (allSimulados && allSimulados.length > 0) {
            populateSimuladosDropdown();
        } else {
            questionCountInfo.textContent = "Nenhum simulado encontrado.";
        }
    } catch (error) {
        console.error("Erro na inicialização:", error);
        questionCountInfo.textContent = "Erro ao carregar simulados (Verifique simulados.json).";
        simuladoSelect.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}

function populateSimuladosDropdown() {
    simuladoSelect.innerHTML = '<option value="" disabled selected>Escolha o simulado...</option>';
    allSimulados.forEach((sim, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = sim.title;
        simuladoSelect.appendChild(option);
    });
}

simuladoSelect.addEventListener('change', (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
        const selectedSimulado = allSimulados[selectedIndex];
        questions = selectedSimulado.questions;
        simuladoTitle.textContent = selectedSimulado.title;
        
        if (questions && questions.length > 0) {
            questionCountInfo.textContent = `${questions.length} Questões`;
            startBtn.disabled = false;
        } else {
            questionCountInfo.textContent = "Nenhuma questão encontrada neste simulado.";
            startBtn.disabled = true;
        }
    } else {
        startBtn.disabled = true;
    }
});

// Registro do Service Worker (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('ServiceWorker registrado com sucesso:', registration.scope))
            .catch(err => console.log('Falha ao registrar ServiceWorker:', err));
    });
}

// Interceptar o evento de instalação (PWA)
window.addEventListener('beforeinstallprompt', (e) => {
    // Previne o prompt padrão
    e.preventDefault();
    deferredPrompt = e;
    // Exibe nosso banner customizado
    installBanner.classList.remove('hidden');
});

// Ação do botão de instalar (PWA)
installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('Usuário aceitou a instalação do PWA');
            installBanner.classList.add('hidden');
        } else {
            console.log('Usuário recusou a instalação do PWA');
        }
        deferredPrompt = null;
    }
});

// Event Listeners dos botões
startBtn.addEventListener('click', startQuiz);
prevBtn.addEventListener('click', showPreviousQuestion);
nextBtn.addEventListener('click', showNextQuestion);
finishBtn.addEventListener('click', finishQuiz);
restartBtn.addEventListener('click', resetQuiz);

// Lógica do Quiz
function startQuiz() {
    userAnswers = new Array(questions.length).fill(null);
    currentQuestionIndex = 0;
    timeRemaining = TOTAL_TIME;
    
    startScreen.classList.remove('active-screen');
    startScreen.classList.add('hidden-screen');
    
    quizScreen.classList.remove('hidden-screen');
    quizScreen.classList.add('active-screen');
    
    startTimer();
    renderQuestion();
}

function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        // Aviso de 5 minutos
        if (timeRemaining <= 300) { 
            timerContainer.classList.add('timer-warning');
        }
        
        // Fim do tempo
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            finishQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    
    questionNumberEl.textContent = `Questão ${currentQuestionIndex + 1} de ${questions.length}`;
    questionTextEl.textContent = q.text;
    
    // Atualiza Barra de Progresso
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Renderiza Opções
    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D', 'E'];
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        
        if (userAnswers[currentQuestionIndex] !== null) {
            btn.disabled = true;
            if (index === q.correctAnswer) {
                btn.classList.add('correct-ans');
            } else if (index === userAnswers[currentQuestionIndex]) {
                btn.classList.add('wrong-ans');
            }
        }
        
        btn.innerHTML = `
            <span class="option-letter">${letters[index]})</span>
            <span class="option-text">${opt}</span>
        `;
        
        btn.onclick = () => selectOption(index);
        optionsContainer.appendChild(btn);
    });
    
    // Controle de Botões de Navegação
    if (currentQuestionIndex === 0) {
        prevBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
    }
    
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.classList.add('hidden');
        finishBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        finishBtn.classList.add('hidden');
    }
}

function selectOption(index) {
    if (userAnswers[currentQuestionIndex] !== null) return;
    userAnswers[currentQuestionIndex] = index;
    renderQuestion(); // Re-renderiza para mostrar visualmente a seleção
}

function showNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
}

function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function finishQuiz() {
    clearInterval(timerInterval);
    timerContainer.classList.remove('timer-warning');
    
    quizScreen.classList.remove('active-screen');
    quizScreen.classList.add('hidden-screen');
    
    resultScreen.classList.remove('hidden-screen');
    resultScreen.classList.add('active-screen');
    
    calculateScore();
}

function calculateScore() {
    let correct = 0;
    
    userAnswers.forEach((ans, index) => {
        if (ans !== null && ans === questions[index].correctAnswer) {
            correct++;
        }
    });
    
    const total = questions.length;
    const incorrect = total - correct;
    
    // Nota de 0 a 10
    const score10 = ((correct / total) * 10).toFixed(1);
    
    finalScoreText.textContent = score10;
    correctCountEl.textContent = correct;
    incorrectCountEl.textContent = incorrect;
    
    // Summary
    const summaryContainer = document.getElementById('summaryContainer');
    summaryContainer.innerHTML = '';
    summaryContainer.classList.remove('hidden');

    questions.forEach((q, index) => {
        const userAns = userAnswers[index];
        const isCorrect = userAns === q.correctAnswer;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = `summary-item ${isCorrect ? 'correct-item' : 'wrong-item'}`;
        
        let html = `<div class="summary-q">${index + 1}. ${q.text}</div>`;
        
        if (userAns !== null && !isCorrect) {
            html += `<div class="summary-a user-wrong">Sua resposta: ${q.options[userAns]}</div>`;
        } else if (userAns === null) {
            html += `<div class="summary-a user-wrong">Não respondida</div>`;
        }
        html += `<div class="summary-a correct-text">Gabarito: ${q.options[q.correctAnswer]}</div>`;
        
        itemDiv.innerHTML = html;
        summaryContainer.appendChild(itemDiv);
    });
    
    // Ajuste visual do placar baseado na nota
    const scoreCircle = document.querySelector('.score-circle');
    if (score10 >= 7.0) {
        scoreCircle.style.borderColor = 'var(--success)';
        scoreCircle.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)';
    } else if (score10 >= 5.0) {
        scoreCircle.style.borderColor = '#eab308'; // Amarelo/Atenção
        scoreCircle.style.boxShadow = '0 0 20px rgba(234, 179, 8, 0.3)';
    } else {
        scoreCircle.style.borderColor = 'var(--error)';
        scoreCircle.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3)';
    }
}

function resetQuiz() {
    resultScreen.classList.remove('active-screen');
    resultScreen.classList.add('hidden-screen');
    
    startScreen.classList.remove('hidden-screen');
    startScreen.classList.add('active-screen');
    
    timerElement.textContent = "30:00";
    userAnswers = [];
    document.getElementById('summaryContainer').classList.add('hidden');
    document.getElementById('summaryContainer').innerHTML = '';
}

// Inicia a aplicação
init();
