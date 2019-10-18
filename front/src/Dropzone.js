import React, { Component } from "react";
import styled from "styled-components";

class DropInput extends Component {
    constructor(props) {
        super(props);
        this.wrapper = React.createRef();
        this.state = {
            results: []
        }
    }
    componentDidUpdate = () => {
        if (this.wrapper) {
            this.wrapper.current.scrollTop = this.wrapper.current.scrollHeight;
        }
    }
    loadOnConsole = (results, path) => {
        this.setState(prevState => {
            const pathMessage = `You can find a generated file here: ${path}`;
            let newResults = prevState.results.concat(
                "--------",
                results, 
                "--------", 
                pathMessage, 
                "--------"
            );
            if(!path) {
                newResults = prevState.results.concat(
                    "--------", 
                    "Error occured:", 
                    results, 
                    "--------"
                );
            }
            return { 
                results: newResults
            }
        });
    }
    sendFile = ev => {
        ev.preventDefault();
        if (ev.dataTransfer.items) {
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
                if (ev.dataTransfer.items[i].kind === 'file') {
                    const file = ev.dataTransfer.items[i].getAsFile();
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = async () => {
                        if (reader.result.length) {
                            try {
                                const data = await fetch("http://localhost:3000/getFile", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        url: reader.result
                                    })
                                });
                                const { results, path } = await data.json();
                                this.loadOnConsole(results, path);
                            } catch(err) {
                                this.loadOnConsole(err.message, null);
                            }
                        }
                    }
                }
            }
        }
    };
    dragOverHandler = ev => {
        ev.preventDefault();
    }
    renderResults = results => (
       results.map((result, i) => (
            <span key={i}>
                {result}
            </span>
        ))
    );
    render() {
        return (
            <div
                className={this.props.className}
                onDrop={this.sendFile} 
                onDragOver={this.dragOverHandler}
                ref={this.wrapper}
            > 
                {this.state.results && this.renderResults(this.state.results)}
                <div className="message">Drag & Drop instructions here.</div>
            </div>
        )
    }
}

const StyledDropInput = styled(DropInput)`
    color: #2fd42f;
    width: 100%;
    height: 100%;
    text-align: left;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    overflow-y: scroll;
    .message {
        padding: 10px 0px;
        font-size: 18px;
    }
`;

export default StyledDropInput;