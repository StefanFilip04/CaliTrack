const API_BASE_URL = 'https://calitrack-kj6l.onrender.com';

window.logout = function() {
    localStorage.clear();
    window.location.href = 'login.html';
};

const user = JSON.parse(localStorage.getItem('user') || 'null');
if (document.getElementById('welcomeName') && user) {
    document.getElementById('welcomeName').innerText = user.name || user.email;
}
