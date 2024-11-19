document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Empêche la soumission par défaut

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Enregistre le token et le rôle dans localStorage
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('role', data.role);

            // Redirige vers la page principale
            window.location.href = 'index.html';
        } else {
            // Affiche un message d'erreur si la connexion échoue
            document.getElementById('error-message').textContent = 'Email ou mot de passe incorrect.';
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        document.getElementById('error-message').textContent = 'Erreur lors de la connexion.';
    });
});
