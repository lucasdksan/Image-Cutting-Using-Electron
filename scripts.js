// Constantes
const PhotoFile = document.getElementById('photo-file');
const selection = document.getElementById('selection-tool');
const cropButton = document.getElementById('crop-image');
const downloadButton = document.getElementById('download');
// Variáveis
let PhotoPreview = document.getElementById('photo-preview');
let image;
let photoName;
let startX, startY, relativeStartX, relativeStartY,
    endX, endY, relativeEndX,relativeEndY;
let startselection = false;
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

document.getElementById('select-image')
        .onclick = ()=>{
            PhotoFile.click();
        };
//Funcionalidade
window.addEventListener('DOMContentLoaded', ()=>{
    PhotoFile.addEventListener('change', ()=>{
        let file = PhotoFile.files.item(0);
        photoName = file.name;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event)=>{
            image= new Image();
            image.src = event.target.result;
            image.onload = OnloadImage;
        }
    });
});
//Eventos
const events = {
    mouseover(){
        this.style.cursor = 'crosshair'
    },
    mousedown(){
        const { clientX, clientY, offsetX, offsetY } = event;
        startX= clientX;
        startY= clientY;
        relativeStartX= offsetX;
        relativeStartY= offsetY;
        startselection = true;
    },
    mousemove(){
        endX= event.clientX;
        endY= event.clientY;
        if(startselection){
            selection.style.display = 'initial';
            selection.style.top = startY + 'px';
            selection.style.left = startX + 'px';
            selection.style.width = (endX - startX) + 'px';
            selection.style.height = (endY - startY) + 'px';
        }
    },
    mouseup(){
        startselection = false;
        relativeEndX = event.layerX;
        relativeEndY = event.layerY;
        cropButton.style.display='initial';
    }
}
//ObjectKey
Object.keys(events)
    .forEach((eventName)=>{
        PhotoPreview.addEventListener(eventName, events[eventName]);
    });
//OnloadImage
function OnloadImage(){
    const { width, height } = image;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0);
    PhotoPreview.src = canvas.toDataURL();
}
//Corte
cropButton.onclick = ()=>{
    const { width: imgW, height: imgH } = image;
    const { width: previewW, height: previewH } = PhotoPreview;
    const [ widthFactor, heightFactor ] = [
        +(imgW/previewW),
        +(imgH/previewH)
    ];
    const [ selectionWidth, selectionHeight ] = [
        +selection.style.width.replace('px', ''),
        +selection.style.height.replace('px', ''),
    ];
    const [ croppedWidth, croppedHeight ] = [
        +(selectionWidth * widthFactor),
        +(selectionHeight * heightFactor)
    ];
    const [ actualX, actualY ] = [
        +(relativeStartX * widthFactor),
        +(relativeStartY * heightFactor)
    ];
    const croppedImage = ctx.getImageData(actualX, actualY, croppedWidth,croppedHeight);
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    image.width = canvas.width = croppedWidth;
    image.height = canvas.height = croppedHeight;
    ctx.putImageData(croppedImage, 0, 0);
    selection.style.display = 'none';
    PhotoPreview.src = canvas.toDataURL();
    downloadButton.style.display = 'initial';
}
downloadButton.onclick = ()=>{
    const a = document.createElement('a');
    a.download = photoName + '--cropped.png';
    a.href = canvas.toDataURL();
    a.click();
}