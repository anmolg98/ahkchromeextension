var CurrentPressed = [];
var PressedKeysCount = 0;
var PressedKeyTrack= new Map();
var currentInstructions;

function PressKey(keyCode,key,shiftkey,ctrlkey){
         console.log('pressss',key)
        var CurrentEventD= createmyKey('keydown',keyCode,key,shiftkey,ctrlkey);
        var CurrentEventP= createmyKey('keypress',keyCode,key,shiftkey,ctrlkey);
        var CurrentEventU= createmyKey('keyup',keyCode,key,shiftkey,ctrlkey);
       
        //handling tab changes
        if(CurrentEventD.keyCode==9 && CurrentEventD.shiftKey==true){
            console.log('inside this');
            $.focusPrev();
        }
        else if(CurrentEventD.keyCode==9 && CurrentEventD.shiftKey==false){
            console.log('inside this');
            $.focusNext();
        }
        // event handling for text area
        else if(document.activeElement.tagName=='TEXTAREA'||document.activeElement.tagName=='INPUT'){
            var pressedkey=CurrentEventD.key;
            console.log(pressedkey);
            var box=document.activeElement;
           var cursorposition=box.selectionStart;
            document.activeElement.value=[(box.value).slice(0, cursorposition),
               pressedkey, (box.value).slice(cursorposition)].join('');
        }
        
        
        else{
            console.log(CurrentEventD,CurrentEventP,CurrentEventU);
        document.activeElement.dispatchEvent(CurrentEventD);
        document.activeElement.dispatchEvent(CurrentEventP);
        document.activeElement.dispatchEvent(CurrentEventU);
        }

}
function createmyKey(eventtype , keyCode,key,shiftkey,ctrlkey){
    var keyevent = new KeyboardEvent(eventtype,{"bubbles" : true, "keyCode" : keyCode,"ctrlKey":ctrlkey,"key":key,"shiftKey":shiftkey});
    return keyevent;
}
function KeydownHandler(event){
    console.log('keydown',event);
    console.log('keydown',PressedKeysCount,PressedKeyTrack.size);
    var PressedKey= event.which;
    if( ! (PressedKeyTrack.has(PressedKey)) ){
        if(CurrentPressed.length==PressedKeysCount){
        PressedKeyTrack.set(PressedKey,1);
        PressedKeysCount++;
        console.log(PressedKeysCount);
        CurrentPressed.push(PressedKey);
        var CurrentString=CurrentPressed.join("+");
        CheckShortcut(CurrentString,event.target);
        }
    }
   
}
function KeyupHandler(event){
    console.log('keyup');
    var ReleasedKey = event.which;
    PressedKeyTrack.delete(ReleasedKey);
    PressedKeysCount=0;
    CurrentPressed.length=0;

}

function CheckShortcut(shortcut,box){
    console.log('check_shortcut',shortcut);

    chrome.storage.local.get(shortcut,function(data){
        console.log(data,data[shortcut],shortcut);
        if(data[shortcut]){
            //chrome.runtime.sendMessage({'Instruct':data[shortcut]});
            currentInstructions=data[shortcut];
            if(box.nodeName=='TEXTAREA'){
                var chars= calculatechars(shortcut);
                var cursorposition=box.selectionStart;
                document.activeElement.value=[(box.value).slice(0, cursorposition-chars),
                    (box.value).slice(cursorposition)].join('');

            }
            
            ExecuteSet(data[shortcut],0);
            
            
        }
    });
}
function ExecuteSet(Instructions,start){
    var InstructionNumber=start;
    var size = Instructions.length;
    while(InstructionNumber<size){
        var state=0;
       
        for(x in Instructions[InstructionNumber]){
            x=x.toLowerCase();
            if(x=='send'){
                
                nextInstructionNumber=InstructionNumber+1;

                if(nextInstructionNumber<size){
                    var nextInstruction= Instructions[nextInstructionNumber];
                    var nextInstructionKey=Object.keys(nextInstruction);
                    if(nextInstructionKey=='sleep') state=1;
                }
                ExecuteSend(Instructions[InstructionNumber][x],state,InstructionNumber,Instructions);
                if(state==1) break;
            }
            else if(x=='sleep'){
                sleep(Instructions[InstructionNumber][x]);
            }
            else if(x=='click'){
                nextInstructionNumber=InstructionNumber+1;

                if(nextInstructionNumber<size){
                    var nextInstruction= Instructions[nextInstructionNumber];
                    var nextInstructionKey=Object.keys(nextInstruction);
                    if(nextInstructionKey=='sleep') state=1;
                }
                ExecuteClick(Instructions[InstructionNumber][x],state,InstructionNumber,Instructions);
                if(state==1) break;
            }
            else if(x=='select_goalcategory'){
                var choice=Instructions[InstructionNumber][x];
               var dropdownClass= document.getElementsByClassName('goalCategorySelect');
                 console.log('dropdownClass',dropdownClass);
               if(dropdownClass){
                   dropdownElement=dropdownClass[1];
                 console.log('dropdownElement',dropdownElement);
                   if(dropdownElement){
                       var dropdownList =  dropdownElement.options;
                       var index=0;
                       while(index<dropdownList.length && dropdownList[index].value!=choice){
                             console.log('index',index);
                           index++;
                       }
                       if(index<dropdownList.length){
                           dropdownElement.selectedIndex=index;
                           document.getElementsByClassName('chosen-container')[0].children[0].children[0].innerText=choice;
                       }
                   }
               }
            }
            else if(x=='select_discard'){
                var choice=Instructions[InstructionNumber][x];
               var dropdownClass= document.getElementsByClassName('discardOptionsSelect');
               if(dropdownClass){
 
                   dropdownElement=dropdownClass[1];
                   if(dropdownElement){
                       var dropdownList =  dropdownElement.options;
                       var index=0;
                       while(index<dropdownList.length && dropdownList[index].value!=choice){
                            console.log('index',index);

                           index++;
                       }
                       if(index<dropdownList.length){
                           dropdownElement.selectedIndex=index;
                           document.getElementsByClassName('chosen-container')[1].children[0].children[0].innerText=choice;
                       }
                   }
               }
            }
            else if(x=='select_nottrained'){
                var choice=Instructions[InstructionNumber][x];
               var dropdownClass= document.getElementsByClassName('notTrainedOptionsSelect');
               if(dropdownClass){
                   dropdownElement=dropdownClass[1];
                   if(dropdownElement){
                       var dropdownList =  dropdownElement.options;
                       var index=0;
                       while(index<dropdownList.length && dropdownList[index].value!=choice ){
                           index++;
                       }
                       if(index<dropdownList.length){
                           dropdownElement.selectedIndex=index;
                           document.getElementsByClassName('chosen-container')[2].children[0].children[0].innerText=choice;
                       }
                   }
               }
            }
        }
        
        if(state==1) break;
        InstructionNumber++;
    }
}
function ExecuteClick(Coordinates,state,Number,Instructions){
    console.log('Executing Click');
    if(state==1){
        chrome.runtime.sendMessage({'InstructionN':Number,'Instructions':Instructions});
    }
    document.elementFromPoint(Coordinates[0], Coordinates[1]).click();
}
function ExecuteSend(SendSequence,state,Number,Instructions){
    console.log('Executing Send',SendSequence);
    if(state==1){
        chrome.runtime.sendMessage({'InstructionN':Number,'Instructions':Instructions});
    }
    var size = SendSequence.length;
    var i=0;
    while(i<size){
        console.log(i,' ',SendSequence[i]);
        var temp=SendSequence[i].keyCode;
        var tempKey=SendSequence[i].key;
        var shift=SendSequence[i].shift;
        var ctrl=SendSequence[i].ctrl;
        var type=SendSequence[i].type;
        PressKey(temp,tempKey,shift,ctrl,type);
      
 i++;
}
}
$(document).on("keydown", KeydownHandler);
$(document).on("keyup", KeyupHandler);

chrome.runtime.onMessage.addListener(function(response,sender,sendResponse){
      if(response.InstructionN){
          ExecuteSet(response.Instructions,response.InstructionN);
      }
});
function executeInstrcut(){
   var currentText = document.getElementsByClassName('tableRow focused')[0].children[3].innerText;
   chrome.storage.local.get(currentText,function(data){
             if(data[currentText]){
                 if(document.getElementById('domain')){
                  var domain = data[currentText]['domain'];
                   var alldomains = document.getElementById('domain').options;
                    index=0;
                while(index<alldomains.length){
                   if(alldomains[index]==domain) break;
                   index++;
                }
                 if(index<alldomains.length){
                     document.getElementById('domain').selectedIndex = index;
                 }
                 }
                 if(document.getElementById('intent')){

                    var domain = data[currentText]['intent'];
                     var alldomains = document.getElementById('intent').options;
                      index=0;
                  while(index<alldomains.length){
                     if(alldomains[index]==domain) break;
                     index++;
                  }
                   if(index<alldomains.length){
                       document.getElementById('intent').selectedIndex = index;
                   }
                   }

             }

   });
}
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  (function($){
    
	'use strict';

	/**
	 * Focusses the next :focusable element. Elements with tabindex=-1 are focusable, but not tabable.
	 * Does not take into account that the taborder might be different as the :tabbable elements order
	 * (which happens when using tabindexes which are greater than 0).
	 */
	$.focusNext = function(){
		selectNextTabbableOrFocusable(':focusable');
	};

	/**
	 * Focusses the previous :focusable element. Elements with tabindex=-1 are focusable, but not tabable.
	 * Does not take into account that the taborder might be different as the :tabbable elements order
	 * (which happens when using tabindexes which are greater than 0).
	 */
	$.focusPrev = function(){
		selectPrevTabbableOrFocusable(':focusable');
	};

	/**
	 * Focusses the next :tabable element.
	 * Does not take into account that the taborder might be different as the :tabbable elements order
	 * (which happens when using tabindexes which are greater than 0).
	 */
	$.tabNext = function(){
		selectNextTabbableOrFocusable(':tabbable');
	};

	/**
	 * Focusses the previous :tabbable element
	 * Does not take into account that the taborder might be different as the :tabbable elements order
	 * (which happens when using tabindexes which are greater than 0).
	 */
	$.tabPrev = function(){
		selectPrevTabbableOrFocusable(':tabbable');
	};

    function tabIndexToInt(tabIndex){
        var tabIndexInded = parseInt(tabIndex);
        if(isNaN(tabIndexInded)){
            return 0;
        }else{
            return tabIndexInded;
        }
    }

    function getTabIndexList(elements){
        var list = [];
        for(var i=0; i<elements.length; i++){
            list.push(tabIndexToInt(elements.eq(i).attr("tabIndex")));
        }
        return list;
    }

    function selectNextTabbableOrFocusable(selector){
        var selectables = $(selector);
        var current = $(':focus');

        // Find same TabIndex of remainder element
        var currentIndex = selectables.index(current);
        var currentTabIndex = tabIndexToInt(current.attr("tabIndex"));
        for(var i=currentIndex+1; i<selectables.length; i++){
            if(tabIndexToInt(selectables.eq(i).attr("tabIndex")) === currentTabIndex){
                selectables.eq(i).focus();
                return;
            }
        }

        // Check is last TabIndex
        var tabIndexList = getTabIndexList(selectables).sort(function(a, b){return a-b});
        if(currentTabIndex === tabIndexList[tabIndexList.length-1]){
            currentTabIndex = -1;// Starting from 0
        }

        // Find next TabIndex of all element
        var nextTabIndex = tabIndexList.find(function(element){return currentTabIndex<element;});
        for(var i=0; i<selectables.length; i++){
            if(tabIndexToInt(selectables.eq(i).attr("tabIndex")) === nextTabIndex){
                selectables.eq(i).focus();
                return;
            }
        }
    }

	function selectPrevTabbableOrFocusable(selector){
		var selectables = $(selector);
		var current = $(':focus');

		// Find same TabIndex of remainder element
        var currentIndex = selectables.index(current);
        var currentTabIndex = tabIndexToInt(current.attr("tabIndex"));
        for(var i=currentIndex-1; 0<=i; i--){
            if(tabIndexToInt(selectables.eq(i).attr("tabIndex")) === currentTabIndex){
                selectables.eq(i).focus();
                return;
            }
        }

        // Check is last TabIndex
        var tabIndexList = getTabIndexList(selectables).sort(function(a, b){return b-a});
        if(currentTabIndex <= tabIndexList[tabIndexList.length-1]){
            currentTabIndex = tabIndexList[0]+1;// Starting from max
        }

        // Find prev TabIndex of all element
        var prevTabIndex = tabIndexList.find(function(element){return element<currentTabIndex;});
        for(var i=selectables.length-1; 0<=i; i--){
            if(tabIndexToInt(selectables.eq(i).attr("tabIndex")) === prevTabIndex){
                selectables.eq(i).focus();
                return;
            }
        }
	}

	/**
	 * :focusable and :tabbable, both taken from jQuery UI Core
	 */
	$.extend($.expr[ ':' ], {
		data: $.expr.createPseudo ?
			$.expr.createPseudo(function(dataName){
				return function(elem){
					return !!$.data(elem, dataName);
				};
			}) :
			// support: jQuery <1.8
			function(elem, i, match){
				return !!$.data(elem, match[ 3 ]);
			},

		focusable: function(element){
			return focusable(element, !isNaN($.attr(element, 'tabindex')));
		},

		tabbable: function(element){
			var tabIndex = $.attr(element, 'tabindex'),
				isTabIndexNaN = isNaN(tabIndex);
			return ( isTabIndexNaN || tabIndex >= 0 ) && focusable(element, !isTabIndexNaN);
		}
	});

	/**
	 * focussable function, taken from jQuery UI Core
	 * @param element
	 * @returns {*}
	 */
	function focusable(element){
		var map, mapName, img,
			nodeName = element.nodeName.toLowerCase(),
			isTabIndexNotNaN = !isNaN($.attr(element, 'tabindex'));
		if('area' === nodeName){
			map = element.parentNode;
			mapName = map.name;
			if(!element.href || !mapName || map.nodeName.toLowerCase() !== 'map'){
				return false;
			}
			img = $('img[usemap=#' + mapName + ']')[0];
			return !!img && visible(img);
		}
		return ( /^(input|select|textarea|button|object)$/.test(nodeName) ?
			!element.disabled :
			'a' === nodeName ?
				element.href || isTabIndexNotNaN :
				isTabIndexNotNaN) &&
			// the element and all of its ancestors must be visible
			visible(element);

		function visible(element){
			return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function(){
				return $.css(this, 'visibility') === 'hidden';
			}).length;
		}
	}
})(jQuery);

function calculatechars(shortcut){
    shortcut=shortcut.split('+');
    var ans=0;
    for(var index=0;index<shortcut.length;index++){
        if(shortcut[index]>=65&&shortcut[index]<=90){
             ans++;
        }
    }
    return ans;
}
