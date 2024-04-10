// Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");


// Event Listeners
todoButton.addEventListener('click', addTodo);

// Add Todo Function
function addTodo(event) {
    event.preventDefault(); // Prevent form from submitting

    // Create todo DIV
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // Create LI
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value; // Get value from input field
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // Create Complete Button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    completedButton.addEventListener('click', markComplete);
    todoDiv.appendChild(completedButton);

    // Create Trash Button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    trashButton.addEventListener('click', deleteTodo);
    todoDiv.appendChild(trashButton);

    // Create Edit Button
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    editButton.classList.add("edit-btn");
    editButton.addEventListener('click', editTodo);
    todoDiv.appendChild(editButton);

    // Append to List
    todoList.appendChild(todoDiv);

    // Clear Todo INPUT VALUE
    todoInput.value = "";
}

// Mark Complete Function
function markComplete(e) {
    const todo = e.target.parentElement;
    todo.classList.toggle("completed");
}

// Delete Todo Function
function deleteTodo(e) {
    const todo = e.target.parentElement;
    todo.addEventListener('transitionend', function(){
        todo.remove();
    });
    todo.classList.add("fall");
}

// Edit Todo Function
// Function to enable editing of a todo item
function editTodo(e) {
    // Step 1: Identify the todo item to edit
    // 'e.target' is what was clicked. '.closest('.todo')' finds the nearest parent todo item.
    const todoDiv = e.target.closest('.todo');
    if (!todoDiv) {
        // If we didn't find a todo item, stop the function.
        return;
    }

    // Find the text part of the todo item to edit
    const todoItem = todoDiv.querySelector(".todo-item");
    if (!todoItem) {
        // If for some reason there's no text, stop the function.
        return;
    }

    // Step 2: Create a new input field to replace the todo text
    const inputElement = document.createElement("input");
    inputElement.type = "text"; // Make it a text field
    inputElement.value = todoItem.innerText; // Pre-fill with current todo text
    inputElement.classList.add("todo-item-edit"); // Add styling class (if you have one)

    // Replace the todo text with this new input field
    todoItem.replaceWith(inputElement);
    inputElement.focus(); // Immediately focus the input for editing

    // Step 3: Define what happens when we're done editing
    const finishEditing = () => {
        // Get the text from the input field, but remove any leading/trailing spaces
        const newText = inputElement.value.trim();

        if (newText) {
            // If there's text, update the todo item with this new text
            todoItem.innerText = newText;
            inputElement.replaceWith(todoItem); // Replace the input field with the updated todo text
        } else {
            // If no text was entered, remove the whole todo item
            todoDiv.remove();
        }
    };

    // When the input field loses focus ('blur' event), finish editing
    inputElement.addEventListener("blur", finishEditing);

    // If the Enter key is pressed while typing, finish editing
    inputElement.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            finishEditing();
        }
    });
}

 