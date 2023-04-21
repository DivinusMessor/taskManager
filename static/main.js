function deleteTask(taskId) {
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
