// Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const todoDate = document.querySelector(".todo-date");
const filterOption = document.querySelector(".filter-todo");
const searchInput = document.getElementById("search-input-left");

// Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener('click', addTodo);
filterOption.addEventListener('change', filterTodo);
searchInput.addEventListener('input', searchTodos);

function addTodo(event) {
    event.preventDefault();
    const urgency = document.querySelector(".todo-urgency").value;
    const todoText = `${todoInput.value} (Due: ${todoDate.value})`;
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo", urgency);
    const newTodo = document.createElement("li");
    newTodo.innerText = todoText;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    saveLocalTodos(todoText, false); // Initially, the todo is not completed
    appendButton(todoDiv, 'complete-btn', '<i class="fas fa-check"></i>', markComplete);
    appendButton(todoDiv, 'trash-btn', '<i class="fas fa-trash"></i>', deleteTodo);
    appendButton(todoDiv, 'edit-btn', '<i class="fa-solid fa-pen-to-square"></i>', editTodo);
    todoList.appendChild(todoDiv);
    todoInput.value = "";
    todoDate.value = "";
}


function appendButton(parent, className, innerHTML, eventListener) {
    const button = document.createElement("button");
    button.innerHTML = innerHTML;
    button.classList.add(className);
    button.addEventListener('click', eventListener);
    parent.appendChild(button);
}

function markComplete(e) {
    const todoDiv = e.target.parentElement;
    const todoItem = todoDiv.querySelector(".todo-item");
    const wasCompleted = todoDiv.classList.toggle("completed");
    updateTodoStatus(todoItem.innerText, wasCompleted);
}


function deleteTodo(e) {
    const todo = e.target.parentElement;
    todo.classList.add("fall");
    removeLocalTodos(todo);
    todo.addEventListener('transitionend', function() {
        todo.remove();
    });
}

function editTodo(e) {
    const todoDiv = e.target.closest('.todo');
    const todoItem = todoDiv.querySelector(".todo-item");
    const oldText = todoItem.innerText;  // Capture the old text for reference in local storage update
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("todo-item-edit");
    input.value = oldText;

    todoItem.replaceWith(input);
    input.focus();

    input.addEventListener("blur", function() {
        const newText = input.value;
        todoItem.innerText = newText;
        input.replaceWith(todoItem);
        // Update local storage on edit
        editLocalTodos(oldText, newText);
    });

    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            input.blur();
        }
    });
}


function filterTodo() {
    const todos = Array.from(todoList.childNodes);
    todos.forEach(todo => {
        switch (filterOption.value) {
            case "all":
                todo.style.display = 'flex';
                break;
            case "completed":
                todo.style.display = todo.classList.contains('completed') ? 'flex' : 'none';
                break;
            case "uncompleted":
                todo.style.display = !todo.classList.contains('completed') ? 'flex' : 'none';
                break;
            case "urgent":
            case "medium":
            case "low":
                todo.style.display = todo.classList.contains(filterOption.value) ? 'flex' : 'none';
                break;
        }
    });
}

function saveLocalTodos(todoText, isCompleted) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push({text: todoText, completed: isCompleted});
    localStorage.setItem('todos', JSON.stringify(todos));
}


function getTodos() {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todoObj => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        if (todoObj.completed) {
            todoDiv.classList.add("completed");
        }
        const newTodo = document.createElement("li");
        newTodo.innerText = todoObj.text;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);
        appendButton(todoDiv, 'complete-btn', '<i class="fas fa-check"></i>', markComplete);
        appendButton(todoDiv, 'trash-btn', '<i class="fas fa-trash"></i>', deleteTodo);
        appendButton(todoDiv, 'edit-btn', '<i class="fa-solid fa-pen-to-square"></i>', editTodo);
        todoList.appendChild(todoDiv);
    });
}


function removeLocalTodos(todo) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoText = todo.querySelector(".todo-item").innerText;
    todos = todos.filter(todoObj => todoObj.text !== todoText);
    localStorage.setItem('todos', JSON.stringify(todos));
}


function editLocalTodos(oldText, newText) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    // Find the index using trimmed and lowercased text to avoid subtle mismatches.
    const index = todos.findIndex(todo => todo.text.trim().toLowerCase() === oldText.trim().toLowerCase());

    if (index !== -1) {
        // Logging the old and new values for debugging
        console.log(`Updating todo from "${todos[index].text}" to "${newText}"`);
        todos[index].text = newText;  // Update the text in the object
        localStorage.setItem('todos', JSON.stringify(todos));  // Persist the updated todos list
        console.log("Updated todos:", JSON.stringify(todos));
    } else {
        // This error log will help identify issues when a todo item is not found
        console.error("Todo item not found for editing: ", oldText);
    }
}





// Updated searchTodos function to display message on the page
function searchTodos(e) {
    const searchText = e.target.value.toLowerCase();
    const todos = Array.from(todoList.childNodes);  // Convert NodeList to Array for easier manipulation
    let found = false;  // Flag to detect if we find any todo
    const searchMessage = document.getElementById('search-message');  // Get the message element

    todos.forEach(function(todo) {
        const todoText = todo.innerText.toLowerCase();
        if (todoText.includes(searchText)) {
            todo.style.display = 'flex';
            found = true;  // Set found to true if a todo matches the search text
        } else {
            todo.style.display = 'none';
        }
    });

    if (!found && searchText.trim() !== '') {
        searchMessage.style.display = 'block';  // Show the message element
        searchMessage.textContent = "Your search did not match any items.";  // Update the text content
    } else {
        searchMessage.style.display = 'none';  // Hide the message element
    }
}

function updateTodoStatus(todoText, isCompleted) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const index = todos.findIndex(todo => todo.text === todoText);
    if (index !== -1) {
        todos[index].completed = isCompleted;
    }
    localStorage.setItem('todos', JSON.stringify(todos));
}

