# imagen base de python
FROM python:3.9.1

# habilitar los mensajes por consola
ENV PYTHONUNBUFFERED=1

# instalar dependencias
COPY requirements.txt .
RUN python3 -m pip install -r requirements.txt

# definir la ubicacion de nuestros archivos
WORKDIR /home

# copiar archivos del app a la imagen
COPY . .

# lanzar la aplicación
CMD python3 app.py