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
        
        var start = 0;
        var end = file.size;
        var blob = file.slice(start, end);
        var reader = new FileReader();
        
        reader.onloadend = function(evt) {
            var reader = <FileReader>evt.target;
            
            if (reader.readyState == reader.DONE) { // DONE == 2
                var dataView = new DataView(reader.result);
                
                var info = mainLoad(dataView);
                
                console.log(info);
            }
        };
        reader.readAsArrayBuffer(blob);

    }, false);
});

enum JpegMark {
    SOI = 0xffd8,
    APP0 = 0xffe0,
    APP1 = 0xffe1,
    APP2 = 0xffe2,
    APP3 = 0xffe3,
    APP4 = 0xffe4,
    APP5 = 0xffe5,
    APP6 = 0xffe6,
    APP7 = 0xffe7,
    APP8 = 0xffe8,
    APP9 = 0xffe9,
    APP10 = 0xffea,
    APP11 = 0xffeb,
    APP12 = 0xffec,
    APP13 = 0xffed,
    APP14 = 0xffee,
    APP15 = 0xffef,
}

function mainLoad(dataView:DataView) {
    var infos:any = [];
    var offset = 0;

    var c=3
    while (c>0) {    
    // while (offset < dataView.byteLength) {
        var marker = getMarker(dataView, offset);
        var info:any = {};

        info["title"] = getMarkerTitle(marker);
        info["marker"] = marker;
        
        infos.push(info);
        --c;
    }
    return infos;
}

function getMarker(dataView:DataView, offset:number) {
    var byte = dataView.getUint8(offset);
    if (byte != 0xff) {
        return null;
    }
    var marker = <JpegMark>dataView.getUint16(offset);
    return marker;
}

function getMarkerTitle(marker:number) {
    if (!JpegMark[marker]) {
        return "unknown";
    }
    return JpegMark[marker];
}
