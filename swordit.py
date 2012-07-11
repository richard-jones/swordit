from flask import Flask, render_template, redirect, url_for, request

app = Flask(__name__)
app.debug = True

@app.route("/")
def index():
    """
    Redirect to a page called welcome if we don't go to a specific page
    """
    with open("swordit.html") as html:
        return html.read()
        
if __name__ == "__main__":
    app.run()
