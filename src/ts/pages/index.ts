/// <reference path="../../../typings/es6-promise/es6-promise" />

window.addEventListener("load", function(){
    document.getElementById("jpgFile").addEventListener('change', (evt)=>{
        var target =<HTMLInputElement>evt.target; // FileList object
        var file = target.files[0];

        var imgDrapPromise = new Promise((resolve)=>{
            var reader = new FileReader();
            reader.addEventListener("load", resolve);
            reader.readAsDataURL(file);
        }).then((loadEvent:ProgressEvent)=>{
            var img = <HTMLImageElement>document.getElementById("imgView");
            var reader = <FileReader>loadEvent.target;
            img.src = reader.result;
        });

    }, false);
});