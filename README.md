![Juego banner](/flash_crash.jpg)

# Proyecto integrador:
Lenguaje: Python.\
Nivel: Programador.

# Crypto Flash Crash Detector.
Un Flash Crash es un evento muy poco frecuente que se da en los mercados financieros en el que un activo, en este caso una criptomoneda, cae rápidamente de valor
(caída de más del 1% en menos de 1 minuto).\
La aplicación monitorea el precio de una determinada criptomoneda y en caso de detectarse un flash crash de la misma notifica al usuario vía SMS,
registra el evento completo(minuto previo y posterior al evento) en una BD y posibilita luego exportarlo a una archivo .csv para un posterior análisis(Data Analytic). 


# Entrada del sistema.

Buenas tardes, dejo a consideración la siguiente propuesta:

El proyecto consiste en la implementación de un dispositivo IoT capaz de monitorear y transmitir por wifi variables climáticas(temperatura y humedad) así como también la posición geográfica donde se encuentra el mismo, dispone a su vez de una salida de alarma (buzzer) que podrá ser accionada en caso de que alguna de las variables climáticas supere un determinado valor.



Descripción del hardware:

- El dispositivo IoT está constituido por los siguientes elementos de hardware:

- Raspberry pi (Pico W) con Microcontrolador RP2040 Dual-Core ARM Cortex M0+ y Modulo WiFi(CYW43439) onboard.

- Modulo GPS (NEO 6M) con comunicación UART asincrónica.

- Sensor de temperatura y humedad (DHT11) con comunicación 1-wire.

- Pantalla OLED 128X64 (SSD1306) con comunicación I2C.

- Led rojo/verde y buzzer (actuadores) conectados a salidas digitales.



Descripción del software:

La programación del dispositivo es realizada en Micropython sobre una raspberry pi picoW la cual ni bien es energizada corre la aplicación (main.py), donde, en primera instancia se definen y configuran los diferentes elementos de hardware (módulo wifi, gps, sensores, pantalla, etc.) y luego, una vez establecida la conexión con la red, se lanza el proceso principal(cliente mqtt) donde se realizan la publicación y suscripción de los diferentes tópicos, junto a un proceso secundario(measure_thread) que realiza la medición, gestión de las alarmas y displayado de las respectivas variables de campo.



Broker mqtt remoto:

El dispositivo Iot trabaja en conjunto con la aplicación inove_dashboard_iot, la que ha sido modificada para adaptarla a los requerimientos del dispositivo. Una vez lanzada la misma desde un browser puede accederse a las diferentes pantallas, donde, desde la solapa mapa puede visualizarse la ubicación del dispositivo (icono azul) y al presionar con el mouse sobre el mismo puede visualizarse la temperatura y humedad medida en ese instante por el dispositivo.

Desde la solapa sensores puede accederse al registro temporal de la temperatura y humedad y desde la solapa alarmas es posible habilitar y setear los límites de accionamiento (set point) de las alarmas de temperatura y humedad.


Desde la pantalla de inicio se invita al usuario a ingresar la criptomoneda a monitorear, luego, la app consumirá una API de Binance
(uno de los exchanges más grandes del mundo) donde obtendrá el precio de dicha criptomoneda y lo ira graficando a tiempo real dentro de una ventana de tiempo
de 1 minuto(Trending).\
-A modo de prueba(test) durante el trending de la criptomoneda es posible forzar su flash crash pulsando la letra (t).

![Juego banner](/trending.jpg)



# Salida del sistema.
En caso de detectarse el flash crash de la criptomoneda elegida se enviara al usuario una notificación por SMS y el trending continuara durante
 1 minuto más, hasta completar el registro de la BD.\
Finalizado el registro del evento, el grafico se cerrara automáticamente y volverá a la pantalla principal desde donde se podrá graficar o exportar
 el registro completo del evento a un archivo .csv

![Juego banner](/index.jpg)



# Nota.
En este proyecto está orientado a integrar en un programa los conocimientos adquiridos durante el cursado de los 8 módulos de programador python.

# Contacto.
Discord ID: PabloP#2073
