import $ from 'jquery';
import { parseCode } from './code-analyzer';
import { Parsing } from './parse';
import { clear } from './parse';
import { symbolicSub } from './symbolic-substitution';
import { clearSymbolic } from './symbolic-substitution';
import { getValueCondition } from './code-with-input';
import { getNumParams } from './symbolic-substitution';
import { getIdInput } from './symbolic-substitution';

let conditionWithValue = [];
let indexCond = 0;
let infoTable = [];
let code;

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let inputsLine = $('#input').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        infoTable = Parsing(parsedCode.body);
        createTableInHTML();
        code = symbolicSub(infoTable, codeToParse);
        conditionWithValue = getValueCondition(code, getIdInput(), inputsLine, getNumParams());
        showInHtml();
        clear();
        clearSymbolic();
        infoTable = [];
        conditionWithValue = [];
        indexCond = 0;
    });
});

//draw the table
function createTableInHTML() {
    var table = document.getElementById('myTable');
    table.style.visibility = 'visible';
    for (let index = 1; index <= infoTable.length; index++) {
        const element = infoTable[index - 1];
        var row = table.insertRow(index);
        var cellLine = row.insertCell(0);
        var cellType = row.insertCell(1);
        var cellName = row.insertCell(2);
        var cellCondition = row.insertCell(3);
        var cellValue = row.insertCell(4);
        cellLine.innerHTML = addValue(element.Line);
        cellType.innerHTML = addValue(element.Type);
        cellName.innerHTML = addValue(element.Name);
        cellCondition.innerHTML = addValue(element.Condition);
        cellValue.innerHTML = addValue(element.Value);
    }

}

//return the value
function addValue(element) {
    if (element == undefined)
        return '';
    else
        return element;
}

//show the code after simbolic substitution.
function showInHtml() {
    let lines = code.split('\n');
    for (let index = 0; index < lines.length; index++) {
        const element = space(lines[index]);
        if (element.includes('if') || element.includes('else if')) {
            if (conditionWithValue[indexCond] == true)
                $('#symbolic').append('<div class="trueCond">' + element + '</div>');
            else
                $('#symbolic').append('<div class="falseCond">' + element + '</div>');
            indexCond++;
        }
        else
            $('#symbolic').append('<div class="regular">' + element + '</div>');
    }
}

// replace uniqe characters.
function space(element) {
    while (element.includes(' '))
        element = element.replace(' ', '&nbsp;');
    while (element.includes('\''))
        element = element.replace('\'', '&apos;');
    return element;
}




