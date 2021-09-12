export const insertionSort = arr => {
    if (arr.length === 1) return arr;

    const sortedArr = [...arr];
    const animations = [];
    for (let i = 1; i < sortedArr.length; i++) {
        const temp = sortedArr[i];
        let j = i-1;
        const ogJ = j;
        while (j >= 0 && sortedArr[j] > temp) {
            sortedArr[j+1] = sortedArr[j]
            j--;
        }
        sortedArr[j+1] = temp;
        if (ogJ === j) continue;
        animations.push({start: i,
                         end: j+1})
    }
    const result = {sortedArray: sortedArr,
                    animations: animations};
    return result;
}

const findMin = (start, arr) => {
    let min = Number.MAX_SAFE_INTEGER;
    let minIdx = 0;
    for (let i = start; i < arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i];
            minIdx = i;
        }
    }
    return minIdx;
}

export const selectionSort = arr => {
    if (arr.length === 1) return arr;
    
    const sortedArr = [...arr];
    const animations = [];

    for (let i = 0; i < sortedArr.length; i++) {
        const minIdx = findMin(i, sortedArr);
        const minVal = sortedArr[minIdx];
        sortedArr[minIdx] = sortedArr[i];
        sortedArr[i] = minVal;
        animations.push({left:i, 
                         right: minIdx})
    }

    return {sortedArray: sortedArr,
            animations: animations}
}