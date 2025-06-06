let list = JSON.parse(localStorage.getItem('tasks')) || [];
let draggedIndex = null;
let currentFilter = 'all';

let isDragging = false;
let draggedElement = null;

window.onload = function () {
    renderList();
};

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskP = document.getElementById('taskP');
    const taskText = taskInput.value.trim();
    const taskPriority = taskP.value.trim();

    if (taskText === '') {
        alert('Task is empty');
        return;
    }

    const newTask = {
        title: taskText,
        priority: taskPriority || 'Normal',
        completed: false
    };

    list.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(list));
    renderList();
    taskInput.value = "";
    taskP.value = "";
    taskInput.focus();
}

function toggleTask(index) {
    list[index].completed = !list[index].completed;
    localStorage.setItem('tasks', JSON.stringify(list));
    renderList();
}

function filterTasks(filter) {
    currentFilter = filter;
    renderList();
}

function getFilteredList() {
    if (currentFilter === 'completed') return list.filter(t => t.completed);
    if (currentFilter === 'pending') return list.filter(t => !t.completed);
    return list;
}

function renderList() {
    const filteredList = getFilteredList();
    let listStr = "";

    for (let i = 0; i < filteredList.length; i++) {
        const originalIndex = list.indexOf(filteredList[i]);
        const completedClass = filteredList[i].completed ? 'completed' : '';
        listStr += `<li draggable="true" data-index="${originalIndex}" class="task-item ${completedClass}">
            <div class="task-header">
                <input type="checkbox" class="task-checkbox" ${filteredList[i].completed ? 'checked' : ''}
                    onchange="toggleTask(${originalIndex})">
                <div class="task-content">
                    <strong>${filteredList[i].title}</strong>
                    <div class="task-priority">Priority: ${filteredList[i].priority}</div>
                </div>
            </div>
        </li>`;
    }

    document.getElementById('taskList').innerHTML = listStr;
    addDragListeners();
}

function addDragListeners() {
    const taskItems = document.querySelectorAll('.task-item');

    taskItems.forEach(item => {
        // Desktop drag
        item.addEventListener('dragstart', (e) => {
            draggedIndex = parseInt(e.target.dataset.index);
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        item.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
            document.querySelectorAll('.task-item').forEach(i => i.classList.remove('drag-over'));
        });

        item.addEventListener('dragover', (e) => e.preventDefault());

        item.addEventListener('dragenter', (e) => {
            e.preventDefault();
            const index = parseInt(e.target.closest('.task-item')?.dataset.index);
            if (index !== draggedIndex) {
                e.target.closest('.task-item').classList.add('drag-over');
            }
        });

        item.addEventListener('dragleave', (e) => {
            e.target.closest('.task-item')?.classList.remove('drag-over');
        });

        item.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetIndex = parseInt(e.target.closest('.task-item').dataset.index);
            if (draggedIndex !== null && draggedIndex !== targetIndex) {
                const draggedTask = list[draggedIndex];
                list.splice(draggedIndex, 1);
                list.splice(targetIndex, 0, draggedTask);
                localStorage.setItem('tasks', JSON.stringify(list));
                renderList();
            }
            draggedIndex = null;
        });

        // --- Touch Events (Mobile Support with visual feedback) ---
        item.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            isDragging = true;
            draggedIndex = parseInt(item.dataset.index);
            draggedElement = item;
        
            // Trigger short vibration
            if (navigator.vibrate) navigator.vibrate(10);
        
            const clone = item.cloneNode(true);
            clone.id = 'drag-clone';
            clone.style.position = 'fixed';
            clone.style.pointerEvents = 'none';
            clone.style.top = `${touch.clientY}px`;
            clone.style.left = `${touch.clientX}px`;
            clone.style.opacity = '0.8';
            clone.style.width = `${item.offsetWidth}px`;
            clone.style.zIndex = 9999;
            clone.style.transform = 'scale(1.03)';
            clone.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
            document.body.appendChild(clone);
        }, { passive: true });
        
        item.addEventListener('touchmove', (e) => {
            if (isDragging) {
                e.preventDefault();
                const touch = e.touches[0];
                const clone = document.getElementById('drag-clone');
                if (clone) {
                    clone.style.top = `${touch.clientY - 30}px`;
                    clone.style.left = `${touch.clientX - clone.offsetWidth / 2}px`;
                }

                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                document.querySelectorAll('.task-item').forEach(i => i.classList.remove('drag-over'));

                if (elementBelow?.closest('.task-item')) {
                    const targetItem = elementBelow.closest('.task-item');
                    if (parseInt(targetItem.dataset.index) !== draggedIndex) {
                        targetItem.classList.add('drag-over');
                    }
                }

                const dropZone = document.getElementById('dropZone');
                const rect = dropZone.getBoundingClientRect();
                dropZone.classList.toggle('drag-over',
                    touch.clientX >= rect.left &&
                    touch.clientX <= rect.right &&
                    touch.clientY >= rect.top &&
                    touch.clientY <= rect.bottom
                );
            }
        }, { passive: false });

        item.addEventListener('touchend', (e) => {
            const clone = document.getElementById('drag-clone');
            if (clone) clone.remove();
        
            if (isDragging && draggedElement) {
                const touch = e.changedTouches[0];
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        
                document.querySelectorAll('.task-item').forEach(i => i.classList.remove('drag-over'));
                const dropZone = document.getElementById('dropZone');
                const rect = dropZone.getBoundingClientRect();
        
                if (
                    touch.clientX >= rect.left &&
                    touch.clientX <= rect.right &&
                    touch.clientY >= rect.top &&
                    touch.clientY <= rect.bottom
                ) {
                    list.splice(draggedIndex, 1);
        
                    // Long vibration for deletion
                    if (navigator.vibrate) navigator.vibrate(50);
                } else if (elementBelow?.closest('.task-item')) {
                    const targetIndex = parseInt(elementBelow.closest('.task-item').dataset.index);
                    if (targetIndex !== draggedIndex) {
                        const [moved] = list.splice(draggedIndex, 1);
                        list.splice(targetIndex, 0, moved);
        
                        // Double-pulse vibration for reorder
                        if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
                    }
                }
        
                localStorage.setItem('tasks', JSON.stringify(list));
                renderList();
            }
        
            isDragging = false;
            draggedIndex = null;
            draggedElement = null;
        }, { passive: true });        
    });
}

// Drop zone logic
const dropZone = document.getElementById('dropZone');
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (draggedIndex !== null) {
        list.splice(draggedIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(list));
        renderList();
        draggedIndex = null;
    }
});

// Enter to add
document.getElementById('taskInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTask();
});
document.getElementById('taskP').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTask();
});
