// importowanie metod 
import { _setComponent, _showSlider_2, _setDoubleComponent } from '../js/RGB_value_control.js';

// Przyciski w ustawieniach 
const openDialogBtn = document.getElementById("settingsButton");
const closeDialogBtn = document.getElementById("close-dialog-btn");
const dialog = document.getElementById("dialog");
const error_msg = document.getElementById("error_msg");


// Uchwyty do ustawień
const CB_singleRGBcomponent = document.getElementById("single");
const CB_single_R = document.getElementById("CB_single_R");
const CB_single_G = document.getElementById("CB_single_G");
const CB_single_B = document.getElementById("CB_single_B");
const CB_doubleRGBcomponent = document.getElementById("CB_doubleRGBcomponent");
const CB_double_R = document.getElementById("CB_double_R");
const CB_double_G = document.getElementById("CB_double_G");
const CB_double_B = document.getElementById("CB_double_B");


// Ustawienie podstawowych wartości na początku
window.onload = _load();

function _load(){
  CB_singleRGBcomponent.checked = true;
  CB_single_R.checked = true;

  CB_double_R.checked = true;
  CB_double_G.checked = true;

  CB_single_R.disabled = false;
  CB_single_G.disabled = false;
  CB_single_B.disabled = false;

  document.documentElement.style.setProperty('--fontColorSingle', "black");
  document.documentElement.style.setProperty('--fontColorDouble', "#808080");
}

// Załączanie/wyłączanie ustwień z pojedyńczym komponentem RGB
function _enabledSingleRGB(bool){
  if (bool == 1){

    document.documentElement.style.setProperty('--fontColorSingle', "black");

    CB_singleRGBcomponent.checked = true;

    CB_single_R.disabled = false;
    CB_single_G.disabled = false;
    CB_single_B.disabled = false;
  }
  else{

    document.documentElement.style.setProperty('--fontColorSingle', "#808080");

    CB_singleRGBcomponent.checked = false;

    CB_single_R.disabled = true;
    CB_single_G.disabled = true;
    CB_single_B.disabled = true;
  }
}

// Załączanie/wyłączanie ustwień z podwójnym komponentem RGB
function _enabledDoubleRGB(bool){

  if (bool == 1){

    document.documentElement.style.setProperty('--fontColorDouble', "black");

    CB_double_R.disabled = false;
    CB_double_G.disabled = false;
    CB_double_B.disabled = false;
  } 

  else{

    document.documentElement.style.setProperty('--fontColorDouble', "#808080");
    
    CB_doubleRGBcomponent.checked = false;

    CB_double_R.disabled = true;
    CB_double_G.disabled = true;
    CB_double_B.disabled = true;
  }
  
}

// Tworzenie rygla, aby trzy komponenty nie były zaznaczone naraz
CB_double_R.addEventListener("change", function() {
  if(CB_double_G.checked == true){
    if(CB_double_B.checked == true){
      CB_double_R.checked = false;
    }
  }
});

CB_double_G.addEventListener("change", function() {
  if(CB_double_R.checked == true){
    if(CB_double_B.checked == true){
      CB_double_G.checked = false;
    }
  }
});

CB_double_B.addEventListener("change", function() {
  if(CB_double_R.checked == true){
    if(CB_double_G.checked == true){
      CB_double_B.checked = false;
    }
  }
});

// Tworzenie rygla aby tylko jeden komponent mógł być aktywny
CB_single_R.addEventListener("change", function() {
  CB_single_G.checked = false;
  CB_single_B.checked = false;
});

CB_single_G.addEventListener("change", function() {
  CB_single_R.checked = false;
  CB_single_B.checked = false;
});

CB_single_B.addEventListener("change", function() {
  CB_single_R.checked = false;
  CB_single_G.checked = false;
});


// Sterowanie ustawieniami
CB_singleRGBcomponent.addEventListener("change", function() {
  CB_singleRGBcomponent.checked = true;
  _enabledSingleRGB(1);
  _enabledDoubleRGB(0);
});

CB_doubleRGBcomponent.addEventListener("change", function() {
  CB_doubleRGBcomponent.checked = true;
  _enabledSingleRGB(0);
  _enabledDoubleRGB(1);
});

// Otwieranie okna ustwień
openDialogBtn.addEventListener("click", function() {
  dialog.classList.add("open");
});

// Po naciśnięciu SAVA/zamknięciu okna ustwień
closeDialogBtn.addEventListener("click", function() {

  // Sprawdzainie, czy ustawienia są prawidłowe
  if (CB_singleRGBcomponent.checked == true){
    if(CB_single_R.checked == true){
      _closeWindow();
      return;
    }
    if(CB_single_G.checked == true){
      _closeWindow();
      return;
    }
    if(CB_single_B.checked == true){
      _closeWindow();
      return;
    }
    error_msg.style.visibility = "visible";
  }

  if(CB_doubleRGBcomponent.checked == true){
    if(CB_double_R.checked == true && CB_double_G.checked == true){
      _closeWindow();
      return;
    }
    if(CB_double_G.checked == true && CB_double_B.checked == true){
      _closeWindow();
      return;
    }
    if(CB_double_B.checked == true && CB_double_R.checked == true){
      _closeWindow();
      return;
    }
    error_msg.style.visibility = "visible";
  }
});

// Zamykanie okna ustawień
function _closeWindow(){
  // Usuwanie okna dialogowego
  dialog.classList.remove("open");

  // Jeśli ustwienia są na pojedyńczy komponent
  if (CB_singleRGBcomponent.checked == true){

    // Ustawienie slider2 na nie widoczny
    _showSlider_2(false);

    // Ustwienie, aby nie wliczało wartości drugiego suwaka
    _setDoubleComponent(-100);

    //Ustwienie wyglądu i wartości do zmiany obrazka: 

    // RED
    if(CB_single_R.checked == true){
      _setComponent(0);
      document.documentElement.style.setProperty('--sliderColor', "red");
    }

    // GREEN
    if(CB_single_G.checked == true){
      _setComponent(1);
      document.documentElement.style.setProperty('--sliderColor', "green");
    }

    // BLUE
    if(CB_single_B.checked == true){
      _setComponent(2);
      document.documentElement.style.setProperty('--sliderColor', "blue");
    }
  }
  // Jeśli ustwianu jest podwójny komponent
  if (CB_doubleRGBcomponent.checked == true){

    // Wyświetlenie slider 2
    _showSlider_2(true);

    // Ustwienie wartości RGB obrazka do zmiany

    // RED i GREEN
    if(CB_double_R.checked == true && CB_double_G.checked == true){
      _setComponent(0);
      document.documentElement.style.setProperty('--sliderColor', "red");
      _setDoubleComponent(1);
      document.documentElement.style.setProperty('--sliderColor_1', "green");
    }

    // GREEN i BLUE
    if(CB_double_G.checked == true && CB_double_B.checked == true) {
      _setComponent(1);
      document.documentElement.style.setProperty('--sliderColor', "green");
      _setDoubleComponent(2);
      document.documentElement.style.setProperty('--sliderColor_1', "blue");
    }

    // RED i BLUE
    if(CB_double_R.checked == true && CB_double_B.checked == true){
      _setComponent(0);
      document.documentElement.style.setProperty('--sliderColor', "red");
      _setDoubleComponent(2);
      document.documentElement.style.setProperty('--sliderColor_1', "blue");
    }

  }

  error_msg.style.visibility = "false";
}
