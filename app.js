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

// FUNCTION ADDTODO
function addTodo(event) {
    event.preventDefault();
    const urgency = document.querySelector(".todo-urgency").value;
    const todoText = todoInput.value;
    const date = todoDate.value ?? "";

    if (todoText == "") {
        alert("Todo description can't be empty");
        return 
    }

    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo", urgency);
    const newTodo = document.createElement("li");

    const dateSpan = document.createElement("span");
        if (date) {  // Check if there is a date to display
            dateSpan.innerText = `Due: ${date}`;  // Format and set date text
            dateSpan.classList.add("todo-date-inner");  // Add a class for styling if needed
        }

    newTodo.innerText = todoText;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    todoDiv.appendChild(dateSpan);
    saveLocalTodos(todoText, date, false); // Initially, the todo is not completed
    appendButton(todoDiv, 'complete-btn', '<i class="fas fa-check"></i>', markComplete);
    appendButton(todoDiv, 'trash-btn', '<i class="fas fa-trash"></i>', deleteTodo);
    appendButton(todoDiv, 'edit-btn', '<i class="fa-solid fa-pen-to-square"></i>', editTodo);
    todoList.appendChild(todoDiv);
    todoInput.value = "";
    todoDate.value = "";
}

//FUNCTION APPENDBUTTON
function appendButton(parent, className, innerHTML, eventListener) {
    const button = document.createElement("button");
    button.innerHTML = innerHTML;
    button.classList.add(className);
    button.addEventListener('click', eventListener);
    parent.appendChild(button);
}

//FUNCTION MARKCOMPLETE
function markComplete(e) {
    const todoDiv = e.target.parentElement;
    const todoItem = todoDiv.querySelector(".todo-item");
    const wasCompleted = todoDiv.classList.toggle("completed");
    updateTodoStatus(todoItem.id, wasCompleted);
}

//FUNCTION DELETETODO
function deleteTodo(e) {
    const todo = e.target.parentElement;
    todo.classList.add("fall");
    removeLocalTodos(todo);
    todo.addEventListener('transitionend', function() {
        todo.remove();
    });
}

//FUNCTION EDITTODO
function editTodo(e) {
    const todoDiv = e.target.closest('.todo');
    const todoItem = todoDiv.querySelector(".todo-item");
    const oldText = todoItem.innerText;  // Capture the old text for reference
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("todo-item-edit");
    input.value = oldText;

    todoItem.replaceWith(input);
    input.focus();

    input.addEventListener("blur", function() {
        const newText = input.value;  // Correctly capturing the new text from the input field
        todoItem.innerText = newText;  // Update the inner text of the todo item element
        input.replaceWith(todoItem);

        // Ensure todoItem.id is captured correctly, might need to ensure this is correctly assigned
        const todoId = todoItem.id;  // Assuming ID is stored as a data attribute
        editLocalTodos(todoId, newText);  // Only pass ID and new text
    });

    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            input.blur();  // Triggers the blur event handler, which handles updating
        }
    });
}


//FUNCTION FILTERTODO
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

//FUNCTION SAVELOCALTODOS
function saveLocalTodos(todoText, date, isCompleted) {
    let index = Math.floor(Math.random() * 100)
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push({id: index, text: todoText, date: date, completed: isCompleted});
    localStorage.setItem('todos', JSON.stringify(todos));
}


//FUNCTION GETTODOS
function getTodos() {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todoObj => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        if (todoObj.completed) {
            todoDiv.classList.add("completed");
        }

        const newTodo = document.createElement("li");
        newTodo.innerText = todoObj.text;  // Set text only here
        newTodo.id = todoObj.id;
        newTodo.classList.add("todo-item");

        // Create a new span element for the date
        const dateSpan = document.createElement("span");
        if (todoObj.date) {  // Check if there is a date to display
            dateSpan.innerText = `Due: ${todoObj.date}`;  // Format and set date text
            dateSpan.classList.add("todo-date-inner");  // Add a class for styling if needed
        }

        // Append the newTodo and dateSpan to todoDiv
        todoDiv.appendChild(newTodo);
        todoDiv.appendChild(dateSpan);  // This keeps the date text separate from the todo text

        // Append buttons for complete, delete, edit actions
        appendButton(todoDiv, 'complete-btn', '<i class="fas fa-check"></i>', markComplete);
        appendButton(todoDiv, 'trash-btn', '<i class="fas fa-trash"></i>', deleteTodo);
        appendButton(todoDiv, 'edit-btn', '<i class="fa-solid fa-pen-to-square"></i>', editTodo);

        // Append the entire todoDiv to the main todo list container
        todoList.appendChild(todoDiv);
    });
}






//FUNCTION REMOVELOCALTODOS
function removeLocalTodos(todo) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoText = todo.querySelector(".todo-item").innerText;
    todos = todos.filter(todoObj => todoObj.text !== todoText);
    localStorage.setItem('todos', JSON.stringify(todos));
}


//FUNCTION EDITLOCALTODOS
function editLocalTodos(todoId, newText) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let found = false;  // Flag to track if the todo item is found

    // Iterate over each todo item to find a match by id
    todos.forEach(todo => {
        if (Number(todo.id) === Number(todoId)) {
            console.log(`Updating todo from "${todo.text}" to "${newText}"`);  // Log the old and new values
            todo.text = newText;  // Update the text of the matched todo item only, no other properties
            found = true;  // Set the flag to true since we found and updated the item
        }
    });

    if (found) {
        localStorage.setItem('todos', JSON.stringify(todos));  // Persist the updated todos list
        console.log("Updated todos:", JSON.stringify(todos));  // Optionally log the updated list
    } else {
        console.error("Todo item not found for editing with id:", todoId);  // Log an error if no match was found
    }
}

// FUNCTION SEARCHTODOS
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
        searchMessage.textContent = "Your search did not match any items.😢";  // Update the text content
    } else {
        searchMessage.style.display = 'none';  // Hide the message element
    }
}

//FUNCTION UPDATETODOSSTATUS
function updateTodoStatus(todoId, isCompleted) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let found = false;  // Flag to track if the todo item is found

    // Iterate over each todo item to find a match by id
    todos.forEach(todo => {
        if (Number(todo.id) === Number(todoId)) {
            console.log(`Updating isCompleted status to "${isCompleted}"`);  // Log the old and new values
            todo.completed = isCompleted;  // Update the text of the matched todo item only, no other properties
            found = true;  // Set the flag to true since we found and updated the item
        }
    });

    if (found) {
        localStorage.setItem('todos', JSON.stringify(todos));  // Persist the updated todos list
        console.log("Updated todos:", JSON.stringify(todos));  // Optionally log the updated list
    } else {
        console.error("Todo item not found for editing with id:", todoId);  // Log an error if no match was found
    }
}

