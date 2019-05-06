const term = require('terminal-kit').terminal;
const {SecureMemStorageServerWrapper} = require('./SecureMemStorage');
const config = require('../config/config');
const smssw = new SecureMemStorageServerWrapper({port: config.secure_memory_storage.secure_memory_storage_server.port});

const main_menu = [
    '1. Set variable',
    '2. Exit'
];

const WELCOME_TEXT = 'Welcome to secure memory storage menu';

function showWrongParameterMessage() {
    term.eraseLineAfter.red('\nWrong parameter...\n');
    showMainMenu();
}

async function showSetValueMenu() {
    term('Please enter master_password: ');
    const master_password = await term.inputField({echo: false}).promise;
    if (!master_password) {
        return showWrongParameterMessage()
    } else {
        term.green("\nOK\n");
    }

    term('Please enter key: ');
    const key = await term.inputField().promise;
    if (!key) {
        return showWrongParameterMessage()
    } else {
        term.green("\nOK\n");
    }

    term('Please enter value: ');
    const value = await term.inputField({echo: false}).promise;
    if (!value) {
        return showWrongParameterMessage()
    } else {
        term.green("\nOK\n");
    }
    console.log({master_password, key, value});

    term.green('Please wait...\n');
    const res = await smssw.setValue(key, value, master_password);

    term.green('\n---  RESULT -------------\n');
    term.red(res);
    term.green('\n-------------------------\n');

    term.eraseLineAfter.green('\nThank you!\n');
    showMainMenu();
}

function showMainMenu() {
    term('\n').eraseLineAfter.red(`${WELCOME_TEXT}\n`);

    term.singleColumnMenu(main_menu, async (error, response) => {
        if (error) {
            console.error('Stopped:', error);
            process.exit();
        }
        if (response.selectedIndex === 0) {
            await showSetValueMenu();
        } else if (response.selectedIndex === 1) {
            term('\n').eraseLineAfter.blue('Good bye.\n');
            process.exit();
        } else {
            await showSetValueMenu();
        }
    });
}

showMainMenu();
