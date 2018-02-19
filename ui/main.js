console.log('Loaded!');
var element=document.getElementById('main-text');
element.innerHTML='new text';
var img=document.getElementById('madi');
var ml=0;
function moveRight(){
    ml=ml + 5;
    img.style.marginLeft = ml + 'px';
}
img.onclick = function(){
    var interval= setInterval(moveRight,50);
}