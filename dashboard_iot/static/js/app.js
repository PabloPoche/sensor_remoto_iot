// ---- Estructura de datos ----
let data = {
    alarm_t: 0,
    alarm_h: 0,
    sp_alarm: {set_p_temp: 40, set_p_hume: 40},
    climaticos: {temperatura: 0, humedad: 0},
    gps: {latitude: -33.33, longitude: -60.222}
}

let keepAlive = {};
let userConfig = {};

let chartReady = false;

const dataMaxLen = 50;
const TempTime = new Array(dataMaxLen);
const TempData = new Array(dataMaxLen);
const HumeTime = new Array(dataMaxLen);
const HumeData = new Array(dataMaxLen);
TempSp= data.sp_alarm["set_p_temp"];
HumeSp= data.sp_alarm["set_p_hume"];
Color_sp_Temp= "gray";
Color_sp_Hume= "gray";


function addData(time, data, bufferTime, bufferData) {
    
    bufferTime.push(time);
    bufferData.push(data);
    if (bufferTime.length > dataMaxLen) {
        bufferTime.shift();
        bufferData.shift();
     
    }
    if(chartReady == true) {
        TempChart.options.annotation.annotations[0].borderColor = Color_sp_Temp;
        TempChart.options.annotation.annotations[0].label.backgroundColor = Color_sp_Temp;
        TempChart.options.annotation.annotations[0].value = Number(TempSp);
        TempChart.update();
        HumeChart.options.annotation.annotations[0].borderColor = Color_sp_Hume;
        HumeChart.options.annotation.annotations[0].label.backgroundColor = Color_sp_Hume;
        HumeChart.options.annotation.annotations[0].value = Number(HumeSp);
        HumeChart.update();
                            }
}


addData(0, 0, TempTime, TempData);
addData(0, 0, HumeTime, HumeData);


let socket_connected = false;
const dashboard_topic = "dashboardiot";
const topicBase = `${dashboard_topic}/${mqttuser}`

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}


// ---- Elementos del HTML ----
const salarm_t = document.querySelector("#salarm_t");
const salarm_h = document.querySelector("#salarm_h");

function sendActuadorUpdate(alarma) {
    if (socket_connected == true)   {
        
        if(alarma == "alarm_t") {
            message = new Paho.MQTT.Message(String(data.sp_alarm["set_p_temp"]));
            message.destinationName = `${topicBase}/alarmas/sp_alarm_t`;
            client.send(message);           

            message = new Paho.MQTT.Message(String(data.alarm_t));
            message.destinationName = `${topicBase}/alarmas/alarm_t`;
            client.send(message);
                                 }

        if(alarma == "alarm_h") {
            message = new Paho.MQTT.Message(String(data.sp_alarm["set_p_hume"]));
            message.destinationName = `${topicBase}/alarmas/sp_alarm_h`;
            client.send(message);

            message = new Paho.MQTT.Message(String(data.alarm_h));
            message.destinationName = `${topicBase}/alarmas/alarm_h`;
            client.send(message);
                                }
                                    }
                                    }

// ---- Paginas ----
function showPage(id) {
    const pages = document.querySelectorAll("section");
    pages.forEach((page) => {        
        if(page.id == id) {
            page.style.display = "block";
        }
        else {
            page.style.display = "none";
        }
    });
}

let pagesBtn = document.querySelectorAll("aside a");
pagesBtn.forEach((pageBtn) => {
    pageBtn.onclick = () => {
        showPage(pageBtn.getAttribute("page"));
    }
});

pagesBtn = document.querySelectorAll("footer a");
pagesBtn.forEach((pageBtn) => {
    pageBtn.onclick = () => {
        showPage(pageBtn.getAttribute("page"));
    }
});


// ---- Instanciar elementos HTML y conectar eventos ----

document.querySelector("#set_p_temp").value = data.sp_alarm.set_p_temp;
document.querySelector("#set_p_temp").onchange = (e) => {
    if(isNumeric(e.target.value) == true) {
        data.sp_alarm.set_p_temp = parseFloat(e.target.value);
    }
};


document.querySelector("#set_p_hume").value = data.sp_alarm.set_p_hume;
document.querySelector("#set_p_hume").onchange = (e) => {
    if(isNumeric(e.target.value) == true) {
        data.sp_alarm.set_p_hume = parseFloat(e.target.value);
        
    }
};



salarm_t.onchange = (e) => {
    const val = e.target.checked ? 1 : 0;
    data.alarm_t = val;
    Color_sp_Temp= "gray";
    if (val == 1) {
        Color_sp_Temp= "blue";
        TempSp= data.sp_alarm["set_p_temp"];
                    }
    sendActuadorUpdate("alarm_t");
}

salarm_h.onchange = (e) => {
    const val = e.target.checked ? 1 : 0;
    data.alarm_h = val;
    Color_sp_Hume= "gray";
    if (val == 1) {
        Color_sp_Hume= "blue";
        HumeSp= data.sp_alarm["set_p_hume"];
                }
    sendActuadorUpdate("alarm_h");
}


function play_beep() {
    snd = new Audio("static/images/beep.mp3");
    snd.play();
    return false;
}


(function my_func() {

    if ((data.climaticos.temperatura > data.sp_alarm.set_p_temp && data.alarm_t == 1) ||
        (data.climaticos.humedad > data.sp_alarm.set_p_hume && data.alarm_h == 1)) {
        play_beep();
    }
     
    if (socket_connected == true){
        message = new Paho.MQTT.Message("1");
        message.destinationName = `${topicBase}/keepalive/request`;
        client.send(message);

        message = new Paho.MQTT.Message("1");
        message.destinationName = `${topicBase}/config/request`;
        client.send(message);
                                }
    setTimeout( my_func, 1000 );
})();



// ---- MQTT Websockets ----
const client = new Paho.MQTT.Client("23.92.69.190", 9001, "clientId_" + mqttuser);

// set callback handlers
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    socket_connected = true;
    client.subscribe(`${topicBase}/#`);
    client.subscribe(`${dashboard_topic}/+/sensores/gps`);
    client.subscribe(`${dashboard_topic}/+/keepalive/ack`);
    client.subscribe(`${dashboard_topic}/+/config/ack`);
}

function doFail(e) {
    console.log(e);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    socket_connected = false;
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost: " + responseObject.errorMessage);
    }
  }

// called when a message arrives
function onMessageArrived(message) {
    // console.log("onMessageArrived: " + message.destinationName + "  "+ message.payloadString);
    const msg = message.payloadString;
    try {
        if(message.destinationName == `${topicBase}/alarmas/alarm_t`) {
            const val = Number(msg);
            data.alarm_t = val;
            salarm_t.checked = val;
        }

        else if(message.destinationName == `${topicBase}/alarmas/alarm_h`) {
            const val = Number(msg);
            data.alarm_h = val;
            salarm_h.checked = val;
        }
     
        else if(message.destinationName == `${topicBase}/sensores/climaticos`) {
            const climaticos = JSON.parse(msg);
            data.climaticos.temperatura = Number(climaticos["temperatura"]);
            data.climaticos.humedad = Number(climaticos["humedad"]);
            const idx = TempTime[TempTime.length - 1]
            addData(idx+1, data.climaticos.temperatura, TempTime, TempData);
            const idx2 = HumeTime[HumeTime.length - 1]
            addData(idx2+1, data.climaticos.humedad, HumeTime, HumeData);
        }

        else if(message.destinationName.includes(`/sensores/gps`)) {
            const gps = JSON.parse(msg);
            const latitude = Number(gps["latitude"]);
            const longitude = Number(gps["longitude"]);
            const user = message.destinationName.split("/")[1];
            if ((user in userConfig)==false) {
                userConfig[user] = {"color": "red", "description": ""};
            }
            updateMarker(user, longitude, latitude, userConfig[user]["color"], userConfig[user]["description"]);
        }
        
        else if(message.destinationName.includes('keepalive/ack')) {
            const user = message.destinationName.split("/")[1];
            if(! keepAlive.hasOwnProperty(user)) {
                keepAlive[user] = 0;
            }
            keepAlive[user]++;
        }

        else if(message.destinationName.includes('keepalive/request')) {
            // no hacer nada
        }

        else if(message.destinationName.includes('config/ack')) {
            const config = JSON.parse(msg);
            const color = config["color"];
            const description = config["description"];
            if((color != null) && (description != null)) {
                const user = message.destinationName.split("/")[1];
                if ((user in userConfig)==false) {
                    userConfig[user] = {"color": "red", "description": ""};
                }
                userConfig[user]["color"] = color;
                userConfig[user]["description"] = description;
            }
        }

        else if(message.destinationName.includes('config/request')) {
            // no hacer nada
        }

        else {
            console.log("Tópico no soportado: "+ message.destinationName);
        }
    }
    catch (e){
        console.log(e);
    }
}

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
const options = {
    onSuccess: onConnect,
    onFailure: doFail,
    userName: "inoveiot",
    password: "mqtt",
}
// connect the client
client.connect(options);




