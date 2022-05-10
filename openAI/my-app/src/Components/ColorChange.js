import React, {Component} from "react";
import "./colorchange.css";
import blueCircle from "../img/blue-circle.png"
import grayCircle from "../img/gray-circle.png"
import greenCircle from "../img/green-circle.jpeg"

class ColorChange extends Component {
    constructor(props) {
        super(props);

        this.state = {
            map: {
                gray : grayCircle,
                blue : blueCircle,
                green : greenCircle,
            },
            color : props.colorType
        }

        this.onChangeValue = this.onChangeValue.bind(this);
    }

    onChangeValue(e) {
        console.log(e.target.value);
        this.setState({color:e.target.value});
    }

    render() {
        return (
            <div>
                <div className='color-image-wrapper'>
                    <img id="color-image" src={this.state.map[this.state.color]} alt=""></img>
                </div>
                <div className='menu-color-button'>
                    <div className='color-circle'>
                        <label>
                            <img src = {grayCircle} alt="gray circle" />
                            <input type="radio" value="gray" onChange={(e)=>{this.onChangeValue(e);}}/>
                        </label>
                    </div>
                    <div className='color-circle'>
                        <label>
                            <img src = {blueCircle} alt="blue circle" />
                            <input type="radio" value="blue" onChange={(e)=>{this.onChangeValue(e);}}/>
                        </label>
                    </div>
                    <div className='color-circle'>
                        <label>
                            <img src = {greenCircle} alt="green circle" />
                            <input type="radio" value="green" onChange={(e)=>{this.onChangeValue(e);}}/>
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}

export default ColorChange;