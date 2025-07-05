export { Utility };
class Utility {
    static removeFromArray(array, value) {
        const index = array.indexOf(value);
        if (index !== -1) {
            array.splice(index, 1);
        }
        return array;
    }
    static getZeroFilledArray(length) {
        return new Array(length).fill(0);
    }
    static cloneArray(array) {
        return array.slice(0);
    }
    static getRandomIntBetween(min, max) {
        const minCeil = Math.ceil(min);
        const maxFloor = Math.floor(max);
        return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
    }
}
//# sourceMappingURL=utility.js.map