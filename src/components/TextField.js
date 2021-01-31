import React from 'react';
import styled from 'styled-components';

const InputField = styled.input`
  width: 100%;
  max-width: 500px;
  height: 40px;
  font-size:16px;
  padding: 0px 10px;
  border: 1px solid grey;
`;





class TextField extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <InputField required name={this.props.name} value={this.props.value} onChange={
                    (e) => {
                        this.props.onChange(e.target.value)
                    }}/>



            </>
        );
    }

}
export default TextField;
