async function init() {
    const saveBtn = document.getElementById('save-btn');
    const forgetBtn = document.getElementById('forget-btn');
    const persistentCheckbox = document.getElementById('persistent');
    const jobsAccessTokenInput = document.getElementById('jobs-access-token-input');
    const logsAccessTokenInput = document.getElementById('logs-access-token-input');

    function getPersistent() {
        return localStorage.getItem('persistent') === 'true';
    }

    function setPersistent(value) {
        localStorage.setItem('persistent', value);
    }

    persistentCheckbox.addEventListener('change', async () => {
        setPersistent(persistentCheckbox.checked)
    });

    async function saveValues(jobs_access_token, logs_access_token) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                jobs_access_token: jobs_access_token,
                logs_access_token: logs_access_token
            }, async (response) => {
                if (getPersistent()) {
                    localStorage.setItem('jobs_access_token', jobs_access_token);
                    localStorage.setItem('logs_access_token', logs_access_token);
                }
                resolve();
            });
        });
    }

    async function loadValues() {
        if (!getPersistent()) return;

        if (localStorage.getItem('jobs_access_token')) {
            jobsAccessTokenInput.className = 'mui--is-not-empty';
            jobsAccessTokenInput.value = localStorage.getItem('jobs_access_token');
        }

        if (localStorage.getItem('logs_access_token')) {
            logsAccessTokenInput.className = 'mui--is-not-empty';
            logsAccessTokenInput.value = localStorage.getItem('logs_access_token');
        }

        await saveValues(localStorage.getItem('jobs_access_token'), localStorage.getItem('logs_access_token'));
    }

    saveBtn.onclick = async () => {
        await saveValues(jobsAccessTokenInput.value, logsAccessTokenInput.value);
        alert('Saved successful');
    };

    forgetBtn.onclick = async () => {
        persistentCheckbox.checked = false;
        await saveValues(null, null);
        jobsAccessTokenInput.value = '';
        logsAccessTokenInput.value = '';
        jobsAccessTokenInput.className = 'mui--is-empty';
        logsAccessTokenInput.className = 'mui--is-empty';
        localStorage.setItem('jobs_access_token', null);
        localStorage.setItem('logs_access_token', null);
        setPersistent(false);
        alert('Saved successful');
    };

    const a = getPersistent();
    console.log({a});
    persistentCheckbox.checked = a;
    await loadValues();
}

document.addEventListener('DOMContentLoaded', async () => {
    setTimeout(async () => {
        await init();
    }, 100);
});
