import { mouse } from "./click";
import { ctx } from "./environment";
import { images, size } from "./setting";
import { Animate, getColor, GetWorkareaDimensions, isInside, PercentageToPixels, TODO } from "./util";

export type TTool = 'Pen' | 'Eraser' | 'Hint';
export let current: TTool = 'Pen';

const iconSize = size.toolBar * 0.75;

let workarea = GetWorkareaDimensions();
let offset = (workarea.width - PercentageToPixels(size.toolBar) * 2 - PercentageToPixels(size.toolBar / 2) * (2 - 1)) / 2;

let hasSwichedTool = false;
export function setTool(tool: TTool) {
	hasSwichedTool = true;
	current = tool;
}

let animation: TODO;
let step: number = 0;
export function draw() {
	const y = workarea.y + workarea.height - PercentageToPixels(size.toolBar);
	workarea = GetWorkareaDimensions();
	offset = (workarea.width - PercentageToPixels(size.toolBar) * 2 - PercentageToPixels(size.toolBar / 2) * (2 - 1)) / 2;
	if (hasSwichedTool) {
		animation = new Animate(300, 'ease-in-out');
	}

	if (animation) {
		step = animation.step();
		switch (current) {
			case 'Pen':
				step = 1 - step;
				break;
		}

		if (animation.isComplete()) {
			animation = undefined;
		}
	}


	getColor(0.5);
	ctx.beginPath();
	ctx.roundRect(
		workarea.x + offset + PercentageToPixels(size.toolBar + size.toolBar / 2) * 0,
		y,
		PercentageToPixels(size.toolBar * 2 + size.toolBar / 2),
		PercentageToPixels(size.toolBar),
		PercentageToPixels(1.75)
	);
	ctx.fill();

	getColor(1);
	ctx.beginPath();
	ctx.roundRect(
		workarea.x + offset + PercentageToPixels(size.toolBar + size.toolBar / 2) * step,
		y,
		PercentageToPixels(size.toolBar),
		PercentageToPixels(size.toolBar),
		PercentageToPixels(1.75)
	);
	ctx.fill();

	ctx.drawImage(
		images.Pen,
		workarea.x + offset + PercentageToPixels(size.toolBar + size.toolBar / 2) * 0 + PercentageToPixels((size.toolBar - iconSize) / 2),
		y + PercentageToPixels((size.toolBar - iconSize) / 2),
		PercentageToPixels(iconSize),
		PercentageToPixels(iconSize)
	);

	ctx.drawImage(
		images.X,
		workarea.x + offset + PercentageToPixels(size.toolBar + size.toolBar / 2) * 1 + PercentageToPixels((size.toolBar - iconSize) / 2),
		y + PercentageToPixels((size.toolBar - iconSize) / 2),
		PercentageToPixels(iconSize),
		PercentageToPixels(iconSize)
	);

	hasSwichedTool = false;
}

export function update() {
	if (isInside(
		workarea.x + offset + PercentageToPixels(size.toolBar + size.toolBar / 2) * 0,
		workarea.y + workarea.height - PercentageToPixels(size.toolBar),
		PercentageToPixels(size.toolBar * 2 + size.toolBar / 2),
		PercentageToPixels(size.toolBar)
	)) {
		document.body.style.cursor = 'pointer';

		if (mouse.click === 1) {
			setTool(current === 'Pen' ? 'Eraser' : 'Pen');
		}
	}
}

export function reset() {
	current = 'Pen';
}