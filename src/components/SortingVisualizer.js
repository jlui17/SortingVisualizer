import react from 'react'
import * as SortingAlgorithms from './SortingAlgorithms'

class SortingVisualizer extends react.Component {
    constructor() {
        super();
        this.state = {
            nums: []
        }
    }

    componentDidMount() {
        this.generateNewNums()
    }

    generateNewNums() {
        let nums = [];
        for (let i = 0; i < 100; i++) {
            nums.push(Math.floor(Math.random() * 600 + 5))
        };
        this.setState({nums});
    }

    arraysAreEqual(arr1, arr2) {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    insertStepDown(start, end, bars) {
        for (let i = start; i > end; i--) {
            const speed = start - i + 1
            setTimeout(() => {
            bars[i].style.backgroundColor = 'black';
                setTimeout(() => {
                    bars[i].style.backgroundColor = '#ECD6A2';
                }, 100)
            }, speed * 100)
        }
    }

    insertionSort() {
        const insertionSorted = SortingAlgorithms.insertionSort(this.state.nums)
        const jsSorted = [...this.state.nums].sort((a,b) => a-b)
        console.log(this.arraysAreEqual(insertionSorted.sortedArray, jsSorted))

        const bars = document.getElementsByClassName('bar');
        const animations = insertionSorted.animations
        // for (let i = 0; i < animations.length; i++) {
        this.insertStepDown(animations[30].start, animations[30].end, bars)
        // }
    }

    testSortingAlgorithm() {
        for (let i = 0; i < 100; i++) {
            const arr = []
            for (let j = 0; j < 1000; j++) {
                arr.push(Math.floor(Math.random() * 600 + 5))
            } 
            const jsSorted = [...arr].sort((a,b) => {return a-b})
            const insertionSorted = SortingAlgorithms.insertionSort(arr).sortedArray
            if (this.arraysAreEqual(jsSorted, insertionSorted)) {
                console.log("true");
            } else 
            console.log("false");
        };
    }

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
                <button onClick={() => this.testSortingAlgorithm()}>Test</button>
            </div>
        )
    }
}

export default SortingVisualizer