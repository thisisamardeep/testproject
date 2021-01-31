import React from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import {AutoComplete} from '../AutoComplete';
import {GetAllEmployees} from "../actions/employees";

const items = (data) => {
    let temp = [];
    for (const property in data) {
        if (data.hasOwnProperty(property)) {
            temp.push({
                key: `${property}`, name: `${data[property]}`
            })
        }
    }
    return temp;
};


class Home extends React.Component {



    state = {value: '', itemList: []};


    componentDidMount() {

        GetAllEmployees((success, resp) => {
            if (success) {
                const data = resp?.data;
                this.setState({
                    value: '',
                    itemList: items(data)
                })
            } else {
                alert('Something went wrong')
            }
        })

    }


    render() {
        return (
            <React.Fragment>
                <Header text="Employee Explorer"/>
                <div className='flex'>
                    <AutoComplete
                        value={this.state.value}
                        inputProps={{id: 'states-autocomplete'}}
                        items={this.state.itemList}
                        onSelect={value => {
                            this.setState({
                                value: value,
                                itemList: this.state.itemList
                            })
                        }}

                        onChange={(event, value) => {
                            GetAllEmployees((success, resp) => {
                                if (success) {
                                    const data = resp?.data;
                                    this.setState({
                                        value: value,
                                        itemList: items(data)
                                    })

                                } else {
                                    alert('Something went wrong')
                                }
                            })
                        }}
                    />

                    <Button text='Search' onClick={() => {
                        if (!this.state.value) {
                            return alert('search field is empty')
                        }
                        this.props.history.push(`overview/${this.state.value}`)

                    }}/>
                </div>
            </React.Fragment>
        );
    }


}

export default Home;
