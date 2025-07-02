import { canvas } from './environment.js';

//! Only change this array when the mouse moves or clicks
//! Disable click at the end of the GameLoop so the click gets only triggered on one frame
export const mouse = {
	click: 0,
	x: 0,
	y: 0,
};

function getCanvasCoordinates(clientX: number, clientY: number) {
	const rect = canvas.getBoundingClientRect();
	return {
		x: clientX - rect.left,
		y: clientY - rect.top
	};
}

document.addEventListener('mousemove', (event) => {
	const coords = getCanvasCoordinates(event.clientX, event.clientY);
	mouse.x = coords.x;
	mouse.y = coords.y;
});

document.addEventListener('mousedown', (event) => {
	mouse.click = event.buttons;
});

canvas.addEventListener('touchstart', (event) => {
	event.preventDefault();

	if (event.touches.length > 0) {
		const touch = event.touches[0];
		const coords = getCanvasCoordinates(touch.clientX, touch.clientY);
		mouse.x = coords.x;
		mouse.y = coords.y;
		mouse.click = 1;
	}
}, { passive: false });

canvas.addEventListener('touchmove', (event) => {
	event.preventDefault();

	if (event.touches.length > 0) {
		const touch = event.touches[0];
		const coords = getCanvasCoordinates(touch.clientX, touch.clientY);
		mouse.x = coords.x;
		mouse.y = coords.y;
	}
}, { passive: false });

const ENABLE_DEVTOOLS = false; // Disable devtools just because
document.addEventListener('contextmenu', (event) => {
	if (!ENABLE_DEVTOOLS) {
		event.preventDefault();
	}
});
document.addEventListener('keydown', (event) => {
	if (!ENABLE_DEVTOOLS && event.key === 'F12') {
		event.preventDefault();
	}
});