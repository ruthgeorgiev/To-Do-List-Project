//selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");



//Event Listeners
todoButton.addEventListener('click', addTodo);
todoList.addEventListener("click", deleteCheck);



//Functions
function addTodo(event){
    event.preventDefault(); // Prevent form from submitting

    // Todo DIV
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // Create LI
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value; // Ensure todoInput is defined elsewhere
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // Check MARK BUTTON
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    // Check TRASH BUTTON
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    // Check EDIT BUTTON
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    editButton.classList.add("edit-btn");
    todoDiv.appendChild(editButton);

    // Append TO LIST
    todoList.appendChild(todoDiv); // Ensure todoList is defined elsewhere

    //Clear Todo INPUT VALUE
    todoInput.value = "";

}

function deleteCheck(e) {
    let item = e.target;

    // Adjust the target if the click came from an icon inside a button
    if (item.classList.contains('fas') || item.classList.contains('fa-check') || item.classList.contains('fa-trash') || item.classList.contains('fa-pen-to-square')) {
        item = item.closest('button');
    }

    // DELETE TODO
    if (item.classList.contains("trash-btn")) {
        const todo = item.closest('.todo');
        todo.remove();
    }

    // TOGGLE COMPLETE
    else if (item.classList.contains("complete-btn")) {
        const todo = item.closest('.todo');
        todo.remove();
    }

    // EDIT TODO
    else if (item.classList.contains("edit-btn")) {
        const todoItem = item.closest('.todo').querySelector(".todo-item");
        
        // Create an input field for editing
        const input = document.createElement("input");
        input.type = "text";
        input.value = todoItem.innerText;
        input.classList.add("todo-item-edit");

        // Replace the todo item's text with the input field
        todoItem.innerHTML = "";
        todoItem.appendChild(input);
        input.focus();

        // Save the changes on blur
        input.addEventListener("blur", function() {
            saveTodoChanges(todoItem, input.value);
        });

        // Save changes on enter key press
        input.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                saveTodoChanges(todoItem, input.value);
                input.blur(); // End editing
            }
        });
    }
}

function saveTodoChanges(todoItem, newValue) {
    // Replace the input field with updated text
    todoItem.innerText = newValue;
}


    
