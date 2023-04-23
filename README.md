# Task Management System
This is a simple Task Management System built using Flask, a Python web framework. The application allows users to manage tasks and their associated todos. The backend is powered by SQLAlchemy for database operations and Flask-Migrate for handling database migrations. The front-end uses HTML templates, CSS for styling, and JavaScript for client-side functionality.

# Features
List tasks
Add tasks with associated todos
Edit tasks and their associated todos
Delete tasks and their associated todos
Mark tasks as completed
Mark todos as completed

# Directory Structure
markdown
Copy code
- static/
    - css/
        - styles.css
    - main.js
- templates/
    - add_task.html
    - index.html
- app.py
- models.py
- routes.py

# Installation & Setup
Clone the repository to your local machine:

```bash
Copy code
git clone https://github.com/yourusername/task-management-system.git
```
Navigate to the project directory:

bash
Copy code
cd task-management-system
Create a virtual environment to manage the project dependencies:

Copy code
python -m venv venv
Activate the virtual environment:

On Windows:

Copy code
.\venv\Scripts\activate
On macOS/Linux:

bash
Copy code
source venv/bin/activate
Install the required packages:

Copy code
pip install -r requirements.txt
Initialize the database:

csharp
Copy code
flask db init
Apply database migrations:

Copy code
flask db upgrade
Run the application:

arduino
Copy code
flask run
The application will be running at http://127.0.0.1:5000/.

License
This project is open source and available under the MIT License.
