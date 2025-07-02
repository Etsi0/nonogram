import { canvas } from './environment.js';

//! Only change this array when the mouse moves or clicks
//! Disable click at the end of the GameLoop so the click gets only triggered on one frame
export const mouse = {
	click: 0,
	x: 0,
	y: 0,
};

// Update mouse position whenever it moves
document.addEventListener('mousemove', (event) => {
	const rect = canvas.getBoundingClientRect();
	mouse.x = event.clientX - rect.left;
	mouse.y = event.clientY - rect.top;
});

// Register player clicks
document.addEventListener('mousedown', (event) => {
	mouse.click = event.buttons;
});

// Disables so the right click menu doesn't popup
const ENABLE_DEVTOOLS = true;
document.addEventListener('contextmenu', (event) => {
	if (!ENABLE_DEVTOOLS) {
		event.preventDefault()
	}
});
document.addEventListener('keydown', (event) => {
	if (!ENABLE_DEVTOOLS && event.key === 'F12') {
		event.preventDefault()
	}
});