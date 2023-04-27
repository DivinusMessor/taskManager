from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask import render_template
import os

basedir = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "tasks.db")
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Create flask app and configure it to use the config file
app = Flask(__name__)
app.debug = True
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

# Set up SQLAlchemy and Migrate with the flask App
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Import routes
from routes import *

# Run the app
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
