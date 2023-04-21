from app import db
from datetime import datetime

# Defines a Task class, which is a database model for representing tasks in a task management system. 
# The model uses the SQLAlchemy ORM (Object-Relational Mapping) to map Python objects to the database.
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    todos = db.relationship('Todo', back_populates='parent_task', lazy=True)
    
class Todo(db.Model):
    __tablename__ = 'todo'
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    content = db.Column(db.String(255), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    parent_task = db.relationship('Task', back_populates='todos')
