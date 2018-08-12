from flask import Flask, send_from_directory
from flask import render_template

app = Flask(__name__)

@app.route('/<path:path>')
def send_js(path):
    return send_from_directory('static', path)

@app.route("/")
def grafik1():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5001,debug=True)
