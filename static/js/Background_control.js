/*
  -> ta klasa zawiera metody do dostosowywania...
  -> ... wymiarów obrazka tła.
*/

// zmienne globalne
var oldWidth;

// uchwyt do stylesheet
const stylesheet = document.getElementById("BGstylesheet");

window.onload = main();
// window.onresize = _adjustBG();
window.addEventListener('resize', _adjustBG);

// dostosowanie wielkości obrazka tła
function main(){

  // uchwyt do obrazka
  var backgroundImage = document.getElementById("BGimg");

  // POBIERANIE MAKSYMALNYCH ROZMIARÓW OKNA - rozmiarów monitora
  var windowWidth = screen.width;
  var windowHeight = screen.height; 

  // POBIERANIE AKTUALNYCH ROZMIARÓW OKNA
  var actualWindowWidth = window.outerWidth;
  var actualWindowHeight = window.outerHeight;

  // zapisanie zmiennej globalnej
  oldWidth = actualWindowWidth;

  // POBIERANIE ROZMIARÓW OBRAZKA TŁA
  var imgWidth = document.getElementById("BGimg").width;
  var imgHeight = document.getElementById("BGimg").height;

  // ZMIENNE
  var height;   // wyliczeno prawidłowa wysokość obrazka, przy zachowaniu proporcji
  var width;    // prawidłowa szerokość okna

  // Sprawdzenie czy szerokość okna jest większa od szerokości monitora (np. 2 monitory)
  if (actualWindowWidth > windowWidth){
    // -> jesli szerokość okna jest większa od szerokości monitora

    // WYLICZANIE NAJLEPSZYCH ROZMIARÓW DLA OBRAZKA TŁA
    var vx = (4552 * actualWindowWidth) / 6400;
    var perfectHeight = (vx - actualWindowHeight) * -1;

    // ZAPISANIE DANYCH
    height = perfectHeight;
    width = actualWindowWidth;
  } else {
    // -> jesli szerokość okna jest mniejsza od szerokości monitora

    // WYLICZANIE NAJLEPSZYCH ROZMIARÓW DLA OBRAZKA TŁA
    var vx = (4552 * windowWidth) / 6400;
    var perfectHeight = (vx - windowHeight) * -1;

    // ZAPISANIE DANYCH
    height = perfectHeight;
    width = windowWidth;
  }

  // USTAWIANIE WIELKOŚCI OBRAZJA / MODYFIKACJA CSS 
  document.documentElement.style.setProperty('--maxHeight', height + "px");
  document.documentElement.style.setProperty('--maxWidth', width + "px");

  document.documentElement.style.setProperty('--imgFrameHeight', height + "px");
  document.documentElement.style.setProperty('--imgFrameWidth', width + "px");

  backgroundImage.classList.remove();
  backgroundImage.classList.toggle("img_1");

}

// funkcja do obsługi zdrzania "resize"
function _adjustBG(){
  
  /*
    -> Sprawdzenie czy wymagana jest zmiana...
    -> ... w pliku CSS.
    
    -> HTML ma problem z nanoszeniem zmian...
    -> ... w CSS, więc lepiej nanosić ich...
    -> ... jak najmniej.
  */
  // POBIERANIE MAKSYMALNYCH ROZMIARÓW OKNA - rozmiarów monitora
  var windowWidth = screen.width;

  // POBIERANIE AKTUALNYCH ROZMIARÓW OKNA
  var actualWindowWidth = window.outerWidth;

  if(oldWidth > windowWidth){
    main();
  }

  if(actualWindowWidth > windowWidth){
    main();
  }

  if (oldWidth > windowWidth){
    if(actualWindowWidth <= oldWidth){
      document.getElementById("BGimg").classList.remove();
      document.getElementById("BGimg").classList.toggle("img_2");
    }
  }
  
};





























/*
window.onresize = function() {
  // inicjalizacja
  var _BACKGROUND = document.getElementById("BGimg");
  var bool = false;

  // POBIERANIE ROZMIARÓW OKNA
  var width = window.outerWidth;
  var height = window.outerHeight;

    // POBIERANIE ROZMIARÓW OBRAZKA TŁA
    var imgWidth = document.getElementById("BGimg").width;
    var imgHeight = document.getElementById("BGimg").height;

    // ZMIANA STYLÓW W ZALEŻNOŚĆI OD PROPORCJI WIELKOŚCI OKNA
    var vx = (4552 * width) / 6400;
    var perfectHeight = (vx - height) * -1;

   // console.log("PerfectHeight:" + perfectHeight);
    if (perfectHeight >= 0){
        var x = height;
        document.documentElement.style.setProperty('--imgFrameHeight', x + "px");

        _BACKGROUND.classList.remove();
        _BACKGROUND.classList.toggle("img_2");
        bool = false;
     //   location.reload();
    } else{
        var x = (4552 * width) / 6400;
        document.documentElement.style.setProperty('--imgFrameHeight', x + "px");

        _BACKGROUND.classList.remove();
        _BACKGROUND.classList.toggle("img_1");
        bool = true;
      //  location.reload();
    }

    if (bool == true){
    // USTAWIENIE WIELKOSCI OBRAZKA
    document.documentElement.style.setProperty('--imgFrameWidth', width + "px");
    // POBIERANIE ROZMIARÓW OKNA
    width = window.outerWidth;
    height = window.outerHeight;
    // POBIERANIE ROZMIARÓW OBRAZKA TŁA
    imgWidth = document.getElementById("BGimg").width;
    imgHeight = document.getElementById("BGimg").height;
    // OBLICZANIE MAKSYMALNY WYCHYŁ OBRAZKA I USTAWIANIE WYCHUŁU CSSJS
    perfectHeight = (imgHeight - height) * -1;


    if (perfectHeight >= 0){
   //     imgFrame.classList.toggle("img_2");
        perfectHeight *= -1;
    }
   // else{
    document.documentElement.style.setProperty('--maxHeight', perfectHeight + "px");
   // }

    var distance = getComputedStyle(document.documentElement).getPropertyValue('--maxHeight');
    }

    _BACKGROUND.style.imageRendering();

    console.log("K");
  };
  */
