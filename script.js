let draggedIndex = null;
        let currentFilter = 'all';

        window.onload = function() {
            renderList();
        };

        function addTask() {
            const taskInput = document.getElementById('taskInput');
            const taskP = document.getElementById('taskP');
            const taskText = taskInput.value.trim();
            const taskPriority = taskP.value.trim();

            if(taskText === ''){
                alert('Task is empty');
                return;
            }

            list.push({
                title: taskText,
                priority: taskPriority || 'Normal',
                completed: false
            });

            console.log(list);
            renderList();
            taskInput.value = "";
            taskP.value = "";
        }

        function toggleTask(index) {
            list[index].completed = !list[index].completed;
            renderList();
        }

        function filterTasks(filter) {
            currentFilter = filter;
            renderList();
        }

        function getFilteredList() {
            if (currentFilter === 'all') {
                return list;
            } else if (currentFilter === 'completed') {
                return list.filter(task => task.completed);
            } else if (currentFilter === 'pending') {
                return list.filter(task => !task.completed);
            }
            return list;
        }

        function renderList(){
            const filteredList = getFilteredList();
            let listStr = "";
            
            for(let i = 0; i < filteredList.length; i++){
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
            
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = listStr;
            
            // Add drag event listeners to all task items
            addDragListeners();
        }

        function addDragListeners() {
            const taskItems = document.querySelectorAll('.task-item');
            
            taskItems.forEach((item, index) => {
                // Drag start
                item.addEventListener('dragstart', (e) => {
                    draggedIndex = parseInt(e.target.dataset.index);
                    e.target.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/html', e.target.outerHTML);
                });

                // Drag end
                item.addEventListener('dragend', (e) => {
                    e.target.classList.remove('dragging');
                    // Remove drag-over class from all items
                    taskItems.forEach(item => item.classList.remove('drag-over'));
                });

                // Allow drop on other task items
                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                });

                item.addEventListener('dragenter', (e) => {
                    e.preventDefault();
                    if (draggedIndex !== parseInt(e.target.closest('.task-item').dataset.index)) {
                        e.target.closest('.task-item').classList.add('drag-over');
                    }
                });

                item.addEventListener('dragleave', (e) => {
                    e.target.closest('.task-item').classList.remove('drag-over');
                });

                // Handle drop on task items (reorder)
                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    e.target.classList.remove('drag-over');
                    
                    const targetIndex = parseInt(e.target.closest('.task-item').dataset.index);
                    
                    if (draggedIndex !== null && draggedIndex !== targetIndex) {
                        // Reorder the tasks
                        const draggedTask = list[draggedIndex];
                        list.splice(draggedIndex, 1);
                        list.splice(targetIndex, 0, draggedTask);
                        
                        renderList();
                    }
                    
                    draggedIndex = null;
                });
            });
        }

        function deleteTask(index) {
            list.splice(index, 1); 
            console.log(list);  
            renderList();
        }

        // Drop zone functionality
        const dropZone = document.getElementById('dropZone');

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', (e) => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            
            if (draggedIndex !== null) {
                // Delete the dragged task
                list.splice(draggedIndex, 1);
                renderList();
                draggedIndex = null;
            }
        });

        // Allow Enter key to add tasks
        document.getElementById('taskInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        document.getElementById('taskP').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });