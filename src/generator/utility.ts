export { Utility };

class Utility {
	static removeFromArray<T>(array: T[], value: T): T[] {
		const index = array.indexOf(value);

		if (index !== -1) {
			array.splice(index, 1);
		}

		return array;
	}

	static getZeroFilledArray(length: number): number[] {
		return new Array(length).fill(0);
	}

	static cloneArray<T>(array: T[]): T[] {
		return array.slice(0);
	}

	static getRandomIntBetween(min: number, max: number): number {
		const minCeil = Math.ceil(min);
		const maxFloor = Math.floor(max);

		return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
	}
}