// This file is used only for the new tab in which a transcript is displayed.

"use strict"


document.download = function() {
    const data = document.querySelector('#main').innerHTML
    const filename = 'transcript.html'
    var file = new Blob([data], {type: 'text/html'});
    var a = document.createElement("a"),
            url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
    }, 0); 
}


