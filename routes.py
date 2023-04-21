from flask import request
from app import app, db
from models import Task, Todo
from datetime import datetime
from traceback import format_exc
from flask import Flask, jsonify, request, render_template, redirect, url_for


# Route to root page and list all tasks
@app.route('/')
def index():
    tasks = Task.query.all()
    return render_template('index.html', tasks=tasks)

# Route to get all tasks
@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    tasks_list = [{"id": task.id, "title": task.title, "description": task.description, "completed": task.completed} for task in tasks]
    return jsonify(tasks_list)

# render add task page
@app.route('/add-task')
def add_task_page():
    return render_template('add_task.html')

# add task functionality 
@app.route('/add-task', methods=['POST'])
def add_task():
    title = request.form['title']
    description = request.form['description']
    todos_data = request.form.getlist('todos[]')
    new_task = Task(title=title, description=description, completed=False, created_at=datetime.utcnow())
    
    db.session.add(new_task)
    db.session.commit()  # Commit the new task to obtain its ID

    for todo in todos_data:
        if todo.strip() != "":
            new_todo = Todo(content=todo, completed=False, created_at=datetime.utcnow(), task_id=new_task.id)  # Change task to task_id
            db.session.add(new_todo)

    db.session.commit()
    return redirect(url_for('index'))



# Route to get a specific task
@app.route("/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = Task.query.get(task_id)
    if task:
        return jsonify({"id": task.id, "title": task.title, "description": task.description, "completed": task.completed})
    return jsonify({"message": "Task not found"}), 404

# Route to update an existing task
@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json()
    task = Task.query.get(task_id)
    if task:
        task.title = data.get("title", task.title)
        task.description = data.get("description", task.description)
        task.completed = data.get("completed", task.completed)
        db.session.commit()
        return jsonify({"message": "Task updated successfully"})
    return jsonify({"message": "Task not found"}), 404

# Route to delete a specific task
@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if task:
        todos = Todo.query.filter(Todo.task_id == task_id).all()
        for todo in todos:
            db.session.delete(todo)

        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted successfully"})
    return jsonify({"message": "Task not found"}), 404

