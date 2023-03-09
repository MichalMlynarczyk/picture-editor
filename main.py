from flask import Flask, render_template, request, jsonify, redirect, url_for
from PIL import Image
import base64
import numpy as np
import cv2
from numba import jit, set_num_threads, prange, cuda

app = Flask (__name__)

# Wartości pierwszego slidera
firstValue = 0; 
firstComponent = "RED";

# Wartości drugiego slidera
secondValue = 0;
secondComponent = "RED";

# Wymiary obrazu
picWidth = 100;
picHeight = 100;

# Czy aktywny drugi slider
aktive = False

# Współczynnik jakości wyświetanego obrazu
QUALITY_FACTOR = 1


# Wyświetlanie głównej strony
@app.route("/")
def home():
    return render_template("mainWindow.html")

# Odświeżanie obrazka
@app.route("/refresh-button", methods=["POST"])
def refresh():
    # Odbieranie danych
    slider_1_value = request.json['slider_1_value']
    slider_2_value = request.json['slider_1_value']
    singleColor = request.json['singleColor']
    doubleColor = request.json['doubleColor']

    global QUALITY_FACTOR
   
    # Wyliczanie rozmiarów obrazu
    width = int(picWidth) * int(QUALITY_FACTOR)
    height = int(picHeight) * int(QUALITY_FACTOR)

    # Zmiana wymiarów obrazka
    _resizeUserPicture(int(width), int(height));

    # Konwertowanie zmiennych na typy danych
    firstValue = int(slider_1_value)
    firstComponent = str(singleColor)
    secondValue = int(slider_2_value)
    secondComponent = str(doubleColor)

    # Odpowiednie przetwarzanie obrazka w zależności od parametrów
    img =  Image.open('static/images/newImage.jpg')
    img = img.convert('RGB')
    pixels = img.load()
    
    # Wybór odpowiedniej akcji
    if (secondComponent == "NONE"):
        if (firstComponent == "RED"): 
            _singleValue_R(img, int(width), int(height), pixels)
        elif (firstComponent == "GREEN"):
            _singleValue_G(img, int(width), int(height), pixels)
        elif (firstComponent == "BLUE"):
            _singleValue_B(img, int(width), int(height), pixels)
    else:
        if (firstComponent == "RED" and secondComponent == "GREEN"):
            _doubleValue_RG(img, int(width), int(height), pixels)
        elif (firstComponent == "RED" and secondComponent == "BLUE"):
            _doubleValue_RB(img, int(width), int(height), pixels)
        elif (firstComponent == "GREEN" and secondComponent == "BLUE"):
            _doubleValue_GB(img, int(width), int(height), pixels)
    
    # Zwracanie wiadomości
    return "Dane odebrane poprawnie"

# Tworzenie szumów
@app.route("/noise", methods=["POST"])
def noise():
    mean = 0
    sigma = 30 # wartość szumów dodawanych do obrazka
    img = cv2.imread('static/images/newImage.jpg')

    # Tworzenie maski obrazu z szumem
    noise = np.random.normal(mean, sigma, img.shape)

    # Dodawanie szumów do obrazka
    noisy_image = img + noise

    # Clip the pixel values to the valid range of [0, 255].
    noisy_image = np.clip(noisy_image, 0, 255).astype(np.uint8)

    # Zapis obrazka
    cv2.imwrite('static/images/newImage.jpg', noisy_image)

    # Wysyłanie wiadomości zwrotnej
    return "Dane odebrane poprawnie"
    
# Tworzenie blura
@app.route("/blur", methods=["POST"])
def blur():
    # Wczytanie obrazu
    img = cv2.imread('static/images/newImage.jpg')

    # Zastosowanie rozmycia Gaussa z jądrem 5x5 i odchyleniem standardowym 0
    blur = cv2.GaussianBlur(img, (5, 5), 0)

    # Zapis obrazka
    cv2.imwrite('static/images/newImage.jpg', blur)

    # Wysyłanie wiadomośći zwrotnej
    return "Dane odebrane poprawnie"

# Tworzenie crt zdjęcia
@app.route("/ctr", methods=["POST"])
def ctr():
    # Wczytywanie obrazu
    img = cv2.imread('static/images/newImage.jpg')

    # Dodanie linii poziomych do obrazu
    scanline = np.zeros_like(img)
    scanline[1::9] =[3, 3, 252]
    scanline[3::9] =[3, 3, 252]
    scanline[5::9] =[3, 3, 252]

    img = cv2.max(img, scanline)

    # Add Dodawanie szumów
    noise = np.random.randint(-30, 30, img.shape)
    img = cv2.add(img, noise, dtype=cv2.CV_8U)

    # Wyliczanie wymiarów obrazu
    width = picWidth * QUALITY_FACTOR
    height = picHeight * QUALITY_FACTOR

    # Tworzenie tablicy wielkości obrazka
    barrel = np.zeros_like(img)

    # Wywoływanie funkcji wykonującej potrzebne obliczenia na GPU
    barrel = fun(barrel, height, width, img)

    # Add glow effect
    blur = cv2.GaussianBlur(barrel, (0, 0), 10)
    img = cv2.addWeighted(img, 1.5, blur, -0.5, 0)
 
    # Zapis obrazka
    cv2.imwrite('static/images/newImage.jpg', img)

    # Wysyłanie wiadomości zwrotnej
    return "Dane odebrane poprawnie"

# Funkcja wykonująca obliczenia na GPU
@jit(nopython=True, parallel=True)
def fun(barrel, height, width, img):
    for y in prange(height):
        for x in prange(width):
            u = (2*x - width)/width
            v = (2*y - height)/height
            r = np.sqrt(u*u + v*v)
            theta = np.arctan2(v, u)
            r2 = r*r + 0.2*r
            x2 = int((r2*np.cos(theta) + 1)*width/2)
            y2 = int((r2*np.sin(theta) + 1)*height/2)
            if 0 <= x2 < width and 0 <= y2 < height:
                barrel[y,x] = img[y2,x2]
    return barrel

# Otrzymywanie danych o obrazie jaki ma powstać i zmiana obrazu
@app.route("/my-endpoint", methods=["POST"])
def getData():
    # Pobieranie danych od użytkownika

    # Pobranie wartości single
    singleValue = request.json['singleValue']
    singleColor = request.json['singleColor']

    # Pobieranie wartości double
    doubleValue = request.json['doubleValue']
    doubleColor = request.json['doubleColor']

    # Pobnieranie wymiarów obrazu
    width = request.json['width']
    height = request.json['height']

    # Zmienne globalne
    global firstValue  
    global firstComponent
    global secondValue
    global secondComponent
    global picWidth
    global picHeight

    # Wymiary obrazu
    width = int(width)
    height = int (height)

    # Zapis wymiarów obrazka
    picWidth = width
    picHeight = height

    # Zwiększenie rozdzielczości testowe
    width = width * QUALITY_FACTOR
    height = height * QUALITY_FACTOR

    # Zapis ustwień pierwszego slidera
    firstComponent = singleColor
    firstValue = singleValue

    # Zapis ustwień drugiego slidera
    secondComponent = doubleColor
    secondValue = doubleValue

    # Zmiana wymiarów obrazu do odpowiednich
    _resizeUserPicture(int(width), int(height))

    # Zmiana komponentów RGB
    img =  Image.open('static/images/newImage.jpg')
    img = img.convert('RGB')
    pixels = img.load()
    
    # Wybór odpowiedniej akcji
    if (secondComponent == "NONE"):
        if (firstComponent == "RED"): 
            _singleValue_R(img, int(width), int(height), pixels)
        elif (firstComponent == "GREEN"):
            _singleValue_G(img, int(width), int(height), pixels)
        elif (firstComponent == "BLUE"):
            _singleValue_B(img, int(width), int(height), pixels)
    else:
        if (firstComponent == "RED" and secondComponent == "GREEN"):
            _doubleValue_RG(img, int(width), int(height), pixels)
        elif (firstComponent == "RED" and secondComponent == "BLUE"):
            _doubleValue_RB(img, int(width), int(height), pixels)
        elif (firstComponent == "GREEN" and secondComponent == "BLUE"):
            _doubleValue_GB(img, int(width), int(height), pixels)

    # Wiadomość zwrotna
    return "Dane odebrane poprawnie"

# Tworzenie negatywu zdjęcia
@app.route("/negative", methods=["POST"])
def negative():

    # Wczytanie obrazu
    img =  Image.open('static/images/newImage.jpg')

    # Odwrócenie kolorów obrazu
    negatyw = Image.eval(img, lambda x: 255 - x)

    # Zapis obrazu
    negatyw.save('static/images/newImage.jpg')

    # Wiadomość zwrotna
    return "Dane odebrane poprawnie"

# Reload picture
@app.route("/reload", methods=["POST"])
def reloadPicture():

    # Wczytynie wartości globalnych
    global picWidth
    global picHeight

    # Pobranie wartości od użytkownika
    picWidth = request.json['picWidth']
    picHeight = request.json['picHeight']

    # Wyliczenie prawidłowych wymiarów obrazu
    pic_width = picWidth * QUALITY_FACTOR
    pic_height = picHeight * QUALITY_FACTOR

    # Zmiana wymiarów obrazu
    _resizeUserPicture(pic_width, pic_height)

    # Wiadomość zwrotna
    return "Dane odebrane poprawnie"

# Zmiana jakości obrazka
@app.route("/quality-factor", methods=["POST"])
def setQualityFactor():

    # Pobieranie wartości qualityFactor
    qualityFactor = request.json['qualityFactor']

    # Zamiana na inta
    qualityFactor = int(qualityFactor)

    # Zapisanie zmiennej globalnej
    global QUALITY_FACTOR
    QUALITY_FACTOR = qualityFactor

    # Wyliczanie rozmiarów obrazu
    newWidth = picWidth * qualityFactor
    newHeight = picHeight * qualityFactor

    # Zmiana rozdzielczości
    _resizeNowPicture(newWidth, newHeight)

    # Wiadomość zwrotna
    return "Dane odebrane poprawnie"

# Zmiana wymiarów obrazu
def _resizeUserPicture(width, height):

    # Wczytanie obrazu
    img =  Image.open('static/images/UserImage.jpg')

    # nowe wymiary obrazu
    new_size = (width, height) 
    
    # zmiana wymiarów
    resized_img = img.resize(new_size)

    # zapisanie zmienionego obrazu do pliku
    resized_img.save('static/images/newImage.jpg')

# Zmiana wymiarów obrazu odrazu 
def _resizeNowPicture(width, height):

    # Wczytanie obrazu
    img =  Image.open('static/images/newImage.jpg')

    # nowe wymiary obrazu
    new_size = (width, height)

    # Zmiana wymiarów obrazu
    resized_img = img.resize(new_size)

    # zapisanie zmienionego obrazu do pliku
    resized_img.save('static/images/newImage.jpg')

# Zmiana komponentu R
def _singleValue_R(image, width, height, pixels):

    # Pętla po obrazie
    for x in range(width):
        for y in range(height):
            r,g,b= pixels[x, y]
            pixels[x, y] = (firstValue,g,b)

    # Zapisanie obrazka w plikach projektu
    image.save('static/images/newImage.jpg')

# Zmiana komponentu G
def _singleValue_G(image, width, height, pixels):

    # Wartość globalna
    global firstValue

    # Pętla po obrazie
    for x in range(width):
        for y in range(height):
            r,g,b= pixels[x, y]
            pixels[x, y] = (r,firstValue,b)

    # Zapisanie obrazka w plikach projektu
    image.save('static/images/newImage.jpg')

# Zmiana komponentu B
def _singleValue_B(image, width, height, pixels):

    # Wartość globalna
    global firstValue

    # Pętla po obrazie
    for x in range(width):
        for y in range(height):
            r,g,b= pixels[x, y]
            pixels[x, y] = (r,g,firstValue)

    # Zapisanie obrazka w plikach projektu
    image.save('static/images/newImage.jpg')

# Zmiana komponentów R i G
def _doubleValue_RG(image, width, height, pixels):

    # Wartość globalna
    global firstValue

    # Pętla po obrazie
    for x in range(width):
        for y in range(height):
            r,g,b= pixels[x, y]
            pixels[x, y] = (firstValue,secondValue,b)

    # Zapisanie obrazka w plikach projektu
    image.save('static/images/newImage.jpg')

# Zmiana komponentów R i B
def _doubleValue_RB(image, width, height, pixels):

    # Wartość globalna
    global firstValue

    # Pętla po obrazie
    for x in range(width):
        for y in range(height):
            r,g,b= pixels[x, y]
            pixels[x, y] = (firstValue,g,secondValue)

    # Zapisanie obrazka w plikach projektu
    image.save('static/images/newImage.jpg')

# Zmiana komponentów G i B
def _doubleValue_GB(image, width, height, pixels):

    # Wartość globalna
    global firstValue

    # Pętla po obrazie
    for x in range(width):
        for y in range(height):
            r,g,b= pixels[x, y]
            pixels[x, y] = (r,firstValue,secondValue)
            
    # Zapisanie obrazka w plikach projektu
    image.save('static/images/newImage.jpg')

if __name__ == "__main__":  
    app.run()