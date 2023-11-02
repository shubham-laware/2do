let date = document.getElementById('date');
let todayDate = new Date().toLocaleDateString();
let container = document.getElementById('container')

localStorage.setItem('dates', todayDate);


date.append(todayDate);

let storedDate = localStorage.getItem('dates')

if (storedDate !== todayDate) {
    localStorage.removeItem('tasks');
    localStorage.removeItem('dates')
}


window.addEventListener('load', displayTasks);


function displayTasks() {

    if (localStorage.getItem('tasks')) {


        let toDoList = document.querySelector('.todo-list');
        toDoList.innerHTML = '';

        let tasks = JSON.parse(localStorage.getItem('tasks'));

        tasks.forEach((task) => {

            let list = document.getElementById('listT');
            let titleList = list.content.cloneNode(true).children[0];
            let titleDiv = titleList.querySelector('.title');
            titleDiv.textContent = task.name;
            titleDiv.setAttribute('id', task.id)
            let noteDiv = titleList.querySelector('.note');
            noteDiv.textContent = task.note;
            toDoList.append(titleList);

            if (task.completed) {
                titleDiv.style.textDecoration = 'line-through'
            }

        });

        optionAction();

    } 

}


const addTaskButton = document.getElementById('add-task-button');

addTaskButton.addEventListener('click', () => {

    addTaskButton.disabled = true;

    let userInputT = document.getElementById('user-inputT');
    let userInput = userInputT.content.cloneNode(true).children[0];

    let inputAppend = document.querySelector('.box2 .todo-box')
    inputAppend.append(userInput);

    let saveButton = userInput.querySelector('#save-button');

    saveButton.addEventListener('click', () => {


        addTaskButton.disabled = true;

        let toDoName = userInput.querySelector('.todo-input').value;
        let toDoNote = userInput.querySelector('.todo-note').value;

        if (toDoName === "" || toDoNote === "") {
            alert('ToDo can\'t be empty');
        } else {

            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

            const task = {
                name: toDoName,
                note: toDoNote,
                completed: false,
                edited: true,
            };

            tasks.push(task);

            localStorage.setItem('tasks', JSON.stringify(tasks));

            addTaskButton.disabled = false;
            inputAppend.removeChild(userInput);

            displayTasks();

        }

    });

    let cancelButton = userInput.querySelector('#cancel-button');
    cancelButton.addEventListener('click', () => {
        inputAppend.removeChild(userInput);
        addTaskButton.disabled = false;
    });
});


function optionAction() {

    let titles = document.querySelectorAll('.title');
    let openOptions = null;

    titles.forEach((title) => {

        let options;
        let completedButton;
        title.addEventListener('click', (event) => {

            options = title.parentElement.querySelector('.options');

            if (options === openOptions) {
                if (options.style.display === 'flex') {
                    options.style.display = 'none';
                } else {
                    options.style.display = 'flex';
                }
            } else {
                if (openOptions) {
                    openOptions.style.display = 'none';
                }

                options.style.display = 'flex';
                options.style.zIndex = '100';
                openOptions = options;
            }
            optionsDisable(title, options);

            completedButton = options.querySelector('.completed');

            completedButton.addEventListener('click', completeOptionHandler)

            let deleteOption = options.querySelector('.delete');

            deleteOption.addEventListener('click', () => {
                delteTask(options)
            })

        });

        function completeOptionHandler() {
            completeOption(options)
            completedButton.removeEventListener('click', completeOption)

        }

    });
}


function completeOption(options) {
    let tasks = JSON.parse(localStorage.getItem('tasks'))

    let optionsParent = options.parentElement;

    let titleToComplete = optionsParent.querySelector('.title').textContent

    let taskTOComplete = tasks.find(task => task.name === titleToComplete)

    taskTOComplete.completed = true;

    let titleToMark = optionsParent.querySelector('.title')

    titleToMark.style.textDecoration = 'line-through'

    localStorage.setItem('tasks', JSON.stringify(tasks))

}

function optionsDisable(title, options) {
    const edit = options.querySelector('.edit');

    if (!edit.hasEventListener) {
        edit.hasEventListener = true;

        edit.addEventListener('click', (event) => {

            edit.clicked = true;
            addTaskButton.disabled = true;

            if (edit.clicked) {

                const addTaskButton = document.getElementById('add-task-button');

                event.stopPropagation()

                const tasks = JSON.parse(localStorage.getItem('tasks'))

                let titleNoteList = title.parentElement;

                let titleToEdit = titleNoteList.querySelector('.title').textContent

                let taskToUpdate = tasks.find(task => task.name === titleToEdit)

                if (taskToUpdate.completed) {
                    alert('You cannot edit a completed task')
                    addTaskButton.disabled = false;
                    edit.disabled = false;
                }
                else {
                    editTask(title, edit, options);
                }

            }
        });

    }

    const optionsClickHandler = (event) => {
        if (!title.contains(event.target) && !edit.contains(event.target)) {
            options.style.display = 'none';
            document.removeEventListener('click', optionsClickHandler)
        }
    };

    document.addEventListener('click', optionsClickHandler);
}

function isEqual(task1, task2) {
    return task1.name === task2.name && task1.note === task2.note
}


function editTask(title, edit, options) {

    let userInputT = document.getElementById('user-inputT')

    let userInput = userInputT.content.cloneNode(true).children[0]


    let titleNoteList = title.parentElement;

    let titleToEdit = titleNoteList.querySelector('.title').textContent

    let noteToEdit = titleNoteList.querySelector('.note').textContent

    let toDoTitle = userInput.querySelector('.todo-input')

    let toDoNote = userInput.querySelector('.todo-note')

    toDoTitle.value = titleToEdit;
    toDoNote.value = noteToEdit

    let inputAppend = document.querySelector('.box2 .todo-box')
    inputAppend.append(userInput);

    const addTaskButton = document.getElementById('add-task-button');

    let saveButton = userInput.querySelector(' .form .input-buttons #save-button')

    saveButton.addEventListener('click', (event) => {
        addTaskButton.disabled = false;
        event.stopPropagation();

        edit.disabled = false

        saveChanges(toDoTitle, toDoNote, titleNoteList, userInput, titleToEdit, inputAppend)
        options.style.display = 'none'


    })

    let cancelButton = userInput.querySelector('#cancel-button')

    cancelButton.addEventListener('click', () => {

        addTaskButton.disabled = false;
        edit.disabled = false
        inputAppend.removeChild(userInput)
        options.style.display = 'none'

    })

}

function saveChanges(toDoTitle, toDoNote, titleNoteList, userInput, titleToEdit, inputAppend) {

    const tasks = JSON.parse(localStorage.getItem('tasks')) || []

    let taskToUpdate = tasks.find(task => task.name === titleToEdit)

    if (taskToUpdate) {

        if (toDoTitle.value === "" || toDoNote.value === "") {
            alert('ToDo can\'t be empty');
        } else {

            taskToUpdate.name = toDoTitle.value;
            taskToUpdate.note = toDoNote.value

            taskToUpdate.completed = false;

            titleNoteList.querySelector('.title').textContent = toDoTitle.value;
            titleNoteList.querySelector('.note').textContent = toDoNote.value;

            taskToUpdate.edited = true


            localStorage.setItem('tasks', JSON.stringify(tasks))
            inputAppend.removeChild(userInput)

        }

    }

}

function delteTask(options) {
    let optionsParent = options.parentElement;
    optionsParent.remove();

    const tasks = JSON.parse(localStorage.getItem('tasks'))

    let titleToDelete = optionsParent.querySelector('.title').textContent

    let noteToDelete = optionsParent.querySelector('.note').textContent

    const taskIndexToDelete = tasks.findIndex(task => task.name === titleToDelete && task.note === noteToDelete);

    if (taskIndexToDelete !== -1) {
        tasks.splice(taskIndexToDelete, 1);

        localStorage.setItem('tasks', JSON.stringify(tasks))
    }
}




