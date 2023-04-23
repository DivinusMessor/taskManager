function deleteTask(taskId) {
  const taskCard = document.getElementById("task-card-" + taskId);
  console.log("Editing task with ID:", taskId);

  // Call your delete task API
  fetch(`/tasks/${taskId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        // Remove task card from the DOM
        taskCard.remove();
      } else {
        alert("Error deleting task. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
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
      alert("Error: failed to toggle the task completion state");
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

async function toggleTodo(todoID) {
  const checkbox = document.getElementById("checkbox-" + todoID);
  const content = document.getElementById("todo-content-" + todoID);
  const completed = checkbox.checked;

  if (completed) {
    content.style.textDecoration = "line-through";
  } else {
    content.style.textDecoration = "none";
  }

  try {
    const response = await fetch(`/todos/${todoID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: completed }),
    });

    if (!response.ok) {
      throw new Error("Error updating todo completed status.");
    }
  } catch (error) {
    console.error("Error updating todo completed status:", error);
    alert("Failed to update the todo completed status. Please try again.");
  }
}

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
      const todoContent = document.getElementById("todo-content-" + todoId);
      const removeTodoButton = todoItem.querySelector(".remove-todo");
      const moveUpTodoButton = todoItem.querySelector(".move-up-todo");
      const moveDownTodoButton = todoItem.querySelector(".move-down-todo");
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
    saveTask(task_id);
  } else {
    taskTitle.setAttribute("contenteditable", "true");
    taskTitle.focus();
    editButton.textContent = "Save";

    todoItems.forEach((todoItem) => {
      const todoId = todoItem.id.split("-")[2];
      const todoContent = document.getElementById("todo-content-" + todoId);
      const removeTodoButton = todoItem.querySelector(".remove-todo");
      const moveUpTodoButton = todoItem.querySelector(".move-up-todo");
      const moveDownTodoButton = todoItem.querySelector(".move-down-todo");
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
    });

    if (taskDescription) {
      taskDescription.setAttribute("contenteditable", "true");
    }
    if (addTodoButton) {
      addTodoButton.style.display = "inline";
    }

    // Add the following block of code
    if (todoItems.length === 0 && !addTodoButton) {
      const addTodoItemBtn = createAddTodoButton(task_id);
      taskCard.querySelector(".list-group").appendChild(addTodoItemBtn);
    }
  }
}

async function saveTask(task_id) {
  const taskTitle = document.getElementById(
    "task-title-" + task_id
  ).textContent;
  const taskCard = document.getElementById("task-card-" + task_id);
  const taskDescription = taskCard.querySelector(".card-text").textContent;

  const todoItems = Array.from(
    document.querySelectorAll("#task-card-" + task_id + " .list-group-item")
  ).map((todoItem) => {
    const todoId = todoItem.id.split("-")[2];
    const todoContent = document.getElementById(
      "todo-content-" + todoId
    ).textContent;
    const todoCompleted = todoItem.classList.contains(
      "list-group-item-success"
    );
    return { id: todoId, content: todoContent, completed: todoCompleted };
  });

  const taskData = {
    id: task_id,
    title: taskTitle,
    description: taskDescription,
    todos: todoItems,
  };

  try {
    const response = await fetch("/tasks/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    console.log("Task saved successfully.");
    location.reload();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

function editTodo(todoID) {
  const todoContent = document.getElementById("todo-content-" + todoID);
  const editTodoButton = document.querySelector(`[data-todo-id="${todoID}"]`);
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

async function addTodo(task_id) {
  const taskCard = document.getElementById("task-card-" + task_id);
  const todosList = taskCard.querySelector(".list-group");

  // Generate a unique ID for the new todo item
  const newTodoId = Date.now();

  const newTodoItem = document.createElement("li");
  newTodoItem.className = "list-group-item";
  newTodoItem.id = "todo-item-" + newTodoId; // Assign the ID to the new todo item
  newTodoItem.innerHTML = `
    <input type="checkbox" id="checkbox-${newTodoId}" class="toggle-todo" onchange="toggleTodo(${newTodoId})">
    <span id="todo-content-${newTodoId}" class="todo-content" contenteditable="true">New Todo</span>
    <button class="btn btn-danger btn-sm remove-todo hide-button" onclick="removeTodo(${newTodoId})">Remove</button>
  `;

  todosList.appendChild(newTodoItem);

  // Attach the event listener to the new checkbox
  const newCheckbox = document.getElementById("checkbox-" + newTodoId);
  newCheckbox.addEventListener("change", () => toggleTodo(newTodoId));

  // Save the new todo immediately
  const newTodoContent = newTodoItem.querySelector(".todo-content");
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
      newTodoItem.id = `todo-item-${todo.id}`;
      newTodoContent.id = `todo-content-${todo.id}`;
      newCheckbox.id = `checkbox-${todo.id}`;
      newCheckbox.setAttribute("onchange", `toggleTodo(${todo.id})`);
    } else {
      throw new Error("Error creating todo.");
      alert(
        "An error occurred while trying to save the new todo. Please try again."
      );
    }
  } catch (error) {
    console.error("Error creating todo:", error);
    alert("Failed to create the todo. Please try again.");
  }
}

async function updateTaskTitle(task_id, titleElement) {
  console.log("Updating task title with ID:", task_id);
  try {
    const response = await fetch(`/tasks/${task_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: titleElement.textContent }),
    });

    if (!response.ok) {
      throw new Error("Error updating task title.");
    }
  } catch (error) {
    console.error("Error updating task title:", error);
    alert("Failed to update the task title. Please try again.");
  }
}

async function updateTodoContent(todoID, todoContentElement) {
  console.log("Updating todo content with ID:", todoID);
  try {
    const response = await fetch(`/todos/${todoID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: todoContentElement.textContent }),
    });

    if (!response.ok) {
      throw new Error("Error updating todo content.");
    }
  } catch (error) {
    console.error("Error updating todo content:", error);
    alert("Failed to update the todo content. Please try again.");
  }
}

function attachBlurEventListeners() {
  document.querySelectorAll(".card-title").forEach((titleElement) => {
    titleElement.addEventListener("blur", (event) => {
      const task_id =
        event.target.parentElement.parentElement.parentElement.id.split("-")[2];
      updateTaskTitle(task_id, event.target);
    });
  });

  document.querySelectorAll(".todo-content").forEach((todoContentElement) => {
    todoContentElement.addEventListener("blur", (event) => {
      const todoID = event.target.parentElement.id.split("-")[2];
      updateTodoContent(todoID, event.target);
    });
  });
}
