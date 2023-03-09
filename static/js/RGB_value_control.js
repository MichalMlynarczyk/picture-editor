//const _adjustImage = require('../Picture_control.js');
/*
 -> klasa zawiera jedynie metody do zmiany wartości RGB,
*/
import { setNegButton } from '../js/tools.js';

// uchwyty do elementów //
const _slider1=document.getElementById('slider_1');
const _slider2=document.getElementById('slider_2');
const _slider3=document.getElementById('slider_3');

const negat_button = document.getElementById("CB_neg");
// zmienne globalne
var userImageData;   // informacjae obrazka "imageData"
var globalCanvas;    // canvas
var globalCtx;       // constext
var newWidth;        // minimalna jakość obrazka
var newHeight;       // minimalna jakość obrazka

var component = 0;   // napoczątku ustawiony jest na czerwony 
var doubleComponent = -100;

export function _showSlider_2(bool){

  if (bool == true){
    _slider2.style.visibility = "visible";
    _slider2.disabled = false;
  } else {
    _slider2.style.visibility = "hidden";
    _slider2.disabled = true; 
  }
}

_slider3.addEventListener("input", function() {

  // Pobranie wartości slidera_3
  var qualityFactor = document.getElementById("slider_3").value;
  qualityFactor = parseInt(qualityFactor)

  // Wywołanie AJAX z użyciem jQuery
  $.ajax({
    url: "/quality-factor",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ "qualityFactor": qualityFactor }),
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

_slider1.addEventListener("input", function() {  
  _prepareData();
});

_slider2.addEventListener("input", function() {  
  _prepareData();
});

function _prepareData(){

    var val = true;
    setNegButton(val);
    // Pobieranie wartości z suwaka 1
    var value = document.getElementById("slider_1").value;
    let singleValue = parseInt(value);

    // Pobieranie wartości z suwaka 2
    var value_2 = 1000;
    if (doubleComponent != -100){
      value_2 = document.getElementById("slider_2").value;
    }
    let doubleValue = parseInt(value_2);

    // Zmienne do kolorów suwaków
    var singleColor;
    var doubleColor;

    // Wyznaczanie koloru jaki ma być na sliderze 1
    if (component == 0){ singleColor = "RED"; }
    else if (component == 1){ singleColor = "GREEN";} 
    else { singleColor = "BLUE"; }

    // Wyznaczanie koloru jaki ma być na sliderze 2
    if (doubleComponent == 0){ doubleColor = "RED"; }
    else if (doubleComponent == 1){ doubleColor = "GREEN";} 
    else if (doubleComponent == 2){ doubleColor = "BLUE"; }
    else { doubleColor = "NONE"; } // Czyli slider jest wyłączony

    // Metoda do wysyłania zmiennych na serwer
    sendIntToServer(singleValue, singleColor, doubleValue, doubleColor);
}

export function getPictureSize(){
  
  var tablica = [parseInt(newWidth), parseInt(newHeight)];

  return tablica;
}

function sendIntToServer(singleValue, singleColor, doubleValue, doubleColor) {
  // Wywołanie AJAX z użyciem jQuery
  $.ajax({
    url: "/my-endpoint",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ "singleValue": singleValue, "singleColor": singleColor
                         , "doubleValue": doubleValue, "doubleColor": doubleColor
                         , "width": newWidth, "height": newHeight}),
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

export function _setDimension(dm1, dm2){
  newWidth = dm1;
  newHeight = dm2;
}

export function _setComponent(value){
  component = value;
}

export function _setDoubleComponent(value){
  doubleComponent = value;
}

// przygotowywanie obrazka //
function _preparePhoto(){

    // Set the source of the image
    var image = new Image();
    image.src = '../static/images/UserImage.jpg';
    
    // Create a canvas element
    var canvas = document.createElement('canvas');
    
    // Set the canvas dimension to the image dimensions
    //canvas.width = 700;
    //canvas.height = 393;
    canvas.width = newWidth;
    canvas.height = newHeight;

    // zapisanie do zmiennej globalnej "CANVAS"
    globalCanvas = canvas;
    
    // Get the canvas context
    var ctx = canvas.getContext('2d');
    
    // Draw the image on the canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // zapisanie do zmiennej globalnej "CONTEXR"
    globalCtx = ctx;
    
    // Get the image data from the canvas
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // zwrot danych
    return imageData;
}

// wysyłanie zdjęcia na serwer, zapisywanie go, wyświetlanie użytkownikowi nowego zdjęcia //
function _savePhoto(imageData){
    var ctx = globalCtx;
    var canvas = globalCanvas;

    ctx.putImageData(imageData, 0, 0);

    // Wysyłanie zdjęcia na serwer
    canvas.toBlob(function(blob) {
      var formData = new FormData();
      formData.append('image', blob, 'new_image.jpg');
      fetch('/upload-image', {
        method: 'POST',
        body: formData
      }).then(function(response) {
        console.log('Image uploaded successfully');

        // wyświetlanie zmienionego zdjęcia
        var uimg = document.getElementById('Uimg');
        uimg.setAttribute('src', '../static/images/newImage.jpg');
        uimg.src = "../static/images/newImage.jpg?" + new Date().getTime();
      }).catch(function(error) {
        console.error('Error uploading image', error);
      });
    });
}

