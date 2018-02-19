console.log('Loaded!');
var element=document.getElementById('main-text');
element.innerHTML='new text';
var img=document.getElementById('madi');
var mr=0;
function moveRight(){
    mr=mr + 10;
    img.style.mr = mr + 'px';
}
img.onclick = function(){
    var interval= setInterval(moveRight,50);
}