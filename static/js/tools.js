/* 
  -> Obsługa przycisków dodatkowych:
  ->    - REFRESH PICTURE
  ->    - RELOAD PICTURE
  ->    - BLUR
  ->    - NEGATIVE
  ->    - CTR
  ->    - NOISE
*/

import { getPictureSize } from '../js/RGB_value_control.js';

document.addEventListener('DOMContentLoaded', function() {
  reload();
});

// UCHWYTY
const refresh_button = document.getElementById("refresh");
const reload_button = document.getElementById("reload");
const negat_switch = document.getElementById("CB_neg");
const blur_switch = document.getElementById("CB_blur");
const ctr_switch = document.getElementById("CB_ctr");
const noise_switch = document.getElementById("CB_noise");


const CB_doubleRGBcomponent = document.getElementById("CB_doubleRGBcomponent");

const CB_single_R = document.getElementById("CB_single_R");
const CB_single_G = document.getElementById("CB_single_G");
const CB_single_B = document.getElementById("CB_single_B");

const CB_double_R = document.getElementById("CB_double_R");
const CB_double_G = document.getElementById("CB_double_G");
const CB_double_B = document.getElementById("CB_double_B");

// NEGAT EFFECT //
negat_switch.addEventListener('change', function() {
  sendToServerNegat();
});

export function setNegButton(value){
  if (negat_switch.checked == true){
    sendToServerNegat();
    negat_switch.checked = false;
  }
}

function resetNegativeButton(){
  if (negat_switch.checked == true){
    negat_switch.checked = false;
  }
}

function sendToServerNegat(){
  var signal = "signal";

  $.ajax({
      url: "/negative",
      type: "POST",
      contentType: "aplication/json",
      data: JSON.stringify({ "singnal": signal}),
      success: function(response) {
          // wyświetlanie zmienionego zdjęcia
          var uimg = document.getElementById('Uimg');
          uimg.setAttribute('src', '../static/images/newImage.jpg');
          uimg.src = "../static/images/newImage.jpg?" + new Date().getTime();
          
          console.log("Odpowiedź serwera: " + response);
      },
      error: function(xhr) {
          console.log("Błąd podczas wysyłania żądania: " + xhr.statusText);
      }
  });
}

// RELOAD PICTURE //
reload_button.addEventListener('click', function() {
  // Cofnięcie operacji na zdjęciu/ustawienie przycisku na odpowiedniej pozycji
  resetNegativeButton();
  resetNoiseButton();

  // Pobranie wymiarów obrazu
  var picSize = getPictureSize();

  var width = picSize[0];
  var height = picSize[1];

  console.log("size: " + width + " , " + height);

  // Wysyłanie 
  $.ajax({
    url: "/reload",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ "picWidth": width, "picHeight": height }),
    success: function(response) {
      // wyświetlanie zmienionego zdjęcia
      var uimg = document.getElementById('Uimg');
      uimg.setAttribute('src', '../static/images/newImage.jpg');
      uimg.src = "../static/images/newImage.jpg?" + new Date().getTime();
      
      console.log("Odpowiedź serwera: " + response);
    },
    error: function(xhr) {
      console.log("Błąd podczas wysyłania żądania: " + xhr.statusText);
    }
  });
});

function reload(){
  // Pobranie wymiarów obrazu
  var picSize = getPictureSize();

  var width = picSize[0];
  var height = picSize[1];

  console.log("size: " + width + " , " + height);

  // Wysyłanie 
  $.ajax({
    url: "/reload",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ "picWidth": width, "picHeight": height }),
    success: function(response) {
      // wyświetlanie zmienionego zdjęcia
      var uimg = document.getElementById('Uimg');
      uimg.setAttribute('src', '../static/images/newImage.jpg');
      uimg.src = "../static/images/newImage.jpg?" + new Date().getTime();
      
      console.log("Odpowiedź serwera: " + response);
    },
    error: function(xhr) {
      console.log("Błąd podczas wysyłania żądania: " + xhr.statusText);
    }
  });
}

// CTR EFFECT //  --> Kiedys dokonczyc
ctr_switch.addEventListener('change', function(){
  sendToServerCtr();

  // Cofnięcie animacji toggle switcha po 2 sekundach
  setTimeout(function() {
    ctr_switch.checked = false;
  }, 1000);
});

function sendToServerCtr(){
  
  var signal = "signal";

  $.ajax({
      url: "/ctr",
      type: "POST",
      contentType: "aplication/json",
      data: JSON.stringify({ "singnal": signal}),
      success: function(response) {
          // wyświetlanie zmienionego zdjęcia
          var uimg = document.getElementById('Uimg');
          uimg.setAttribute('src', '../static/images/newImage.jpg');
          uimg.src = "../static/images/newImage.jpg?" + new Date().getTime();
          
          console.log("Odpowiedź serwera: " + response);
      },
      error: function(xhr) {
          console.log("Błąd podczas wysyłania żądania: " + xhr.statusText);
      }
  });
}

function resetCtrButton(){
  if (ctr_switch.checked == true){
    ctr_switch.checked = false;
  }
}

// NOISE //
noise_switch.addEventListener('change', function(){
  sendToServerNoise();

  // Cofnięcie animacji toggle switcha po 2 sekundach
  setTimeout(function() {
    noise_switch.checked = false;
  }, 1000);

});

function sendToServerNoise(){
  var signal = "signal";

  $.ajax({
      url: "/noise",
      type: "POST",
      contentType: "aplication/json",
      data: JSON.stringify({ "singnal": signal}),
      success: function(response) {
          // wyświetlanie zmienionego zdjęcia
          var uimg = document.getElementById('Uimg');
          uimg.setAttribute('src', '../static/images/newImage.jpg');
          uimg.src = "../static/images/newImage.jpg?" + new Date().getTime();
          
          console.log("Odpowiedź serwera: " + response);
      },
      error: function(xhr) {
          console.log("Błąd podczas wysyłania żądania: " + xhr.statusText);
      }
  });
}

function resetNoiseButton(){
  if (noise_switch.checked == true){
    noise_switch.checked = false;
  }
}

// BLUR
blur_switch.addEventListener('change', function(){
  sendToServerBlur();

  // Cofnięcie animacji toggle switcha po 2 sekundach
  setTimeout(function() {
    blur_switch.checked = false;
  }, 1000);
});

function sendToServerBlur(){
  var signal = "signal";

  $.ajax({
      url: "/blur",
      type: "POST",
      contentType: "aplication/json",
      data: JSON.stringify({ "singnal": signal}),
      success: function(response) {
          // wyświetlanie zmienionego zdjęcia
          var uimg = document.getElementById('Uimg');
          uimg.setAttribute('src', '../static/images/newImage.jpg');
          uimg.src = "../static/images/newImage.jpg?" + new Date().getTime();
          
          console.log("Odpowiedź serwera: " + response);
      },
      error: function(xhr) {
          console.log("Błąd podczas wysyłania żądania: " + xhr.statusText);
      }
  });
}

function resetBlurButton(){
  if (blur_switch.checked == true){
    blur_switch.checked = false;
  }
}

// REFRESH PICTURE 
refresh_button.addEventListener('click', function(){

  /*
    -> odświeżamy obrazek:
    -> resetujemy wszystkie dodatki
    -> nakładamy na obrazek jedynie filtry RGB
  */

  const slider_2 = document.getElementById('slider_2');

  // Zbieranie danych
  var slider_1_value = document.getElementById('slider_1').value;
  var slider_2_value = -100;
  var slider_1_color = "RED";
  var slider_2_color = "RED";

  if(slider_2.style.visibility == "visible"){
    slider_2_value = document.getElementById('slider_2').value;
  }

  var quality_value = document.getElementById('slider_3').value;

  // Resetowanie przycisków
  resetNoiseButton();
  resetBlurButton();
  resetCtrButton();
  resetNegativeButton();

  console.log("...checking value: " + slider_1_value + " , " + slider_2_value + " , " + quality_value);

  var tab = checkColors();
  var singleColor = tab[0];
  var doubleColor = tab[1];

  // Wysyłanie danych na serwer
  sendToServerRefresh(slider_1_value, singleColor,  slider_2_value, doubleColor, quality_value);

});

function checkColors(){

  var firstComponent = "RED";
  var secondComponent = "NONE";

  if (CB_doubleRGBcomponent.checked == true){
    if(CB_double_R.checked == true){

      if(CB_double_R.checked == true && CB_double_G.checked == true){
        firstComponent = "RED";
        secondComponent = "GREEN";
      }
      else if(CB_double_G.checked == true && CB_double_B.checked == true) {
        firstComponent = "GREEN";
        secondComponent = "BLUE";
      }
      else if(CB_double_R.checked == true && CB_double_B.checked == true){
        firstComponent = "RED";
        secondComponent = "BLUE";
      }
    }
  } else{
    secondComponent = "NONE";

    if(CB_single_R.checked == true){
      firstComponent = "RED";
    }
    else if(CB_single_G.checked == true){
      firstComponent = "GREEN";
    }
    else if(CB_single_B.checked == true){
      firstComponent = "BLUE";
    }

  }

  var tab = [firstComponent, secondComponent]
  return tab;
}

function sendToServerRefresh(slider_1_value, singleColor,  slider_2_value, doubleColor, quality_value){
  
  // Wywołanie AJAX z użyciem jQuery
  $.ajax({
    url: "/refresh-button",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ "slider_1_value": slider_1_value, 
    "slider_2_value": slider_2_value,
    "quality_value": quality_value,
    "singleColor": singleColor,
    "doubleColor": doubleColor }),
    success: function(response) {
      // wyświetlanie zmienionego zdjęcia
      var uimg = document.getElementById('Uimg');
      uimg.setAttribute('src', '../static/images/newImage.jpg');
      uimg.src = "../static/images/newImage.jpg?" + new Date().getTime();
      
      console.log("Odpowiedź serwera: " + response);
    },
    error: function(xhr) {
      console.log("Błąd podczas wysyłania żądania: " + xhr.statusText);
    }
  });
}