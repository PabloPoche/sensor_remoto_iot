from flask import Flask, render_template, redirect

# Crear el server Flask
app = Flask(__name__)


@app.route("/")
def index():
    return render_template('index.html') 

@app.route('/logout')
def logout():
    return redirect("http://www.google.com")
 

if __name__ == '__main__':
    print('Inove@Server start!')

    # Lanzar server
    app.run(host="0.0.0.0", port=5015)
