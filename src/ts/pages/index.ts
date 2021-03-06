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
        var length = getChunkLength(dataView, offset);
        var info:any = {};

        info["title"] = getMarkerTitle(marker);
        info["marker"] = marker;
        info["length"] = length;
        switch (marker) {
            case JpegMark.APP0:
                var values:any = {};
                values["identifire"] = convertBytesToString(getBytes(5, dataView, offset+2+2));
                info["values"] = values;
                offset+=2+length;
                break;
            default:
                offset+=2+length;
                break;
        }
        
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

function getChunkLength(dataView:DataView, offset:number) {
    var marker = getMarker(dataView, offset);
    if (!marker) {
        return 0;
    }
    if (isNoLengthMarker(marker)) {
        return 0;
    }
    var length = dataView.getUint16(offset+2);
    return length;
}

function isNoLengthMarker(marker:JpegMark) {
    var noLengtMarkers = [
        JpegMark.SOI,
    ];
    var matchMarkers = noLengtMarkers.filter((mark)=>{
        if (mark != marker) {
            return false;
        }
        return true;
    });
    return matchMarkers.length > 0 ? true: false;
}

function getBytes (length:number, dataView:DataView, offset:number ) {
    var bytes:number[] = [];
    for (var index = 0; index < length; index++) {
        var element = dataView.getUint8(offset+index);
        bytes.push(element);
    }
    return bytes;
}

function convertBytesToString(bytes:number[]) {
    var chars = bytes.map((value)=>{
        return String.fromCharCode(value);
    });
    return chars.join("");
}
