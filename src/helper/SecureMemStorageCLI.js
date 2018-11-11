const request = require('request');
const term = require('terminal-kit').terminal;

const main_menu = [
    '1. Set variable',
    '2. Exit'
];

const WELCOME_TEXT = 'Welcome to secure memory storage interface';

function showWrongParameterMessage() {
    term.red('\nWrong parameter...\n');
    process.exit();
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
                showWrongParameterMessage()
            } else {
                term.green("\nOK\n");
            }
        }

        term('Please enter your access password: ');
        access_password = await term.inputField({echo: false}).promise;
        if (!access_password) {
            showWrongParameterMessage()
        } else {
            term.green("\nOK\n");
        }

        term('Please enter key: ');
        key = await term.inputField().promise;
        if (!key) {
            showWrongParameterMessage()
        } else {
            term.green("\nOK\n");
        }

        term('Please enter value: ');
        value = await term.inputField({echo: false}).promise;
        if (!value) {
            showWrongParameterMessage()
        } else {
            term.green("\nOK\n");
        }

        term('Please enter port: ');
        port = await term.inputField({
            default: '9191'
        }).promise;
        if (!port) {
            showWrongParameterMessage()
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
                term.red('Received error:\n', error, '\n');
                process.exit();
                return;
            }

            term.green('\n---  RESULT -------------\n');
            term.blue(body);
            term.green('\n-------------------------\n');

            term.green('\nThank you, good bye!\n');
            process.exit();
        });
    });
}

function showMainMenu() {
    term('\n').eraseLineAfter.blue(`${WELCOME_TEXT}\n`);

    term.singleColumnMenu(main_menu, async (error, response) => {
        if (response.selectedIndex === 1) {
            term('\n').eraseLineAfter.blue('Good bye.\n');
            process.exit();
        } else {
            await showSetValueMenu();
        }
    });
}

showMainMenu();
