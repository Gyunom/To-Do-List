// --- script.js has started ---
console.log('--- script.js has started ---');
// -----------------------------

const todoInput = document.getElementById('todo-input');
console.log('--- Got todoInput ---', todoInput); // Log 1

const addTodoBtn = document.getElementById('add-todo-btn');
console.log('--- Got addTodoBtn ---', addTodoBtn); // Log 2

const todoList = document.getElementById('todo-list');
console.log('--- Got todoList ---', todoList); // Log 3

const pwaInstallButton = document.getElementById('pwa-install-button');
console.log('--- Got pwaInstallButton ---', pwaInstallButton); // Log 4


// --- Log after ALL individual selections ---
console.log('--- Finished ALL element selections ---', {
    todoInput: !!todoInput, // Logs true if element found, false if null
    addTodoBtn: !!addTodoBtn,
    todoList: !!todoList,
    pwaInstallButton: !!pwaInstallButton
});
// ------------------------------------------------------------


let deferredPrompt = null; // Variable to store the beforeinstallprompt event

// Listen for the beforeinstallprompt event
// This event fires when the browser is ready to show the install prompt
window.addEventListener('beforeinstallprompt', (event) => {
    console.log('--- inside beforeinstallprompt listener ---'); // Diagnostic log
    // Prevent the default browser prompt (we want our button to trigger it)
    event.preventDefault();

    // Stash the event so it can be triggered later when the user clicks our button.
    deferredPrompt = event;

    // --- REMOVED: pwaInstallButton.style.display = 'inline-block'; ---
    // The button is now visible by default, we don't need to show it here.

    console.log('beforeinstallprompt fired and saved. deferredPrompt is now available.'); // Diagnostic log
});

// Event listener for your custom install button
// This fires when the user clicks the 'Install App' button
// Added check here to prevent error if pwaInstallButton is null
if (pwaInstallButton) {
    pwaInstallButton.addEventListener('click', async () => {
        console.log('--- PWA install button clicked ---'); // Diagnostic log

        // --- HIDE THE BUTTON *AFTER* IT'S CLICKED ---
        // (Because the prompt is now shown)
        pwaInstallButton.style.display = 'none';
        // ------------------------------------------


        if (deferredPrompt) {
            // Show the browser's installation prompt using the stashed event
            deferredPrompt.prompt();
            console.log('Installation prompt shown.'); // Diagnostic log

            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;

            // --- Corrected console.log using backticks ---
            console.log(`User response to the install prompt: ${outcome}`);
            // --------------------------------------------

            // We've used the prompt, so clean up the deferredPrompt variable
            deferredPrompt = null;

        } else {
             // If deferredPrompt is null here, it means the beforeinstallprompt event
             // never fired. This might happen if the browser doesn't support the event,
             // or if the PWA is already installed (though we checked that),
             // or if heuristics prevent it, or if the user installed via the browser's menu.
            console.log('beforeinstallprompt event was not captured, programmatic install not available.'); // Diagnostic log
            alert('The app cannot be installed right now. Look for the "Install" option in your browser\'s menu if available.'); // Guide user to manual install
        }
    });
} else {
    console.log('PWA install button not found in HTML, cannot add click listener.'); // Diagnostic log if button element is missing
}


// Listen for the appinstalled event
// This event fires when the PWA is successfully installed (regardless of how)
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed.'); // Diagnostic log
    // Hide the install button after the app is successfully installed (redundant if hidden on click, but safe)
    if (pwaInstallButton) {
        pwaInstallButton.style.display = 'none';
    }
    // Clear the deferredPrompt variable as it's no longer needed
    deferredPrompt = null;
});

// --- To-Do List Functionality ---

// Load tasks from localStorage when the page loads
// This listener runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('--- DOMContentLoaded fired ---'); // Diagnostic log
    loadTasks();
});

// Event listener for the Add button
// Added check here to prevent error if addTodoBtn is null
if (addTodoBtn) {
    addTodoBtn.addEventListener('click', addTask);
} else {
     console.log('Add button not found in HTML, cannot add click listener.'); // Diagnostic log
}


// Allow adding task by pressing Enter in the input field
// Added check here to prevent error if todoInput is null
if (todoInput) {
    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });
} else {
    console.log('Todo input not found in HTML, cannot add keypress listener.'); // Diagnostic log
}


// Function to add a new task
function addTask() {
    console.log('--- addTask function called ---'); // Diagnostic log
    // Check if todoInput was found before accessing its value
    const taskText = todoInput ? todoInput.value.trim() : '';

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    // Get tasks from localStorage, add the new one, and save back
    const tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
    tasks.push(taskText); // Store task as a string
    localStorage.setItem('todoTasks', JSON.stringify(tasks));

    // Clear input (check if todoInput was found)
    if (todoInput) {
       todoInput.value = '';
    }


    // Refresh the displayed list
    loadTasks();
}

// Function to load and display tasks from localStorage
function loadTasks() {
    console.log('--- loadTasks function called ---'); // Diagnostic log
    const tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
    // Check if todoList was found before trying to modify its innerHTML
    if (todoList) {
        todoList.innerHTML = ''; // Clear current list

        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            // Store the index as a data attribute for easy deletion
            listItem.innerHTML = `
                <span>${task}</span>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            todoList.appendChild(listItem);
        });

        // Add event listeners to the new delete buttons
        addDeleteListeners();
    } else {
         console.log('Todo list element not found in HTML, cannot load tasks.'); // Diagnostic log
    }
}

// Function to add event listeners to dynamically created buttons
function addDeleteListeners() {
    console.log('--- addDeleteListeners function called ---'); // Diagnostic log
    // Check if todoList was found before querying it
    if (todoList) {
        todoList.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                console.log('--- Delete button clicked ---'); // Diagnostic log
                // Get the index from the data attribute
                const indexToDelete = event.target.getAttribute('data-index');

                // Get tasks from localStorage, remove the task, and save back
                const tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
                // Use splice to remove the item at the specific index
                tasks.splice(indexToDelete, 1);
                localStorage.setItem('todoTasks', JSON.stringify(tasks));

                // Refresh the list
                loadTasks(); // Reloads the entire list to update indices
            });
        });
    } else {
        console.log('Todo list element not found for delete listeners.'); // Diagnostic log
    }
}


// --- Service Worker Registration ---
// This code attempts to register the service worker script
console.log('--- About to add Service Worker listener block ---'); // Diagnostic log just before SW block
if ('serviceWorker' in navigator) {
    console.log('--- Browser supports Service Worker ---'); // Diagnostic log
    window.addEventListener('load', () => {
        console.log('--- Window load event fired, attempting SW registration ---'); // Diagnostic log

        // Check if a service worker is already controlling the page
        if (navigator.serviceWorker.controller) {
            console.log('--- Page already controlled by a Service Worker ---');
        }

        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registration successful with scope:', registration.scope); // Success log
                // You can add listeners here for state changes if needed
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    installingWorker.onstatechange = () => {
                        console.log(`Service Worker state change: ${installingWorker.state}`);
                         // Optional: Add a prompt here for users to update when 'installed'
                    }
                }
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error); // Failure log
            });
    });
} else {
    console.log('Service Worker not supported in this browser.'); // Diagnostic log if not supported
}
// --- End Service Worker Registration ---