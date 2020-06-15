console.log('textExpander running');
//chrome.storage.sync.set(obj);
var text_buffer=[];
var buffer_virtual_length=0;
var TIME_OUT=3000;
var TIMER;

function keydown(event){
    //console.log('key-down');
   
    var charCode=event.which;
    if(TIMER){
        clearTimeout(TIMER);
        TIMER=null;
    }
    

    
    if(charCode==32||charCode==13){
      clear_buffer();
    }
    else{
    TIMER=setTimeout(clear_buffer,3000);
    var pressedKey = String.fromCharCode(charCode);

    text_buffer.push(pressedKey);
    buffer_virtual_length++;
    
    //console.log(pressedKey);
    //chrome.storage.sync.get('');
    check_shortcuts(text_buffer.join(''),event.target);
    }

}
function keyup(event){
    console.log('keyup');
    var charCode = event.which;
    if(charCode==8){
        if(TIMER){
            clearTimeout(TIMER);
            TIMER=null;
        }
        text_buffer.pop();
        
        TIMER=setTimeout(clear_buffer,3000);
    }
}


function clear_buffer(){
    //console.log('clearBuffer');
    text_buffer.length=0;
    buffer_virtual_length=0;
}
function check_shortcuts(shortcut,box){
    //console.log('check_shortcut ');
    Prefixedshortcut=shortcut;
   chrome.storage.local.get(Prefixedshortcut,function(data){
       console.log('fetching-value',shortcut);
       if(data&&Object.keys(data).length){
           console.log('inside expand text');
           expand_text(shortcut,data[Prefixedshortcut],box);
       }
   });
}
function expand_text(shortcut,autotext,box){
    console.log('expand-text');
    var cursorposition=box.selectionStart;
    
    console.log(buffer_virtual_length,shortcut.length,'abc')
    box.value=[(box.value).slice(0, cursorposition - buffer_virtual_length),
        autotext, (box.value).slice(cursorposition)].join('');
        buffer_virtual_length=autotext.length;
}

$(document).on("keypress", keydown);
$(document).on("keyup", keyup);
