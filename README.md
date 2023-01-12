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
