from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Task  

# Initialize Flask
app = Flask(__name__)
CORS(app)  

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

# Initialize db object 
db.init_app(app)

# Create table in database
with app.app_context():
    db.create_all()

# Fetch all tasks from the database
@app.get('/tasks')
def get_tasks():
    tasks = Task.query.all()  
    return jsonify([task.to_dict() for task in tasks]), 200

# Create/add a task to the database
@app.post('/tasks')
def create_task():
    data = request.json 
    try: 
        new_task = Task(title = data['title'], completed=data.get('completed', False))
        db.session.add(new_task)  
        db.session.commit()  
        return jsonify(new_task.to_dict()), 201
    except Exception as e:
        print(e)
        return jsonify({'Error': 'Failed to create task: ' + str(e)}), 405

# Delete a task from the database
@app.delete('/tasks/<int:id>')
def delete_task(id):
    task = Task.query.filter(Task.id == id).first()
    if not task:
        return jsonify({'Error': 'Task not found.'}), 400
    db.session.delete(task)  
    db.session.commit()  
    return '', 201 

# Update/edit a task in the database
@app.patch('/tasks/<int:id>')
def update_task(id):
    task = Task.query.filter(Task.id == id).first()
    
    if not task:
        return jsonify({'Error': 'Task not found.'}), 400

    data = request.json
    try:
        for key in data:
            setattr(task, key, data[key])
        db.session.commit()
        return jsonify(task.to_dict()), 201 
    except Exception as e:
        print(e)
        return jsonify({'Error': 'Failed to update task: ' + str(e)}), 405


if __name__ == '__main__':
    app.run(debug=True) 
