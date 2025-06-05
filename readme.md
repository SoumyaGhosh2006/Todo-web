# Todo Application

A modern, interactive todo list application with drag-and-drop functionality, task prioritization, and filtering capabilities.

## Features

### ✨ Core Functionality
- **Add Tasks**: Create new tasks with custom priorities
- **Task Completion**: Mark tasks as completed with checkboxes
- **Task Filtering**: Filter tasks by All, Completed, or Pending status
- **Local Storage**: Automatically saves tasks to browser storage

### 🎯 Advanced Features
- **Drag & Drop Reordering**: Drag tasks to reorder them in your list
- **Drag to Delete**: Drag tasks to the drop zone to remove them
- **Priority System**: Assign priorities to tasks (defaults to "Normal")
- **Responsive Grid Layout**: Tasks displayed in a 3-column grid
- **Keyboard Support**: Press Enter in input fields to add tasks

### 🎨 Visual Design
- Modern gradient background with floating animations
- Hover effects and smooth transitions
- Color-coded task states (completed tasks have different styling)
- Interactive button animations with shimmer effects

## File Structure

```
todo-app/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript functionality
└── README.md          
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation
1. Clone or download the project files
2. Ensure all three files are in the same directory:
   - `index.html`
   - `styles.css`
   - `script.js`
3. Open `index.html` in your web browser

### Usage

#### Adding Tasks
1. Enter a task description in the "Enter a task" field
2. Optionally, enter a priority in the "Enter priority" field
3. Click the "Add" button or press Enter
4. Tasks will appear in the grid below

#### Managing Tasks
- **Complete a task**: Click the checkbox next to the task
- **Reorder tasks**: Drag and drop tasks to rearrange them
- **Delete tasks**: Drag tasks to the "Drop here to remove" zone
- **Filter tasks**: Use the "Options" dropdown to show All, Completed, or Pending tasks

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradients, animations, and grid layout
- **Vanilla JavaScript**: Pure JavaScript with no external dependencies
- **Local Storage API**: Persistent data storage

### Key Components

#### JavaScript Functions
- `addTask()`: Adds new tasks to the list
- `toggleTask(index)`: Toggles task completion status
- `filterTasks(filter)`: Filters tasks by status
- `renderList()`: Updates the DOM with current tasks
- `addDragListeners()`: Implements drag and drop functionality

#### CSS Features
- Flexbox and Grid layouts for responsive design
- CSS animations and transitions
- Hover effects and interactive states
- Custom scrollbars and styling

### Data Structure
Tasks are stored as objects with the following properties:
```javascript
{
    title: "Task description",
    priority: "High/Normal/Low",
    completed: false
}
```

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Limitations
- Data is stored locally in browser storage (not synced across devices)
- Maximum storage depends on browser limits
- No user authentication or multi-user support

## Future Enhancements
- [ ] Due dates for tasks
- [ ] Task categories/tags
- [ ] Import/Export functionality
- [ ] Dark mode toggle
- [ ] Task search functionality
- [ ] Subtasks support
- [ ] Cloud synchronization

## Contributing
Feel free to fork this project and submit pull requests for any improvements.

## License
This project is open source and available under the MIT License.