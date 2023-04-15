from flask import Flask 
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate 
from flask import render_template

# Creat flask app and configure it to use the config file 
app = Flask(__name__)
app.config.from_object("config")

# set up SQLAlchemy and Migrate with the flask App
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# import routes 
from routes import *

# run the app 
if __name__ == "__main__":
    app.run(debug=True)

