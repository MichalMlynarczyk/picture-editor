import { _setDimension } from '../js/RGB_value_control.js';

window.onload = _adjustImage(); 

window.onresize = function(event) {
  _adjustImage();
}

// Dostosowywanie wymiarów obrazka użytkownika do wymiarów okna w przeglądarce
function _adjustImage(){

  var image = new Image();
  image.src = "../static/images/UserImage.jpg";

  var pictureSectionWidth = document.getElementById("pictureSection").clientWidth;
  var pictureSectionHeight = document.getElementById("pictureSection").clientHeight;

  var sliderSectionWidth = document.getElementById("sliderSection").clientWidth;
  var sliderSectionHeight = document.getElementById("sliderSection").clientHeight;

  var imageWidth = image.width;
  var imageHeight = image.height;

  var condition = true;
  var sectionWidth = pictureSectionWidth-sliderSectionWidth-20;

  while(condition){
    var newHeight = imageHeight * sectionWidth / imageWidth;

    if( newHeight > (pictureSectionHeight) ){
        sectionWidth -= 1;
    }else{
        condition = false;
        break;
    }
  }

  document.documentElement.style.setProperty('--userImageWidth', sectionWidth + "px");
  document.documentElement.style.setProperty('--userImageHeight', newHeight + "px");

  // wyliczanie najlepszego marginesu
  var bestMargin = pictureSectionHeight - newHeight;

  if (bestMargin > 0){
    bestMargin = bestMargin/2;
  }

  var bestMarginLeft = pictureSectionWidth - sliderSectionWidth - sectionWidth;

  console.log("userImageMarginLeft: " + bestMarginLeft + " , " + pictureSectionWidth + " , " + sectionWidth);

  if (bestMarginLeft > 0){
    bestMarginLeft = bestMarginLeft/2;
  }

  console.log("userImageMarginLeft: " + bestMarginLeft)

  document.documentElement.style.setProperty('--userImageMarginTop', bestMargin + "px");
  document.documentElement.style.setProperty('--userImageMarginLeft', bestMarginLeft + "px");

  // Przekazywanie wymiarów obrazka
  _setDimension(sectionWidth, newHeight);
}


