import react from 'react'
import * as SortingAlgorithms from './SortingAlgorithms'
import Slider from './Slider'

const mainColor = "#ECD6A2"
const complimentColor = "#A2B8EC"

class SortingVisualizer extends react.Component {
    constructor() {
        super();
        this.state = {
            busy: false,
            activeSort: "",
            speed: 75,
            nums: []
        }
        this.changeSpeed = this.changeSpeed.bind(this);
    }

    // HELPER FUNCTIONS

    // reset nums
    generateNewNums() {
        if (this.state.busy) return;
        let numsArr = [];
        for (let i = 0; i < 100; i++) {
            numsArr.push(Math.floor(Math.random() * 600 + 30))
        };
        this.setState({
            busy: false,
            speed: this.state.speed,
            nums: numsArr,
            activeSort: this.state.activeSort
        });
    }

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

    changeSpeed(speed) {
        this.setState({
            busy: this.state.busy,
            speed: speed,
            nums: this.state.nums,
            activeSort: this.state.activeSort
        })
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
            await this.sleep((100 - this.state.speed));
            // change bar back to normal color
            bars[i].style.backgroundColor = mainColor;
            // step left (down)
            this.step("left", i, numsArr)
            // render change
            this.setState({
                busy: this.state.busy,
                speed: this.state.speed,
                activeSort: this.state.activeSort,
                nums: numsArr});
        }

        return new Promise(resolve => setTimeout(resolve, this.sleep((100 - this.state.speed)/2)));
    }

    async findMin(left, right, bars) {
        // scan through unsorted list once
        for (let i = left; i < bars.length; i++) {
            bars[i].style.backgroundColor = complimentColor;
            await this.sleep((100 - this.state.speed));
            bars[i].style.backgroundColor = mainColor;
        }

        // go back to min bar
        for (let i = 0; i < 3; i++) {
            bars[right].style.backgroundColor = complimentColor;
            await this.sleep((100 - this.state.speed)*2);
            bars[right].style.backgroundColor = mainColor;
            await this.sleep((100 - this.state.speed)*2);
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
            await this.sleep((100 - this.state.speed)/2);
            // change bars back to normal color
            bars[i].style.backgroundColor = mainColor;
            bars[j].style.backgroundColor = mainColor;
            // when both bars will colide in next step

            if (i === j + 2 && i > j) {
                let temp = numsArr[i];
                numsArr[i] = numsArr[j];
                numsArr[j] = temp;
                i -= 2;
                j += 2;
                this.setState({
                    busy: this.state.busy,
                    speed: this.state.speed,
                    activeSort: this.state.activeSort,
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
            this.setState({
                busy: this.state.busy,
                speed: this.state.speed,
                activeSort: this.state.activeSort,
                nums: numsArr});
        }

        // if j not in right spot push j until in right spot
        while (j !== right) {
            bars[j].style.backgroundColor = 'black';
            await this.sleep((100 - this.state.speed)/2);
            bars[j].style.backgroundColor = mainColor;
            const temp = numsArr[j];
            numsArr[j] = numsArr[j+1];
            numsArr[j+1] = temp;
            j++;
            this.setState({
                busy: this.state.busy,
                speed: this.state.speed,
                activeSort: this.state.activeSort,
                nums: numsArr
            });
        }

        return new Promise(resolve => setTimeout(resolve, this.sleep((100 - this.state.speed)/4)));
    }

    // ANIMATION HELPERS END

    // SELECTION SORT ANIMATIONS

    async animateSelectionSort(animations, bars) {
        this.setState({
            busy: true,
            activeSort: "selection",
            speed: this.state.speed,
            nums: this.state.nums
        });
        for (let i = 0; i < animations.length; i++) {
            await this.findMin(animations[i].left, animations[i].right, bars);
            await this.swap(animations[i].left, animations[i].right, bars);
        }
        this.setState({
            busy: false,
            activeSort: "",
            speed: this.state.speed,
            nums: this.state.nums
        });
    }

    selectionSort() {
        if (this.state.busy) return;
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
        this.setState({
            busy: true,
            speed: this.state.speed,
            nums: this.state.nums,
            activeSort: "insertion"
        });
        for (let i = 0; i < animations.length; i++) {
            await this.stepDown(animations[i].start, animations[i].end, bars);
        }
        this.setState({
            busy: false,
            speed: this.state.speed,
            nums: this.state.nums,
            activeSort: ""
        });
    }

    // sorts arrays using insertion sort, checks if the sort is correct,
    // then calls animationInsertionSort and passes animations to do
    insertionSort() {
        if (this.state.busy) return;
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

    setTitle() {
        if (this.state.activeSort === "insertion") return "Insertion Sort";
        if (this.state.activeSort === "selection") return "Selection Sort";
    }

    setClass(id, type) {
        if (type === "button") {
            if (this.state.activeSort === id) return "active";
            if (this.state.activeSort === "") return "";
            if (this.state.activeSort !== id) return "nonActive";
        }

        if (type === "text") {
            if (this.state.activeSort === id) return "show";
            if (this.state.activeSort !== id) return "noShow";
        }
    }

    componentDidMount() {
        this.generateNewNums()
    }
    
    render() {
        return (
            <div className="sortingUI">
                <div className="navBar">
                    <button className={this.setClass("reset", "button")} onClick={() => {
                        this.generateNewNums()
                    }}>Reset</button>
                    <span id="separator">|</span>
                    <div>
                        <button className={this.setClass("insertion", "button")} id="insertion" onClick={() => {
                            this.insertionSort()
                        }}>Insertion Sort</button>
                        <button className={this.setClass("selection", "button")} id="selection" onClick={() => {
                            this.selectionSort()
                        }}>Selection Sort</button>
                    </div>
                    <span id="separator">|</span>
                    <div id="slider">
                        <label>Speed</label>
                        <Slider speed={this.state.speed} changeSpeed={this.changeSpeed}></Slider>
                    </div>
                </div>
                <div className="bars">
                    {this.state.nums.map((num,i) => {
                        return (
                            <div className="bar" key={i} style={{height: `${num*(4/5)}px`}}>
                            </div>
                        )
                    })}
                </div>

                <div className={this.setClass("insertion", "text")}>
                    <h1>Insertion Sort</h1>
                    <p>The insertion sort algorithm works basically like how you would sort cards:</p>
                    <ol>
                        <li>Take the first one set it to the side.</li>
                        <li>Take the next one and put it before the first card if its smaller or after if its bigger.</li>
                        <li>Take the next card find the spot where its bigger than the card before it and smaller than the card after it.</li>
                        <li>Repeat step 3 until the whole deck is sorted.</li>
                    </ ol>

                    <p>The algorithm splits the array into 2 parts - sorted and unsorted. The first value from the unsorted part is 
                        picked and placed in the spot where it's bigger than the one on its left and smaller than the one on the right 
                        (vice versa if sorting in decreasing order). <br /> <br/>
                        Here's a more technical step-by-step for sorting an array in ascending order:
                    </p>
                    
                    <ol>
                        <li>Iterate from arr[1] to arr[n].</li>
                        <li>Compare the current elements key to the one on its left.</li>
                        <li>If the key is smaller than the left one, swap positions with the left element. Repeat until its key is bigger 
                            than its left neighbour.</li>
                        <li>Repeat steps 2-3 until whole array is sorted.</li>
                    </ol>
                </div>

                <div className={this.setClass("selection", "text")}>
                    <h1>Selection Sort</h1>
                    <p>The selection sort algorithm works by splitting up the array into 2 sub-arrays - sorted and unsorted. At first, the 
                        entire list is unsorted. Then it does the following to sort an array in ascending order:
                    </p>
                    <ol>
                        <li>Find the minimum element in the unsorted sub-array.</li>
                        <li>Swap that minimum element with the first element in the unsorted sub-array.</li>
                        <li>Now that recently swapped minimum element is the end of the sorted sub-array.</li>
                        <li>Repeat steps 1-3 until the whole array is sorted.</li>
                    </ol>
                    <p>**NOTE - the animation shows the algorithm scanning the whole array. Then it highlights the minimum element it found and swaps it.</p>
                </div>
            </div>
        )
    }
}

export default SortingVisualizer