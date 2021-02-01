import React from 'react';

type MyProps = {
    text: string
}

type MyState = any


export class Header extends React.Component<MyProps, MyState> {


    render() {
        return (
            <h1>
                {
                    this.props.text
                }
            </h1>
        );
    }
}

