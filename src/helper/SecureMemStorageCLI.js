const request = require('request');
const term = require('terminal-kit').terminal;
const sms = require('./SecureMemStorage');
const validator = require('validator');

const main_menu = [
    '1. Set variable',
    '2. Generate password hash',
    '3. Exit'
];

const WELCOME_TEXT = 'Welcome to secure memory storage menu';

function showWrongParameterMessage() {
    term.eraseLineAfter.red('\nWrong parameter...\n');
    showMainMenu();
}

async function showGeneratePasswordHashMenu() {
    term('\nPlease enter password: ');
    const password = await term.inputField({echo: false}).promise;
    if (!password) {
        showWrongParameterMessage()
    } else {
        term.green('\n\n-----  PASSWORD HASH  -------------------------------------------------------------------------\n');
        term.eraseLineAfter.red(await sms.hashPassword(password));
        term.green('\n-----------------------------------------------------------------------------------------------\n');
        showMainMenu();
    }
}

async function showSetValueMenu() {
    let access_token;
    let access_password;
    let key;
    let value;
    let port;

    term('Do you have an access token? (Y/n)\n');

    term.yesOrNo({yes: ['y', 'ENTER'], no: ['n']}, async (error, result) => {
        if (result) {
            term('Please enter your access token: ');
            access_token = await term.inputField({echo: false}).promise;
            if (!access_token) {
                return showWrongParameterMessage()
            } else {
                term.green("\nOK\n");
            }
        }

        term('Please enter your access password: ');
        access_password = await term.inputField({echo: false}).promise;
        if (!access_password) {
            return showWrongParameterMessage()
        } else {
            term.green("\nOK\n");
        }

        term('Please enter key: ');
        key = await term.inputField().promise;
        if (!key) {
            return showWrongParameterMessage()
        } else {
            term.green("\nOK\n");
        }

        term('Please enter value: ');
        value = await term.inputField({echo: false}).promise;
        if (!value) {
            return showWrongParameterMessage()
        } else {
            term.green("\nOK\n");
        }

        term('Please enter port: ');
        port = await term.inputField({
            default: '9191'
        }).promise;
        if (!port || !validator.isPort(port)) {
            return showWrongParameterMessage()
        } else {
            term.green("\nOK\n");
        }

        term.green('Please wait...\n');
        let url = `http://127.0.0.1:${port}/set?key=${key}&value=${value}&access_password=${access_password}`;
        if (access_token) {
            url = url + `&access_token=${access_token}`;
        }
        request(url, (error, response, body) => {
            if (error) {
                term.eraseLineAfter.red('Received error:\n', error, '\n');
                showMainMenu();
                return;
            }

            term.green('\n---  RESULT -------------\n');
            term.red(body);
            term.green('\n-------------------------\n');

            term.eraseLineAfter.green('\nThank you!\n');
            showMainMenu();
        });
    });
}

function showMainMenu() {
    term('\n').eraseLineAfter.red(`${WELCOME_TEXT}\n`);

    term.singleColumnMenu(main_menu, async (error, response) => {
        if (error) {
            console.error('Stopped:', error);
            process.exit();
        }
        if (response.selectedIndex === 1) {
            await showGeneratePasswordHashMenu();
        } else if (response.selectedIndex === 2) {
            term('\n').eraseLineAfter.blue('Good bye.\n');
            process.exit();
        } else {
            await showSetValueMenu();
        }
    });
}

showMainMenu();
