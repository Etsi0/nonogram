import { ctx } from "./environment";
import { images, size } from "./setting";
import { GetWorkareaDimensions, PercentageToPixels } from "./util";

const MAX_HEALTH = 3;
export let current: number;

export function reset() {
	current = MAX_HEALTH
}

export function decrease() {
	current--;
}

export function draw() {
	const workarea = GetWorkareaDimensions();

	for (let i = 0; i < MAX_HEALTH; i++) {
		const offset = (workarea.width - PercentageToPixels(size.healthBar) * MAX_HEALTH - PercentageToPixels(size.healthBar / 2) * (MAX_HEALTH - 1)) / 2;
		ctx.drawImage(
			images[`Heart_${i <= current - 1 ? 'filled' : 'empty'}`],
			workarea.x + offset + PercentageToPixels(size.healthBar + size.healthBar / 2) * i,
			workarea.y,
			PercentageToPixels(size.healthBar),
			PercentageToPixels(size.healthBar)
		);
	}
}