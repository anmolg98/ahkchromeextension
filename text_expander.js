var text_buffer=[];
var buffer_virtual_length=0;
var TIME_OUT=3000;
var TIMER;

function keydown(event){
    if(event.cancelable==false) return;
    var charCode=event.which;
    if(TIMER){
        clearTimeout(TIMER);
        TIMER=null;
    }
    if(charCode==32||charCode==13){
      clear_buffer();
    }
    else{
    TIMER=setTimeout(clear_buffer,1500);
    var pressedKey = String.fromCharCode(charCode);

    text_buffer.push(pressedKey);
    buffer_virtual_length++;
    check_shortcuts(text_buffer.join(''),event.target);
    }

}
function keyup(event){
    if(event.cancelable==false) return;
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
    text_buffer.length=0;
    buffer_virtual_length=0;
}
function check_shortcuts(shortcut,box){
  prefixedShortcut='@' + shortcut;
   chrome.storage.local.get(prefixedShortcut,function(data){
       if(data&&Object.keys(data).length){
           expand_text(shortcut,data[prefixedShortcut],box);
       }
   });
}
function expand_text(shortcut,autotext,box){
    var cursorposition=box.selectionStart;
    box.value=[(box.value).slice(0, cursorposition - buffer_virtual_length),
        autotext, (box.value).slice(cursorposition)].join('');
        
        buffer_virtual_length=autotext.length;
}

$(document).on("keypress", keydown);
$(document).on("keyup", keyup);
