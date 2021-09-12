import react from 'react'
import * as SortingAlgorithms from './SortingAlgorithms'

class SortingVisualizer extends react.Component {
    constructor() {
        super();
        this.state = {
            speed: 100,
            nums: []
        }
    }

    componentDidMount() {
        this.generateNewNums()
    }

    generateNewNums() {
        let numsArr = [];
        for (let i = 0; i < 100; i++) {
            numsArr.push(Math.floor(Math.random() * 600 + 5))
        };
        this.setState({speed: this.state.speed,
                        nums: numsArr});
    }

    // HELPER FUNCTIONS

    // Checks if arr1 is equal to arr2
    arraysAreEqual(arr1, arr2) {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    // for async functions, to perform function calls sequentially, 
    // waiting for one to finish before doing another
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // tests sorting algorithms 100 times
    testSortingAlgorithm() {
        for (let i = 0; i < 100; i++) {
            const arr = []
            for (let j = 0; j < 1000; j++) {
                arr.push(Math.floor(Math.random() * 600 + 5))
            } 
            const jsSorted = [...arr].sort((a,b) => {return a-b})
            // const insertionSorted = SortingAlgorithms.insertionSort(arr).sortedArray
            const selectionSorted = SortingAlgorithms.selectionSort(arr).sortedArray
            if (this.arraysAreEqual(jsSorted, selectionSorted)) {
                console.log("true");
            } else 
            console.log("false");
        };
    }

    // HELPER FUNCTIONS END



    // ANIMATION HELPERS
    
    // swaps two items in array depending on direction
    step(direction, i, arr) {
        if (direction === "left") {
            const temp = arr[i];
            arr[i] = arr[i-1];
            arr[i-1] = temp;
        }
        if (direction === "right") {
            const temp = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = temp;
        }
    }

    // animate pushing 1 bar to left
    async stepDown(start, end, bars) {
        const numsArr = [...this.state.nums];
        for (let i = start; i > end; i--) {
            // hightlight bar to be moved down
            bars[i].style.backgroundColor = 'black';
            await this.sleep((100 - this.state.speed)/2);
            // change bar back to normal color
            bars[i].style.backgroundColor = '#ECD6A2';
            // step left (down)
            this.step("left", i, numsArr)
            // render change
            this.setState({speed: this.state.speed,
                           nums: numsArr});
        }

        return new Promise(resolve => setTimeout(resolve, this.sleep((100 - this.state.speed)/2)));
    }

    async swap(left, right, bars) {
        const numsArr = [...this.state.nums];
        // step down
        let j = left;
        let i = right

        while (i !== left) {
            // highlight bars to be swapped
            bars[i].style.backgroundColor = 'black';
            bars[j].style.backgroundColor = 'black';
            await this.sleep((100 - this.state.speed)/4);
            // change bars back to normal color
            bars[i].style.backgroundColor = '#ECD6A2';
            bars[j].style.backgroundColor = '#ECD6A2';
            // when both bars will colide in next step

            if (i === j + 2 && i > j) {
                let temp = numsArr[i];
                numsArr[i] = numsArr[j];
                numsArr[j] = temp;
                i -= 2;
                j += 2;
                this.setState({speed: this.state.speed,
                    nums: numsArr});
                continue
            }
            // when bars are beside each other
            else if (i === j+1) {
                // push right num left
                this.step("left", i, numsArr);
            } else {
                // push right num left
                this.step("left", i, numsArr);
                // push left num right
                this.step("right", j, numsArr);
            }
            i--
            j++;
            this.setState({speed: this.state.speed,
                           nums: numsArr});
        }

        // if j not in right spot push j until in right spot
        while (j !== right) {
            bars[j].style.backgroundColor = 'black';
            await this.sleep((100 - this.state.speed)/4);
            bars[j].style.backgroundColor = '#ECD6A2';
            const temp = numsArr[j];
            numsArr[j] = numsArr[j+1];
            numsArr[j+1] = temp;
            j++;
            this.setState({speed: this.state.speed,
                nums: numsArr});
        }

        return new Promise(resolve => setTimeout(resolve, this.sleep((100 - this.state.speed)/4)));
    }

    // ANIMATION HELPERS END

    // SELECTION SORT ANIMATIONS

    async animateSelectionSort(animations, bars) {
        for (let i = 0; i < animations.length; i++) {
            await this.swap(animations[i].left, animations[i].right, bars);
        }
        // await this.swap(animations[0].left, animations[0].right, bars);
    }

    selectionSort() {
        const selectionSorted = SortingAlgorithms.selectionSort(this.state.nums)
        const jsSorted = [...this.state.nums].sort((a,b) => a-b)
        
        if (this.arraysAreEqual(selectionSorted.sortedArray, jsSorted)) {
            const bars = document.getElementsByClassName('bar');
            const animations = selectionSorted.animations;
            this.animateSelectionSort(animations, bars);
        }
    }

    // SELECTION SORT ANIMATIONS END


    // INSERTION SORT ANIMATIONS

    // driver function for insertion sort animation
    async animateInsertionSort(animations, bars) {
        for (let i = 0; i < animations.length; i++) {
            await this.stepDown(animations[i].start, animations[i].end, bars);
        }
    }

    // sorts arrays using insertion sort, checks if the sort is correct,
    // then calls animationInsertionSort and passes animations to do
    insertionSort() {
        const insertionSorted = SortingAlgorithms.insertionSort(this.state.nums)
        const jsSorted = [...this.state.nums].sort((a,b) => a-b)
        
        if (this.arraysAreEqual(insertionSorted.sortedArray, jsSorted)) {
            const bars = document.getElementsByClassName('bar');
            const animations = insertionSorted.animations;
            this.animateInsertionSort(animations, bars);
        }
    }

    // INSERTION SORT ANIMATIONS END


    // RENDERING 
    
    render() {
        return (
            <div className="bars">
                {this.state.nums.map((num,i) => {
                    return (
                        <div className="bar" key={i} style={{height: `${num}px`}}>
                        </div>
                    )
                })}
                <button onClick={() => this.generateNewNums()}>Reset</button>
                <button onClick={() => this.insertionSort()}>Insertion Sort</button>
                <button onClick={() => this.selectionSort()}>Selection Sort</button>
                <button onClick={() => this.testSortingAlgorithm()}>Test</button>
            </div>
        )
    }
}

export default SortingVisualizer