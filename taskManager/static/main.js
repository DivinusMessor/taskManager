document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("task-form");
  
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
  
        fetch("/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            window.location.href = "/";
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    }
  });
  
  function deleteTask(taskId) {
    fetch(`/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          window.location.reload();
        } else {
          alert("Error: failed to delete the task");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
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
  