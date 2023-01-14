from machine import Pin, ADC, UART, I2C, Timer
import dht
import time
import network
import json
import _thread
from robust import MQTTClient
from ssd1306 import SSD1306_I2C 
from micropyGPS import MicropyGPS
from codes import *				        # Archivo de passwords y usuarios

data_sens={"temperatura": 0, "humedad": 0}
data_sp= {"sp_temp": 40, "sp_hume": 40}
data_pos= {}

# ---------------------- Configuraciones de hardware-----------------

led_alarm_t = Pin(16, Pin.OUT)		    # Led rojo alarma de Temperatura activada
led_alarm_h = Pin(17, Pin.OUT)		    # Led verde alarma de Humedad activada
led_alive= Pin("LED", Pin.OUT)  		# Led onboard (Keep alive request)
buzzer = Pin(22, Pin.OUT)		        # Buzzer (Alarma)

data_dht = dht.DHT11(Pin(15, Pin.PULL_DOWN))	        # Sensor DHT11

i2c = I2C(0, sda=Pin(8), scl=Pin(9), freq=400000)			# Pantalla OLED SSD1306
oled = SSD1306_I2C(128, 64, i2c)

modulo_gps = UART(1, baudrate=9600, tx=Pin(4), rx=Pin(5))	# Modulo GPS NEO 6M
Zona_Horaria = -3
gps = MicropyGPS(Zona_Horaria)



# -------------------------------------------------------------


def wlan_connect():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.config(pm = 0xa11140)  # Power-saving mode 
    wlan.connect(ssid, password)
    # Esperar por coneccion o falla
    max_wait = 10
    while max_wait > 0:
        if wlan.status() < 0 or wlan.status() >= 3:
            break
        max_wait -= 1
        print('Waiting for connection...')
        time.sleep(1)
    # Manejo de error de coneccion
    if wlan.status() != 3:
        raise RuntimeError('Network connection failed')
    else:
        status = wlan.ifconfig()
        print("Connected to ip=", status[0], "WIFI Lan")
        print()
                
        
def mqtt_connect():
    #MQTT Client
    client = MQTTClient(client_id="Sensor_remoto_iot", server=mqtt_server, user=mqtt_user, password=mqtt_password)
    client.connect()
    client.set_callback(callback)
    client.subscribe(topico_base + "alarmas/alarm_t")    # suscribir a alarma de Temperatura
    client.subscribe(topico_base + "alarmas/alarm_h")    # suscribir a alarma de Humedad
    client.subscribe(topico_base + "alarmas/sp_alarm_t") # suscribir a set point de Temperatura
    client.subscribe(topico_base + "alarmas/sp_alarm_h") # suscribir a set point de Humedad
    client.subscribe(topico_base + "keepalive/request")  # suscribir a Keep alive request
    client.subscribe(topico_base + "config/request")     # suscribir a Config request
    return(client)


def publish(topic, value):
    client.publish(topic, value)
    print("Published:",topic,"=",value)
    print()
    time.sleep(0.2)
    

def callback(topic, msg):
    topic = topic.decode('utf-8')
    msg= msg.decode('utf-8')
    print("Received :",topic,"=",msg)
                
    if topic == topico_base + "alarmas/sp_alarm_t":
        data_sp["sp_temp"] = msg
        
    if topic == topico_base + "alarmas/sp_alarm_h":
        data_sp["sp_hume"] = msg
    
    if topic == topico_base + "alarmas/alarm_t":
        if msg == "1":
            led_alarm_t.on()
        elif msg == "0":
            led_alarm_t.off()
            
    if topic == topico_base + "alarmas/alarm_h":
        if msg == "1":
            led_alarm_h.on()
        elif msg == "0":
            led_alarm_h.off()
    
    if topic == topico_base + "keepalive/request":
        led_alive.on()
        publish(topico_base + "keepalive/ack", "1")      # publicar Keep alive acknowledge
        led_alive.off()
        
    if topic == topico_base + "config/request":
        data={ "color": "blue", "description": ["Temperatura: "+ str(data_sens["temperatura"])+ " C    " "Humedad: "+ str(data_sens["humedad"])+ " %"] } 
        value= json.dumps(data)                             
        publish(topico_base + "config/ack", value)       # publicar temperatura y humedad en mapa
        

def osc_buzzer(f):
        if led_alarm_t.value() == 1 and int(data_sens["temperatura"]) > int(data_sp["sp_temp"]):
            buzzer.toggle()
        else:
            if led_alarm_h.value() == 1 and int(data_sens["humedad"]) > int(data_sp["sp_hume"]):
                buzzer.toggle()
            else:
                buzzer.off()



def convertir(secciones):
    if (secciones[0] == 0):         # secciones[0] contiene los grados
        return None
    # secciones[1] contiene los minutos    
    data = secciones[0]+(secciones[1]/60.0)
    # secciones[2] contiene 'E', 'W', 'N', 'S'
    if (secciones[2] == 'S'):
        data = -data
    if (secciones[2] == 'W'):
        data = -data
    data = '{0:.6f}'.format(data)   # 6 digitos decimales
    return str(data)     


def measure_thread():
    global data_sens
    global data_pos
    global data_sp
    
    while True:						# Proceso secundario (THREAD 1)
        
        # Delay 1 seg.
        time.sleep(1)

        # Leer sensor de temperatura y humedad (DHT11)
        data_dht.measure()
        humedad= data_dht.humidity()
        temperatura= data_dht.temperature()
        data_sens={ "temperatura": temperatura, "humedad": humedad }
         
        # Leer datos de GPS (NEO 6M)
        largo = modulo_gps.any()
        if largo > 0:
                b = modulo_gps.read(largo)
                for x in b :
                    msg = gps.update(chr(x))
        latitud = convertir(gps.latitude)
        longitud = convertir(gps.longitude)
        t = gps.timestamp
        #t[0] => horas : t[1] => minutos : t[2] => segundos
        horario = '{:02d}:{:02d}:{:02}'.format(t[0], t[1], t[2])
        #satelites= str(gps.satellites_in_use)
        if (latitud == None or longitud == None):
            horario= "--:--:--"
            latitud =  "--.------"
            longitud = "--.------"
        data_pos={ "latitude": latitud, "longitude": longitud }

        # Displayado de datos en pantalla (SSD1306)
        oled.fill(0)     			# Limpiar pantalla
        oled.text("Horario:"+ horario, 0, 0)
        oled.text("Lat:"+ latitud, 0, 11)
        oled.text("Lon:"+ longitud, 0, 22)
        oled.text("Temperatura:"+ str(temperatura)+ " C", 0, 33)
        oled.text("Humedad:"+ str(humedad)+ " %" , 0, 44)
        oled.text("SpT:"+ str(data_sp["sp_temp"]) + "C" +"  SpH:"+ str(data_sp["sp_hume"]) + "%", 0, 55)
        oled.show()					# Display


        
        
# -------------------- MAIN ----------------------------------

led_alarm_t.on()
wlan_connect()
led_alarm_t.off()

try:
    client = mqtt_connect()
    print("Connected to ip=", mqtt_server, "MQTT Broker")
    print()
except OSError as e:
    print("Failed to connected to MQTT Broker. Reconnecting...")
    time.sleep(5)
    machine.reset()

        # Gestion de alarmas
Timer(period= 100, mode= Timer.PERIODIC, callback= osc_buzzer)
        
_thread.start_new_thread(measure_thread,())

while True:			# Proceso principal 
        
        client.check_msg()			# espera suscripciones

        value= json.dumps(data_sens)
        publish(topico_base + "sensores/climaticos", value)  # publicar temperatura y humedad
         
        client.check_msg()			# espera suscripciones
            
        value= json.dumps(data_pos)
        publish(topico_base + "sensores/gps", value)          # publicar latitud y longitud


  
 
    