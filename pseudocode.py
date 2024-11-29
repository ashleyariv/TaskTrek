"""
Import flask, flask_cors and models database

Initialize flask app for my database with CORS

Initialize database object and create my table

Define get_tasks function (READ)
    query all tasks
    return jsonify dictionary of list of tasks

Define create_tasks (POST)
    create task with keys and data values
    add task 
    commit changes
    return new task dictionary 

Define delete_task function (DELETE)
    get task to delete filtering by id
    delete task 
    commit changes
    return nothing

Define update_task function (PATCH/UPDATE)
    get task to update filtering by id
    manually set attributes for task
    commit changes
    return updated task dictionary

Run app with special name function in debugging mode
"""