const { tableStructure, maxColumnsWidths } = require('./configuration');
const { writeLine } = require('./console');

function getGreaterWidthBelowMax(previousMaxWidth, currentWidth, maxWidthConstant) {
    return (previousMaxWidth < currentWidth && currentWidth <= maxWidthConstant) ? currentWidth : previousMaxWidth;
}

function setPuddings(content, currentColumnWidth) {
    if (content.length < currentColumnWidth) {
        const contentSpacing = ' '.repeat(currentColumnWidth - content.length);
        return `${content}${contentSpacing}`
    } else if (content.length > currentColumnWidth) {
        return content.slice(0, currentColumnWidth - 3) + '...';
    }

    return content;
}

function getColumnsWidth(content) {
    const currentColumnsWidth = {};
    Object.values(tableStructure).forEach(title => {
        currentColumnsWidth[title] = title.length
    });

    for (const toDo of content) {
        Object.keys(currentColumnsWidth).forEach(title => {
            currentColumnsWidth[title] =
                getGreaterWidthBelowMax(currentColumnsWidth[title], toDo[title].length, maxColumnsWidths[title]);
        });
    }

    return currentColumnsWidth;
}

function renderTitle(currentColumnsWidth) {
    let result = '  !';
    Object.values(tableStructure).forEach(title => {
        result += `  |  ${setPuddings(title, currentColumnsWidth[title])}`;
    });
    return result + '  \n'
}

function renderTodo(toDo, currentColumnsWidth) {
    let result = `  ${toDo['importance'] ? '!' : ' '}`;
    Object.values(tableStructure).forEach(title => {
        result += `  |  ${setPuddings(toDo[title], currentColumnsWidth[title])}`;
    });
    return result + '  \n';
}

function renderTable(toDos) {
    const currentColumnsWidth = getColumnsWidth(toDos);
    const title = renderTitle(currentColumnsWidth);
    let table = title + '-'.repeat(title.length-1) + '\n';
    for (let i = 0; i < toDos.length; i++) {
        table += renderTodo(toDos[i], currentColumnsWidth);
    }

    if (toDos.length !== 0) {
        table += '-'.repeat(title.length-1) + '\n';
    }

    writeLine(table);
}

module.exports = {
    renderTable
};
