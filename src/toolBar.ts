import { mouse } from "./click.js";
import { ctx } from "./environment.js";
import { images, size, variables } from "./setting.js";
import { getColor, GetWorkareaDimensions, isInside, PercentageToPixels } from "./util.js";

export type TTool = 'Pen' | 'Eraser' | 'Hint';
export let current: TTool = 'Pen';

const iconSize = size.toolBar * 0.75;

let workarea = GetWorkareaDimensions();
let offset = (workarea.width - PercentageToPixels(size.toolBar) * 2 - PercentageToPixels(size.toolBar / 2) * (2 - 1)) / 2;

export function setTool(tool: TTool) {
	current = tool;
}

export function draw() {
	workarea = GetWorkareaDimensions();
	offset = (workarea.width - PercentageToPixels(size.toolBar) * 2 - PercentageToPixels(size.toolBar / 2) * (2 - 1)) / 2;

	getColor(0.5);
	ctx.beginPath();
	ctx.roundRect(
		workarea.x + offset + PercentageToPixels(size.toolBar + size.toolBar / 2) * 0,
		workarea.y + workarea.height - PercentageToPixels(size.toolBar),
		PercentageToPixels(size.toolBar * 2 + size.toolBar / 2),
		PercentageToPixels(size.toolBar),
		PercentageToPixels(1.75)
	);
	ctx.fill();

	getColor(1);
	ctx.beginPath();
	ctx.roundRect(
		workarea.x + offset + PercentageToPixels(size.toolBar + size.toolBar / 2) * (current === 'Pen' ? 0 : 1),
		workarea.y + workarea.height - PercentageToPixels(size.toolBar),
		PercentageToPixels(size.toolBar),
		PercentageToPixels(size.toolBar),
		PercentageToPixels(1.75)
	);
	ctx.fill();

	ctx.drawImage(
		images.Pen,
		workarea.x + offset + PercentageToPixels(iconSize * 33/200) + PercentageToPixels(size.toolBar + size.toolBar) * 0,
		workarea.y + workarea.height - PercentageToPixels(iconSize * (1+33/200)),
		PercentageToPixels(iconSize),
		PercentageToPixels(iconSize)
	);

	ctx.drawImage(
		images.X,
		workarea.x + offset + PercentageToPixels(iconSize * 33/200) + PercentageToPixels(size.toolBar + size.toolBar / 2) * 1,
		workarea.y + workarea.height - PercentageToPixels(iconSize * (1+33/200)),
		PercentageToPixels(iconSize),
		PercentageToPixels(iconSize)
	);
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
			current = current === 'Pen' ? 'Eraser' : 'Pen';
		}
	}
}

export function reset() {
	current = 'Pen';
}