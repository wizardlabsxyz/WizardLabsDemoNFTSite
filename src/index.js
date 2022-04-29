import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class Web3Button extends Component {
    render() {
        return (
            <div onClick={() => {
                console.log('okay');
            }}>
                <span>CONNECT</span>
            </div>
        )
    }
}

ReactDOM.render(
    React.createElement(Web3Button, {}, null),
    document.getElementById('web3-button')
);