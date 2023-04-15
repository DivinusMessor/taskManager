import os 

# Define the path to the SQLite database File 
basedir = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "tasks.db")

# Disable the tracking of modifications to save resources 
SSQLALCHEMY_TRACK_MODIFICATIONS = False


