import React from 'react';
import {Header} from '../components/Header';
import {Button} from '../components/Button';
import {AutoComplete} from '../AutoComplete';
import {GetAllEmployees} from "../actions/employees";
import {AxiosResponse} from "axios";
import {EmployeeName} from "../types/types";
import {History} from 'history';

const items = (data: AxiosResponse['data']): Array<{ key: string, name: string }> => {
    let temp: Array<{ key: string, name: string }> = [];
    for (const property in data) {
        if (data.hasOwnProperty(property)) {
            temp.push({
                key: `${property}`, name: `${data[property]}`
            })
        }
    }
    return temp;
};


type MyProps = {
    value: EmployeeName, history: History
}

type MyState = {
    value: EmployeeName,
    itemList: Array<{ key: string, name: string }>
}


export class Home extends React.Component<MyProps, MyState> {


    state: { value: EmployeeName, itemList: Array<{ key: string, name: string }> } = {value: '', itemList: []};


    componentDidMount() {

        GetAllEmployees((success: boolean, resp: AxiosResponse) => {
            if (success) {
                const data: AxiosResponse['data'] = resp?.data;
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
                        onSelect={(value: any) => {
                            this.setState({
                                value: value,
                                itemList: this.state.itemList
                            })
                        }}

                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            let value = event.target.value;
                            GetAllEmployees((success: boolean, resp: AxiosResponse) => {
                                if (success) {
                                    const data: AxiosResponse['data'] = resp?.data;
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
