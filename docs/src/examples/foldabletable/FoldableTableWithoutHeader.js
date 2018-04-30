import React from 'react';
import ReactTable from '../../../../lib/index';
import FoldableTableHOC from '../../../../lib/hoc/foldableTable';

const FoldableTable = FoldableTableHOC(ReactTable);

export default class FoldableTableWithoutHeader extends React.Component {

    getData = () => [{
        "id": 1,
        "first_name": "Jeanette",
        "last_name": "Penddreth",
        "email": "jpenddreth0@census.gov",
        "gender": "Female",
        "ip_address": "26.58.193.2"
    }, {
        "id": 2,
        "first_name": "Giavani",
        "last_name": "Frediani",
        "email": "gfrediani1@senate.gov",
        "gender": "Male",
        "ip_address": "229.179.4.212"
    }, {
        "id": 3,
        "first_name": "Noell",
        "last_name": "Bea",
        "email": "nbea2@imageshack.us",
        "gender": "Female",
        "ip_address": "180.66.162.255"
    }, {
        "id": 4,
        "first_name": "Willard",
        "last_name": "Valek",
        "email": "wvalek3@vk.com",
        "gender": "Male",
        "ip_address": "67.76.188.26"
    }];

    render() {
        return <FoldableTable
            data={this.getData()}
            columns={[
                {
                    Header: "First Name",
                    accessor: "first_name"
                },
                {
                    Header: "Last Name",
                    accessor: "last_name",
                    foldable: true,
                },
                {
                    Header: "Email",
                    accessor: "email",
                    foldable: true,
                },
                {
                    Header: "Gender",
                    accessor: "gender",
                    foldable: true,
                }
            ]}></FoldableTable>
    }
}
