
import React from "react";
import DropInput from "./Dropzone";
import styled from "styled-components";

const StyledConsoleWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    font-family: 'Source Code Pro', monospace;
`;
const StyledConsole = styled.div`
    width: 1000px;
    background: #000;
    height: 500px;
    border-radius: 4px;
    border: 4px solid #cfcfcf;
    padding-left: 20px;
`;

const App = () => (
    <StyledConsoleWrapper>
        <StyledConsole>
            <DropInput />
        </StyledConsole>
    </StyledConsoleWrapper>
);

export default App;