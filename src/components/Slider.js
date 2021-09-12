import react from 'react'

class Slider extends react.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <input type="range" min={50} max={100} value={this.props.speed} onChange={(e) => {this.props.changeSpeed(e.target.value)}}></input>
        );
    }
}

export default Slider