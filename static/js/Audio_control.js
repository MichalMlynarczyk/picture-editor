const button = document.getElementById("musicButton");

const audio = new Audio('../static/m1.mp3');

function _turnTheMusic(){
    if(button.innerHTML=="pause"){
        button.innerHTML="play_arrow";
        audio.pause();
    }
    else{
        button.innerHTML="pause";
        audio.play();
    }
}
