import React from 'react';
import styled from 'styled-components';
import {EmployeeName} from "../types/types";

const InputField = styled.input`
  width: 100%;
  max-width: 500px;
  height: 40px;
  font-size:16px;
  padding: 0px 10px;
  border: 1px solid grey;
`;

type MyProps = {
    name: EmployeeName,
    value: string,
    onChange: (value: string) => void
}

type MyState = any


export class TextField extends React.Component<MyProps, MyState> {


    render() {
        return (
            <>

                <InputField required name={
                    this.props.name
                } value={
                    this.props.value} onChange={
                    (e) => {
                        this.props.onChange(e.target.value)
                    }}/>


            </>
        );
    }

}

