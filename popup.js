import { _MAP, _SHIFT_MAP, _getReverseMap, _REVERSE_MAP } from '/keyboard.js';
_getReverseMap();
$(function () {
    chrome.storage.local.get('@#', function (data) {
        if (data['@#']) {
            var y = data['@#'];
            document.getElementById("abc").innerHTML = y;
        }
    });
    chrome.storage.local.get('@$', function (data) {
        if (data['@$']) {
            var y = data['@$'];
            document.getElementById("locale").innerHTML = y;
        }
    });

    $("button").on('click', refreshWorkFlow);
});

function refreshWorkFlow(event) {
    chrome.storage.local.clear();
    refreshCurrentActive(event);
    refreshCurrentLocale(event);
    var fname = "/jsons/" + event.target.id + "/expander.json";
    setStorage(fname, setSnippets);
    fname = "/jsons/" + event.target.id + "/shortcuts.json";
    setStorage(fname, setShortcuts);
}
var ArrayofKeys = [];
var text = [];
function setShortcuts(input) {
    var output = {};
    for (var key in input) {
        if (input.hasOwnProperty(key)) {
            var OutputKey = parse_shortcut(key);
            var OutputobjArr = [];
            var instructionArray = input[key];
            for (var index = 0; index < instructionArray.length; index++) {
                var currentInstructionArray = instructionArray[index];
                var instructionType = currentInstructionArray[0];
                instructionType = instructionType.toLowerCase();
                var instructionObject;
                if (instructionType == 'send') {
                    var shift = false;
                    var ctrl = false;
                    var alt = false;
                    var sendsequence = [];
                    for (var pos = 1; pos < currentInstructionArray.length; pos++) {
                        var currentchar = currentInstructionArray[pos];
                        if (currentchar == "shiftdown") {
                            shift = true;
                            currentchar = "shift"
                        }
                        if (currentchar == "ctrldown") {
                            ctrl = true;
                            currentchar = "ctrl"
                        }
                        if (currentchar == "altdown") {
                            alt = true;
                            currentchar = "alt"
                        }
                        if (currentchar == "shiftup") { shift = false; continue; }
                        if (currentchar == "ctrlup") { ctrl = false; continue }
                        if (currentchar == "altup") { alt = false; continue; }
                        var currentcharKeyCode = _REVERSE_MAP[currentchar]
                        var temp = currentcharKeyCode;
                        var flag = 0;
                        if (temp >= 96 && temp <= 105) {
                            flag = 1;
                            currentchar = temp - 96
                        }
                        if (temp >= 65 && temp <= 90) flag = 1;
                        if (temp >= 48 && temp <= 57) flag = 1;
                        if (temp >= 186 && temp <= 192) flag = 1;
                        if (temp >= 106 && temp <= 111) flag = 1;
                        if (temp >= 219 && temp <= 221 || temp == 32) flag = 1;
                        if (flag == 1) {
                            var currentcharobj = { 'key': currentchar, 'keyCode': currentcharKeyCode, 'shift': shift, 'ctrl': ctrl, 'alt': alt };
                        } else {
                            var currentcharobj = { 'keyCode': currentcharKeyCode, 'shift': shift, 'ctrl': ctrl, 'alt': alt };
                        }
                        sendsequence.push(currentcharobj);
                        console.log('push', currentcharobj);

                    }
                    instructionObject = { 'send': sendsequence };
                    OutputobjArr.push(instructionObject);
                } else if (instructionType == 'sleep') {
                    var time = parseInt(currentInstructionArray[1]);
                    instructionObject = { 'sleep': time };
                    OutputobjArr.push(instructionObject);
                } else if (instructionType == 'click') {
                    var x = parseInt(currentInstructionArray[1]);
                    var y = parseInt(currentInstructionArray[2]);
                    value = [];
                    value.push(x);
                    value.push(y);
                    instructionObject = { 'click': value };
                    OutputobjArr.push(instructionObject);

                } else if (instructionType == 'select_goalcategory') {
                    instructionObject = { 'select_goalcategory': currentInstructionArray[1] };
                    OutputobjArr.push(instructionObject);
                } else if (instructionType == 'select_discard') {
                    instructionObject = { 'select_discard': currentInstructionArray[1] };
                    OutputobjArr.push(instructionObject);
                } else if (instructionType == 'select_nottrained') {
                    instructionObject = { 'select_nottrained': currentInstructionArray[1] };
                    OutputobjArr.push(instructionObject);
                }

            }
            output[OutputKey] = OutputobjArr;
        }
    }
    /*
     * function to parse the shortcut string
     */
    function parse_shortcut(shortcut) {
        shortcut = shortcut.trim();
        var shortcutArray = shortcut.split(/[ ,]+/);
        for (index = 0; index < shortcutArray.length; index++) {
            shortcutArray[index] = _REVERSE_MAP[shortcutArray[index]];
        }
        var key = shortcutArray.join('+');
        return key;
    }
    console.log(input, output);
    chrome.storage.local.set(output);
}

function setSnippets(input) {
    for (var key in input) {
        var prefixedSnippet = '@' + key;
        var obj = {};
        obj[prefixedSnippet] = input[key];
        chrome.storage.local.set(obj);
    }
}

function setStorage(filename, type) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            var shortcuts = xhr.responseText;
            setTimeout(function () {
                console.log(shortcuts);
                shortcuts = JSON.parse(shortcuts);
                type(shortcuts);
            }, 100);
        }
    };
    xhr.open("GET", chrome.extension.getURL(filename), true);
    xhr.send();
}

function refreshCurrentActive(event) {
    document.getElementById("abc").innerHTML = "Current Active : " + event.target.id;
    console.log('event', event.target.id);
    var x = $("#abc");
    console.log(x.innerHTML);


    var html = "Current Active : " + event.target.id;
    chrome.storage.local.set({ "@#": html });
}

function refreshCurrentLocale(event) {
    var index = document.getElementById("localelist").selectedIndex;
    var selectedElement = document.getElementById("localelist").options[index].innerHTML;
    console.log(selectedElement, document.getElementById('localelist'), 'abc');
    var html = "Active Locale : " + selectedElement;
    document.getElementById("locale").innerHTML = html;
    chrome.storage.local.set({ "@$": html });
    var fname = "/jsons/" + event.target.id + "/" + selectedElement + "/expander.json";
    console.log(fname);
    setStorage(fname, setSnippets);
    fname = "/jsons/" + event.target.id + "/" + selectedElement + "/shortcuts.json";
    setStorage(fname, setShortcuts);
}					