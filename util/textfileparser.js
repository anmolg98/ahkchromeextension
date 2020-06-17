var ArrayofKeys = [];
var text = [];
function AddSend(InstructionString) {
    var ArrayofKeys = [];
    var shift = 0;
    var ctrl = 0;
    var alt = 0;
    var index = 0;
    InstructionString = InstructionString.trim();
    console.log(InstructionString);
    while (index < InstructionString.length) {
        if (InstructionString[index] == '{') {
            index++;
            var CurrentArray = [];
            while (InstructionString[index] != '}') {
                CurrentArray.push(InstructionString[index]);
                index++;
            }
            index++;
            CurrentString = CurrentArray.join('');
            CurrentString = CurrentString.toLowerCase();
            if (CurrentString == 'shiftdown') {
                shift = 1;
                var key = createKeyObject('down', 16, 'Shift', shift, ctrl, alt);
                ArrayofKeys.push(key);
            } else if (CurrentString == 'ctrldown') {
                ctrl = 1;
                var key = createKeyObject('down', 17, 'Control', shift, ctrl, alt);
                ArrayofKeys.push(key);
            } else if (CurrentString == 'altdown') {
                alt = 1;
                var key = createKeyObject('down', 18, 'Alt', shift, ctrl, alt);
                ArrayofKeys.push(key);
            } else if (CurrentString == 'shiftup') {
                shift = 0;
                var key = createKeyObject('up', 16, 'Shift', shift, ctrl, alt);
                ArrayofKeys.push(key);
            } else if (CurrentString == 'ctrlup') {
                ctrl = 0;
                var key = createKeyObject('up', 17, 'Control', shift, ctrl, alt);
                ArrayofKeys.push(key);
            } else if (CurrentString == 'altup') {
                alt = 0;
                var key = createKeyObject('up', 18, 'Alt', shift, ctrl, alt);
                ArrayofKeys.push(key);
            } else {
                if (_REVERSE_MAP[CurrentString]) {
                    var key = createKeyObject('default', _REVERSE_MAP[CurrentString], '', shift, ctrl, alt);
                    ArrayofKeys.push(key);
                }
            }

        } else {
            if (_REVERSE_MAP[InstructionString[index]]) {
                var key = createKeyObject('default', _REVERSE_MAP[InstructionString[index]], InstructionString[index], shift, ctrl, alt);
                ArrayofKeys.push(key);

            } else if (_REVERSE_MAP[_SHIFT_MAP[InstructionString[index]]]) {
                var key = createKeyObject('default', _REVERSE_MAP[_SHIFT_MAP[InstructionString[index]]], InstructionString[index], shift, ctrl, alt);
                ArrayofKeys.push(key);
            }
            index++;
        }
    }
    return ArrayofKeys;
}
/*
 *Adds sleep command in the array of corresponding 
 * shortcut
 */
function AddSleep(InstructionString) {
    var SleepTime = parseInt(InstructionString);
    return SleepTime;

}

function AddClick(InstructionString) {
    console.log('addclick');
    InstructionString = InstructionString.trim();
    var CoordinateArray = InstructionString.split(/[ ,]+/);
    console.log(InstructionString, CoordinateArray);
    return CoordinateArray;
}

function createKeyObject(type, keyCode, key, shift, ctrl, alt) {
    var obj = {
        "type": type,
        "keyCode": keyCode,
        "key": key,
        "shift": shift,
        "ctrl": ctrl,
        "alt": alt
    };
    return obj
}
/*
* To convert lines of text
* to Paragraphs, each 
* paragraph contains  a shortcut along with
  instructions    
*/
function toArrayofParagraphs(ArrayofLines) {

    var currentParagraph = [];
    for (var i = 0; i < ArrayofLines.length; i++) {
        if (ArrayofLines[i].length > 1) {

            currentParagraph.push(ArrayofLines[i]);
            //console.log(i,'y',currentParagraph,ArrayofLines[i].length);
            console.log(currentParagraph);
        } else {

            if (currentParagraph.length) {

                console.log('current', currentParagraph);
                paragraph_parse(currentParagraph);

                currentParagraph.length = 0;
            }
        }
    }

}
/*
 * Shortcut along with its 
 * instruction refered as a paragraph.
 * function to parse a paragraph
 */
function paragraph_parse(sampleShortcutInstruction) {
    var index = 0;
    var key = Shortcut_parse(sampleShortcutInstruction[index]);
    console.log(key);
    var obj = [];
    index++;
    while (index < sampleShortcutInstruction.length) {
        obj.push(Instruction_parse(sampleShortcutInstruction[index]));
        index++;
    }
    var output = {};
    output[key] = obj;
    console.log('setting it', output);
    chrome.storage.local.set(output);
}

function Shortcut_parse(Shortcut_string) {
    console.log('shortcut', Shortcut_string);
    var RequiredShortcutFormat = [];
    var splited = Shortcut_string.split(" ").filter(Boolean);
    console.log(splited);
    console.log(splited[0]);
    var index = 0;
    var check_index = 1;
    while (check_index < splited.length) {
        if (splited[check_index] != '&') {
            console.log(splited[check_index], check_index);
            return null;
        }
        check_index = check_index + 2;
    }
    while (index < splited.length) {
        console.log(splited[index], _REVERSE_MAP[splited[index]]);
        console.log('type', typeof (splited[index]), splited[index].length, splited[index][0]);
        console.log(splited[index][1]);
        console.log(_REVERSE_MAP);

        splited[index] = splited[index].trim();
        console.log(splited[index].length, splited[index], _REVERSE_MAP[splited[index]]);
        if (_REVERSE_MAP[splited[index]]) {
            RequiredShortcutFormat.push(_REVERSE_MAP[splited[index]]);
        } else {
            return null;
        }
        index = index + 2;
    }
    console.log(RequiredShortcutFormat.join('+'));
    return RequiredShortcutFormat.join('+');
}
/*
 *Parsing the instruction
 *
 */
function Instruction_parse(InstructionString) {
    var i = 0;
    var CommandType = [];
    InstructionString = InstructionString.trim();
    while (InstructionString[i] != ' ') {
        CommandType.push(InstructionString[i]);
        i++;
    }

    var CommandString = CommandType.join('');
    CommandString = CommandString.toLocaleLowerCase();
    InstructionString = InstructionString.substr(i);
    InstructionString = InstructionString.trim();
    if (CommandString == 'send') {

        var value = AddSend(InstructionString);
        var obj = { 'send': value };
        return obj;
    } else if (CommandString == 'sleep') {
        var value = AddSleep(InstructionString);
        var obj = { 'sleep': value };
        return obj;
    } else if (CommandString == 'click') {
        var value = AddClick(InstructionString);
        console.log('click');
        var obj = { 'click': value };
        return obj;
    } else if (CommandString == 'select_goalcategory') {
        var obj = { 'select_goalcategory': InstructionString };
        return obj;
    } else if (CommandString == 'select_discard') {
        var obj = { 'select_discard': InstructionString };
        return obj;
    } else if (CommandString == 'select_nottrained') {
        var obj = { 'select_nottrained': InstructionString };
        return obj;
    } else return;
}