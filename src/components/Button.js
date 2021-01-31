import React from 'react';
import styled from 'styled-components';

const BtnDiv = styled.div`
  background: #2eabab;
  color: white;
  display: flex;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  justify-content: center;
`;



class Button extends React.Component {




    render() {
        return (
            <>
                <BtnDiv
                    onClick={() => {
                        this.props.onClick && this.props.onClick()
                    }}
                >
                    {this.props.text || 'Add Description'}
                </BtnDiv>
            </>
        );
    }


}

export default Button;
