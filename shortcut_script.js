console.log('running1');

chrome.runtime.onMessage.addListener(function(response,sender,sendResponse){
        var temp=response.InstructionN+1;
        setTimeout(function(){
            chrome.tabs.query({active: true, currentWindow : true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id,{'InstructionN':(temp+1),'Instructions':response.Instructions});
                  console.log('sent',response.Instructions[temp]['sleep']);
            });
        },response.Instructions[temp]['sleep']);
    
});


  