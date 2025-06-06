let list = JSON.parse(localStorage.getItem('tasks')) || [];
        let draggedIndex = null;
        let currentFilter = 'all';
        
        // Touch support variables
        let touchStartX = 0;
        let touchStartY = 0;
        let isDragging = false;
        let draggedElement = null;

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

            const newTask = {
                title: taskText,
                priority: taskPriority || 'Normal',
                completed: false
            };

            list.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(list));
            console.log('Task added:', newTask);
            console.log('Current list:', list);
            
            renderList();
            taskInput.value = "";
            taskP.value = "";
            
            // Focus back to input for better mobile UX
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
            console.log('Rendering list, total tasks:', list.length);
            const filteredList = getFilteredList();
            console.log('Filtered list length:', filteredList.length);
            
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
            console.log('Tasks rendered to DOM');
            
            // Add drag event listeners to all task items
            addDragListeners();
        }

        function addDragListeners() {
            const taskItems = document.querySelectorAll('.task-item');
            
            taskItems.forEach((item, index) => {
                // Mouse drag events
                item.addEventListener('dragstart', (e) => {
                    draggedIndex = parseInt(e.target.dataset.index);
                    e.target.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/html', e.target.outerHTML);
                });

                item.addEventListener('dragend', (e) => {
                    e.target.classList.remove('dragging');
                    taskItems.forEach(item => item.classList.remove('drag-over'));
                });

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

                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    e.target.classList.remove('drag-over');
                    
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

                // Touch events for mobile
                item.addEventListener('touchstart', (e) => {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    isDragging = false;
                    draggedElement = null;
                    
                    // Set a timeout to start dragging
                    setTimeout(() => {
                        if (!isDragging) {
                            isDragging = true;
                            draggedIndex = parseInt(item.dataset.index);
                            draggedElement = item;
                            item.classList.add('dragging');
                        }
                    }, 200);
                }, { passive: true });

                item.addEventListener('touchmove', (e) => {
                    if (isDragging && draggedElement) {
                        e.preventDefault();
                        const touch = e.touches[0];
                        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                        
                        // Remove drag-over class from all items
                        taskItems.forEach(item => item.classList.remove('drag-over'));
                        
                        // Add drag-over class to the element below if it's a task item
                        if (elementBelow && elementBelow.closest('.task-item')) {
                            const targetItem = elementBelow.closest('.task-item');
                            const targetIndex = parseInt(targetItem.dataset.index);
                            if (targetIndex !== draggedIndex) {
                                targetItem.classList.add('drag-over');
                            }
                        }
                        
                        // Check if over drop zone
                        const dropZone = document.getElementById('dropZone');
                        const dropZoneRect = dropZone.getBoundingClientRect();
                        if (touch.clientX >= dropZoneRect.left && 
                            touch.clientX <= dropZoneRect.right && 
                            touch.clientY >= dropZoneRect.top && 
                            touch.clientY <= dropZoneRect.bottom) {
                            dropZone.classList.add('drag-over');
                        } else {
                            dropZone.classList.remove('drag-over');
                        }
                    }
                }, { passive: false });

                item.addEventListener('touchend', (e) => {
                    if (isDragging && draggedElement) {
                        const touch = e.changedTouches[0];
                        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                        
                        // Clean up classes
                        draggedElement.classList.remove('dragging');
                        taskItems.forEach(item => item.classList.remove('drag-over'));
                        
                        // Check if dropped on drop zone
                        const dropZone = document.getElementById('dropZone');
                        const dropZoneRect = dropZone.getBoundingClientRect();
                        if (touch.clientX >= dropZoneRect.left && 
                            touch.clientX <= dropZoneRect.right && 
                            touch.clientY >= dropZoneRect.top && 
                            touch.clientY <= dropZoneRect.bottom) {
                            // Delete the task
                            list.splice(draggedIndex, 1);
                            localStorage.setItem('tasks', JSON.stringify(list));
                            renderList();
                            dropZone.classList.remove('drag-over');
                        } else if (elementBelow && elementBelow.closest('.task-item')) {
                            // Reorder tasks
                            const targetItem = elementBelow.closest('.task-item');
                            const targetIndex = parseInt(targetItem.dataset.index);
                            
                            if (draggedIndex !== null && draggedIndex !== targetIndex) {
                                const draggedTask = list[draggedIndex];
                                list.splice(draggedIndex, 1);
                                list.splice(targetIndex, 0, draggedTask);
                                localStorage.setItem('tasks', JSON.stringify(list));
                                renderList();
                            }
                        }
                    }
                    
                    // Reset drag state
                    isDragging = false;
                    draggedIndex = null;
                    draggedElement = null;
                }, { passive: true });
            });
        }

        function deleteTask(index) {
            list.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(list));
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
                list.splice(draggedIndex, 1);
                localStorage.setItem('tasks', JSON.stringify(list));
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