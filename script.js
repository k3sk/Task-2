// Wait for DOM to load before doing anything
// (learned this the hard way after wondering why nothing worked)
// TODO: Maybe add a loading spinner here? Would look fancy!
document.addEventListener('DOMContentLoaded', () => {
    // Sometimes I forget why I put this here... but it works!
    // Grab all the DOM elements we need
    // TODO: Maybe use querySelector instead? But getElementById is faster...
    // DOM elements - naming these is always a struggle
    const taskInput = document.getElementById('taskInput');        // where users type new tasks
    const addTaskBtn = document.getElementById('addTask');        // the big purple button (love this color!)
    const taskList = document.getElementById('taskList');         // where magic happens
    const searchInput = document.getElementById('searchInput');   // for finding that one task you forgot about
    const filterCategory = document.getElementById('filterCategory');  // work/personal/etc
    // FIXME: Maybe consolidate these selectors later?
    
    // More elements - keeping these grouped logically
    const taskCategory = document.getElementById('taskCategory');
    const taskPriority = document.getElementById('taskPriority');  // high/medium/low
    const taskDueDate = document.getElementById('taskDueDate');   // when procrastination ends
    
    // Stats tracking - people love seeing numbers go up!
    const totalTasks = document.getElementById('totalTasks');
    const completedTasks = document.getElementById('completedTasks');
    const pendingTasks = document.getElementById('pendingTasks');  // the guilty reminder

    // Load saved tasks from localStorage (or start fresh if nothing's there)
    // Note to self: Remember to clear localStorage when testing new features!
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];  // the heart of our app
    // Note: localStorage can be weird sometimes, might need error handling here

    // Update those satisfying stats
    // FIXME: This runs a lot - might need to optimize if task list gets huge
    // This could probably be optimized but it works for now
const updateStats = () => {
        const total = tasks.length;  // easy peasy
        const completed = tasks.filter(task => task.completed).length;  // array methods ftw
        const pending = total - completed;  // basic math still works!

        // Update the display - template literals make this so clean
        totalTasks.textContent = `Total: ${total}`;
        completedTasks.textContent = `Completed: ${completed}`;
        pendingTasks.textContent = `Pending: ${pending}`;  // the number that never seems to hit zero
    };

    // Save tasks to local storage
    // Saving to localStorage - wish this was more reliable
const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateStats();
    };

    // Create task element
    // Building task elements - this took way too many tries to get right
const createTaskElement = (task) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        if (task.completed) taskItem.classList.add('completed');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = task.completed;

        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = task.text;

        const taskMeta = document.createElement('div');
        taskMeta.className = 'task-meta';

        const categorySpan = document.createElement('span');
        categorySpan.className = `task-category category-${task.category}`;
        categorySpan.textContent = task.category;

        const prioritySpan = document.createElement('span');
        prioritySpan.className = `task-priority priority-${task.priority}`;
        prioritySpan.textContent = task.priority;

        const dueDateSpan = document.createElement('span');
        dueDateSpan.className = 'task-due-date';
        dueDateSpan.textContent = task.dueDate;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';

        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            taskItem.classList.toggle('completed');
            saveTasks();
        });

        deleteBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t !== task);
            taskList.removeChild(taskItem);
            saveTasks();
        });

        taskMeta.appendChild(categorySpan);
        taskMeta.appendChild(prioritySpan);
        taskMeta.appendChild(dueDateSpan);
        taskMeta.appendChild(deleteBtn);

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskTextSpan);
        taskItem.appendChild(taskMeta);

        return taskItem;
    };

    // Add task function
    // Adding new tasks - the core functionality!
const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const task = {
            id: Date.now(),
            text: taskText,
            category: taskCategory.value,
            priority: taskPriority.value,
            dueDate: taskDueDate.value,
            completed: false
        };

        tasks.push(task);
        taskList.appendChild(createTaskElement(task));
        saveTasks();

        // Clear inputs
        taskInput.value = '';
        taskInput.focus();
        taskDueDate.value = '';
    };

    // Filter tasks
    // Filtering tasks - this could use some debouncing maybe?
const filterTasks = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = filterCategory.value;

        taskList.innerHTML = '';
        tasks.forEach(task => {
            if (
                task.text.toLowerCase().includes(searchTerm) &&
                (selectedCategory === 'all' || task.category === selectedCategory)
            ) {
                taskList.appendChild(createTaskElement(task));
            }
        });
    };

    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    searchInput.addEventListener('input', filterTasks);
    filterCategory.addEventListener('change', filterTasks);

    // Initialize
    tasks.forEach(task => taskList.appendChild(createTaskElement(task)));
    updateStats();
});