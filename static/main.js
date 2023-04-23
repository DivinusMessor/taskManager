function deleteTask(taskId) {
  const taskCard = document.getElementById("task-card-" + taskId);

  // Call your delete task API
  fetch(`/tasks/${taskId}`, { // Change /delete_task/ to /tasks/
  method: 'DELETE',
})
  .then(response => {
    if (response.ok) {
      // Remove task card from the DOM
      taskCard.remove();
    } else {
      alert("Error deleting task. Please try again.");
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Error deleting task. Please try again.");
  });
}

document.querySelectorAll(".delete-task").forEach((button) => {
  button.addEventListener("click", () => {
    const taskId = button.getAttribute("data-task-id");
    deleteTask(taskId);
  });
});

function toggleTaskCompletion(taskId, completed) {
  fetch(`/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: !completed }),
  })
    .then((response) => {
      if (response.ok) {
        window.location.reload();
      } else {
        alert("Error: failed to toggle the task completion state");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.querySelectorAll(".complete-task").forEach((button) => {
  button.addEventListener("click", () => {
    const taskId = button.getAttribute("data-task-id");
    const completed = button.getAttribute("data-completed") === "True";
    toggleTaskCompletion(taskId, completed);
  });
});

function toggleTodo(todo_id) {
  const checkbox = document.getElementById("checkbox-" + todo_id);
  const content = document.getElementById("todo-content-" + todo_id);

  if (checkbox.checked) {
    content.style.textDecoration = "line-through";
  } else {
    content.style.textDecoration = "none";
  }

  // You can also call an API here to update the todo.completed status on the server-side
}

// Modify the editTask function
function editTask(task_id) {
  const taskTitle = document.getElementById("task-title-" + task_id);
  const todoItems = document.querySelectorAll(
    "#task-card-" + task_id + " .list-group-item"
  );
  const editButton = document.getElementById("edit-task-" + task_id);
  const isEditable = taskTitle.getAttribute("contenteditable") === "true";
  const taskCard = document.getElementById("task-card-" + task_id);
  const taskDescription = taskCard.querySelector(".card-text");
  const addTodoButton = taskCard.querySelector(".add-todo-button");

  if (isEditable) {
    taskTitle.setAttribute("contenteditable", "false");
    editButton.textContent = "Edit";

    todoItems.forEach((todoItem) => {
      const todoId = todoItem.id.split("-")[2];
      const todoContent = document.getElementById(
        "todo-content-" + todoId
      );
      const removeTodoButton = todoItem.querySelector(".remove-todo");
      const moveUpTodoButton = todoItem.querySelector(".move-up-todo");
      const moveDownTodoButton =
        todoItem.querySelector(".move-down-todo");
      if (todoContent) {
        todoContent.setAttribute("contenteditable", "false");
      }
      if (removeTodoButton) {
        removeTodoButton.style.display = "none";
      }
      if (moveUpTodoButton) {
        moveUpTodoButton.style.display = "none";
      }
      if (moveDownTodoButton) {
        moveDownTodoButton.style.display = "none";
      }
    });

    if (taskDescription) {
      taskDescription.setAttribute("contenteditable", "false");
    }
    if (addTodoButton) {
      addTodoButton.style.display = "none";
    }

    // Save changes to the server, if needed
    // Update the task creation date to the current date
  } else {
    taskTitle.setAttribute("contenteditable", "true");
    taskTitle.focus();
    editButton.textContent = "Save";

    todoItems.forEach((todoItem) => {
      const todoId = todoItem.id.split("-")[2];
      const todoContent = document.getElementById(
        "todo-content-" + todoId
      );
      const removeTodoButton = todoItem.querySelector(".remove-todo");
      const moveUpTodoButton = todoItem.querySelector(".move-up-todo");
      const moveDownTodoButton =
        todoItem.querySelector(".move-down-todo");
      if (todoContent) {
        todoContent.setAttribute("contenteditable", "true");
      }
      if (removeTodoButton) {
        removeTodoButton.style.display = "inline";
      }
      if (moveUpTodoButton) {
        moveUpTodoButton.style.display = "inline";
      }
      if (moveDownTodoButton) {
        moveDownTodoButton.style.display = "inline";
      }
      if (taskDescription) {
        taskDescription.setAttribute("contenteditable", "true");
      }
      if (addTodoButton) {
        addTodoButton.style.display = "inline";
      }
    });
  }
}

// Add this to your JavaScript
document.addEventListener("DOMContentLoaded", function () {
  const editTodoButtons = document.querySelectorAll(".edit-todo");

  editTodoButtons.forEach((editTodoButton) => {
    editTodoButton.style.display = "none";
  });
});

function editTodo(todo_id) {
  const todoContent = document.getElementById("todo-content-" + todo_id);
  const editTodoButton = document.querySelector(
    `[data-todo-id="${todo_id}"]`
  );
  const pencilIcon = editTodoButton.querySelector(".fas.fa-pencil-alt");
  const checkIcon = editTodoButton.querySelector(".fas.fa-check");

  if (todoContent.getAttribute("contenteditable") !== "true") {
    todoContent.setAttribute("contenteditable", "true");
    todoContent.focus();
    pencilIcon.style.display = "none";
    checkIcon.style.display = "inline-block";
  } else {
    todoContent.removeAttribute("contenteditable");
    pencilIcon.style.display = "inline-block";
    checkIcon.style.display = "none";
    // Call your update todo API to save the changes
  }
}

function removeTodo(todoId) {
  const todoItem = document.getElementById(`todo-item-${todoId}`);
  todoItem.remove();

  // Send DELETE request to the server
  fetch(`/todos/${todoId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error removing todo.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to remove the todo. Please try again.");
    });
}

function moveTodoUp(todo_id) {
  const todoItem = document.getElementById("todo-item-" + todo_id);
  const previousItem = todoItem.previousElementSibling;
  if (previousItem) {
    todoItem.parentNode.insertBefore(todoItem, previousItem);
    // Call your update todo API to update the order of todos on the server-side
  }
}

function moveTodoDown(todo_id) {
  const todoItem = document.getElementById("todo-item-" + todo_id);
  const nextItem = todoItem.nextElementSibling;
  if (nextItem) {
    todoItem.parentNode.insertBefore(nextItem, todoItem);
    // Call your update todo API to update the order of todos on the server-side
  }
}

async function addTodo(task_id) {
  const taskCard = document.getElementById("task-card-" + task_id);
  const todosList = taskCard.querySelector(".list-group");

  // Generate a unique ID for the new todo item
  const newTodoId = Date.now();

  const newTodoItem = document.createElement("li");
  newTodoItem.className = "list-group-item";
  newTodoItem.id = "todo-item-" + newTodoId; // Assign the ID to the new todo item
  newTodoItem.innerHTML = `
    <input type="checkbox" id="checkbox-${newTodoId}" onchange="toggleTodo(${newTodoId})">
    <span id="todo-content-${newTodoId}" contenteditable="true">New Todo</span>
    <button class="btn btn-danger btn-sm remove-todo hide-button" onclick="removeTodo(${newTodoId})">Remove</button>
    <button class="btn btn-secondary btn-sm move-up-todo hide-button" onclick="moveTodoUp(${newTodoId})">Up</button>
    <button class="btn btn-secondary btn-sm move-down-todo hide-button" onclick="moveTodoDown(${newTodoId})">Down</button>
  `;

  todosList.appendChild(newTodoItem);

  // Attach the event listener to the new checkbox
  const newCheckbox = document.getElementById("checkbox-" + newTodoId);
  newCheckbox.addEventListener("change", () => toggleTodo(newTodoId));

  // Save the new todo immediately
  await saveNewTodo(task_id, newTodoItem);
}
    
async function saveNewTodo(task_id, todoItem) {
  const newTodoContent = todoItem.querySelector("span[contenteditable='true']");

  if (newTodoContent.textContent.trim() === "") {
    alert("Please enter some text for the new todo.");
    return;
  }

  try {
    const response = await fetch(`/tasks/${task_id}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newTodoContent.textContent }),
    });

    if (response.ok) {
      const todo = await response.json();
      todoItem.id = `todo-item-${todo.id}`;
      newTodoContent.contentEditable = "false";
      newTodoContent.id = `todo-content-${todo.id}`;

      // Add other elements, such as checkbox and buttons, to the new todo item
      // Similar to how you add them when loading the initial todos in the index.html

      // Example:
      const todoCheckbox = document.createElement("input");
      todoCheckbox.type = "checkbox";
      todoCheckbox.id = `checkbox-${todo.id}`;
      todoCheckbox.addEventListener("change", () => toggleTodo(todo.id));
      todoItem.prepend(todoCheckbox);

      // Add other buttons (remove, move up, move down) as well

      // Update the remove button onclick attribute
      const removeButton = todoItem.querySelector('.remove-todo');
      removeButton.setAttribute('onclick', `removeTodo(${todo.id})`);

    } else {
      throw new Error("Error creating todo.");
      alert("An error occurred while trying to save the new todo. Please try again.");
    }
  } catch (error) {
    console.error("Error creating todo:", error);
    alert("Failed to create the todo. Please try again.");
  }
}