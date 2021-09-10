export const insertionSort = arr => {
    if (arr.length === 1) return arr;

    const sortedArr = [...arr];
    const animations = []
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