import React from 'react';
import {startCase, concat, map, find, groupBy, filter, keys, isEmpty} from 'lodash';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
// components
import Header from '../components/Header';
// api
import {GetDirectSubordinates} from '../actions/employees';

const NameDiv = styled.div`
  cursor: copy;
  :hover {
    color: blue;
  }
`;


class Overview extends React.Component {
    constructor(props) {
        super(props);
        this.employeeName = startCase(this.props.match?.params?.name);
        this.state = {empTree: []};

    }


    componentDidMount() {
        this.getEmployeeInfo(this.employeeName)

    }

    getEmployeeInfo(employeeName, parent = null) {
        GetDirectSubordinates(employeeName, (success, resp) => {
            if (success) {
                const data = resp?.data;
                if (data) {
                    let newempTree = concat(this.state.empTree, [{
                        name: employeeName,
                        position: data?.[0],
                        parent: parent
                    }])
                    this.setState({
                        empTree: newempTree
                    });
                    this.getSubordinatesInfo(data, employeeName)
                }

            } else {
                alert('Something went wrong');
            }
        })
    }

    getSubordinatesInfo(data, parentName) {
        const subordinates = data && data[1] && data[1]["direct-subordinates"]
        subordinates && map(subordinates, (subordinate) => {
            this.getEmployeeInfo(subordinate, parentName)
        })
    }

    copyToClipboard(name) {
        const link = `${window.location.origin}/overview/${name}`
        let copy = document.createElement("textarea");
        document.body.appendChild(copy);
        copy.value = link;
        copy.select();
        document.execCommand("copy");
        document.body.removeChild(copy);
        alert('copied successfully')
    }

    grouped() {
        return groupBy(filter(this.state.empTree, 'parent'), 'parent');
    }

    render() {
        return (
            <>
                <Header text="Employee Overview "/>
                {
                    !isEmpty(this.state.empTree) ?
                        <>
                            <p> Subordinates of
                                employee <b>{this.employeeName} {this.state.empTree[0] && `(${this.state.empTree[0]?.position})`}</b>:
                            </p>
                            {
                                map(keys(this.grouped()), (key, i) => (
                                    <div key={key}>
                                        <b>
                                            {i > 0 &&
                                            <NameDiv key={i} onClick={() => this.copyToClipboard(key)}>
                                                {`${key} (${find(this.state.empTree, {name: key}).position})`}
                                            </NameDiv>
                                            }
                                        </b>
                                        {
                                            this.grouped()[key] && map(this.grouped()[key], (sub, j) => (
                                                !this.grouped()[sub.name] &&
                                                <NameDiv key={j} onClick={() => this.copyToClipboard(sub.name)}>
                                                    {sub.name} ({sub.position})
                                                </NameDiv>
                                            ))
                                        }
                                    </div>
                                ))
                            }
                        </>

                        :
                        <>
                            <div>
                                No Subordinates Available For Employee Name <b>{this.employeeName}</b>
                            </div>
                        </>
                }
                <br/>
                <Link to={'/'}> Back to Search </Link>

            </>
        );
    }


}


export default Overview;
