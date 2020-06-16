var _MAP = {
    8: "backspace",
    9: "tab",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    20: "capslock",
    27: "esc",
    32: "space",
    33: "pageup",
    34: "pagedown",
    35: "end",
    36: "home",
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    45: "ins",
    46: "del",
    91: "win",
    106: "*",
    107: "+",
    109: "-",
    110: ".",
    111: "/",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
};
var _SHIFT_MAP = {
    "~": "`",
    "!": "1",
    "@": "2",
    "#": "3",
    "$": "4",
    "%": "5",
    "^": "6",
    "&": "7",
    "*": "8",
    "(": "9",
    ")": "0",
    "_": "-",
    "+": "=",
    ":": ";",
    '"': "'",
    "<": ",",
    ">": ".",
    "?": "/",
    "|": "\\",
    "{": "[",
    "}": "]",
};
//addition of function keys to map
for (var i = 1; i < 20; ++i) {
    _MAP[111 + i] = "F" + i;
}
//addition of numkeys to map
for (i = 0; i <= 9; ++i) {
    _MAP[i + 48] = i.toString();
}
for (i = 0; i <= 9; ++i) {
    _MAP[i + 96] = i.toString();
}
// map of character keycode pairs
var _REVERSE_MAP = {
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    numpad0: 96,
    numpad1: 97,
    numpad2: 98,
    numpad3: 99,
    numpad4: 100,
    numpad5: 101,
    numpad6: 102,
    numpad7: 103,
    numpad8: 104,
    numpad9: 105,
    numpadins: 45,
    numpadend: 35,
    numpaddown: 40,
    numpadpgdn: 34,
    numpadleft: 37,
    numpadclear: 12,
    numpadright: 39,
    numpadhome: 36,
    numpadup: 38,
    numpadpgup: 33,
    numpaddel: 46,
    " ": 32,
};

function _getReverseMap() {
    for (var key in _MAP) {
        // pull out the numeric keypad from here cause keypress should
        // be able to detect the keys from the character
        if (key > 95 && key < 112) {
            continue;
        }

        if (_MAP.hasOwnProperty(key)) {
            _REVERSE_MAP[_MAP[key]] = key;
        }
    }
    for (var key in _SHIFT_MAP) {
        _REVERSE_MAP[key] = _REVERSE_MAP[_SHIFT_MAP[key]];
    }
}
//_getReverseMap();
export { _MAP, _SHIFT_MAP, _getReverseMap, _REVERSE_MAP };