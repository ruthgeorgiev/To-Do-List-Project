// Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const todoDate = document.querySelector(".todo-date");
const filterOption = document.querySelector(".filter-todo");

// Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener('click', addTodo);
filterOption.addEventListener('change', filterTodo);

// Functions
function addTodo(event) {
    event.preventDefault(); // Prevent form from submitting

    const urgency = document.querySelector(".todo-urgency").value; // Get urgency level

    // Create todo DIV and add urgency class
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo", urgency); //add urgency as a class

    // Create LI
    const newTodo = document.createElement("li");
    newTodo.innerText = `${todoInput.value} (Due: ${todoDate.value})`; // Text with due date
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // Save to local storage
    saveLocalTodos(todoInput.value + " (Due: " + todoDate.value + ")");

    // Create Complete Button
    appendButton(todoDiv, 'complete-btn', '<i class="fas fa-check"></i>', markComplete);

    // Create Trash Button
    appendButton(todoDiv, 'trash-btn', '<i class="fas fa-trash"></i>', deleteTodo);

    // Create Edit Button
    appendButton(todoDiv, 'edit-btn', '<i class="fa-solid fa-pen-to-square"></i>', editTodo);

    // Append to List
    todoList.appendChild(todoDiv);

    // Clear Todo INPUT VALUE
    todoInput.value = "";
    todoDate.value = ""; // Clear the date input as well
}

function appendButton(parent, className, innerHTML, eventListener) {
    const button = document.createElement("button");
    button.innerHTML = innerHTML;
    button.classList.add(className);
    button.addEventListener('click', eventListener);
    parent.appendChild(button);
}

function markComplete(e) {
    const todo = e.target.parentElement;
    todo.classList.toggle("completed");
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

function saveLocalTodos(todo) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");

        const newTodo = document.createElement("li");
        newTodo.innerText = todo;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);

        appendButton(todoDiv, 'complete-btn', '<i class="fas fa-check"></i>', markComplete);
        appendButton(todoDiv, 'trash-btn', '<i class="fas fa-trash"></i>', deleteTodo);
        appendButton(todoDiv, 'edit-btn', '<i class="fa-solid fa-pen-to-square"></i>', editTodo);

        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todo){
    let todos;
    if (localStorage.getItem("todos") === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    const todoIndex = todo.querySelector(".todo-item").innerText;
    const idx = todos.indexOf(todoIndex);
    if (idx !== -1) {
        todos.splice(idx, 1);
    }
    localStorage.setItem("todos", JSON.stringify(todos));
}

function editLocalTodos(oldText, newText) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    const index = todos.indexOf(oldText);
    if (index !== -1) {
        todos[index] = newText;  // Replace the old text with the new text
    }
    localStorage.setItem("todos", JSON.stringify(todos));
}
