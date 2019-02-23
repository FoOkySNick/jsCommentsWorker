const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const { ToDo } = require('./toDo');
const { renderTable } = require('./tableView');
const { consoleMessages } = require('./configuration');

let toDos = [];
app();

function app () {
    console.info(consoleMessages.greetingString);
    toDos = getToDos();
    readLine(processCommand);
}

function getFilePaths () {
    return getAllFilePathsWithExtension(process.cwd(), 'js');
}

function checkArgumentsAndRun(args, quantity, cmd) {
    args.length >= quantity ? cmd(args) : console.info(consoleMessages.notEnoughArgumentsString);
}

function processCommand (command) {
    const args = command.trim().split(' ');
    const cmd = args.shift();

    switch (cmd) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            return showCommand();
        case 'important':
            return importantCommand();
        case 'user':
            return checkArgumentsAndRun(args, 1, userCommand);
        case 'sort':
            return checkArgumentsAndRun(args, 1, sortCommand);
        case 'date':
            return checkArgumentsAndRun(args, 1, dateCommand);
        default:
            console.info(consoleMessages.badCommandString);
            break;
    }
}

function getToDos() {
    const files = getFilePaths();
    const result = [];
    const regexp = ToDo.getRegexp();
    for (const file of files) {
        const fileName = file.toString().split('/').pop();
        const toDos = readFile(file, 'utf-8').match(regexp) || [];
        toDos.map(todo => todo.split(';'))
            .forEach(toDo => result.push(new ToDo(toDo, fileName)));
    }

    return result;
}

function processSorting(toDos, field) {
    switch (field) {
        case 'importance':
            return toDos.sort(ToDo.importanceSorter);
        case 'user':
            return toDos.sort(ToDo.userSorter);
        case 'date':
            return toDos.sort(ToDo.dateSorter);
        default:
            return toDos;
    }
}

function showCommand() {
    renderTable(toDos);
}

function importantCommand() {
    renderTable(toDos.filter(ToDo.importanceFilter));
}

function userCommand([ username ]) {
    renderTable(toDos.filter(ToDo.userFilter(username)));
}

function sortCommand([ field ]) {
    renderTable(processSorting(toDos, field));
}

function dateCommand([ date ]) {
    renderTable(toDos.filter(ToDo.dateFilter(new Date(date))))
}

// TODO you can do it!
