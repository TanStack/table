import React from 'react'
import ReactTable from '../../../../lib/index'
import FoldableTableHOC from '../../../../lib/hoc/foldableTable'
import selectTableHOC from '../../../../lib/hoc/selectTable'

const FoldableTable = FoldableTableHOC(selectTableHOC(ReactTable))

export default class FoldableTableCustomState extends React.Component {
    constructor(props, context) {
        super(props, context)

        this.state = { folded: {}, seleted: {}, selectedAll: false }
    }

    getData = () => [{
        id: 1,
        first_name: 'Jeanette',
        'last_name': 'Penddreth',
        email: 'jpenddreth0@census.gov',
        'gender': 'Female',
        ip_address: '26.58.193.2',
    }, {
        'id': 2,
        'first_name': 'Giavani',
        last_name: 'Frediani',
        'email': 'gfrediani1@senate.gov',
        'gender': 'Male',
        'ip_address': '229.179.4.212',
    }, {
        'id': 3,
        first_name: 'Noell',
        last_name: 'Bea',
        'email': 'nbea2@imageshack.us',
        gender: 'Female',
        ip_address: '180.66.162.255',
    }, {
        'id': 4,
        'first_name': 'Willard',
        'last_name': 'Valek',
        email: 'wvalek3@vk.com',
        'gender': 'Male',
        ip_address: '67.76.188.26',
    }];

    toggleSelection = (key, shift, row) => {
        const { selected } = this.state
        let newSelected = Object.assign({}, selected)
        newSelected[key] = !newSelected[key]
        this.setState(p => ({ selected: newSelected }))
    };

    toggleAll = () => {
        const { selectedAll } = this.state

        if (selectedAll) { this.setState(p => { return { selectedAll: false, seleted: {} } }); }
        else {
            const data = this.getData()

            let newSelected = {}
            data.forEach(d => newSelected[d.id] = true)
            this.setState(p => ({ selectedAll: true, seleted: newSelected }))
        }
    }

    isSelected = key => this.state.seleted[key];

    render() {
        return (<FoldableTable
            //SelectTable props
            keyField='id'
            toggleSelection={this.toggleSelection}
            toggleAll={this.toggleAll}
            isSelected={this.isSelected}
            selectAll={this.state.selectedAll}
            selectType='checkbox'

            onFoldChange={newFolded => this.setState(p => { return { folded: newFolded } })}
            folded={this.state.folded}

            data={this.getData()}
            columns={[{
                Header: "Name",
                foldable: true,
                columns: [
                    {
                        Header: "First Name",
                        accessor: "first_name"
                    },
                    {
                        Header: "Last Name",
                        accessor: "last_name"
                    }
                ]
            }, {
                Header: "Info",
                foldable: true,
                columns: [
                    {
                        Header: "Email",
                        accessor: "email"
                    },
                    {
                        Header: "Gender",
                        accessor: "gender"
                    }
                ]
            }]
            }></FoldableTable>)
    }
}
