
import React from 'react'
import '../../../../react-table.css'

import FoldableTableWithHeader from './FoldableTableWithHeader'
import FoldableTableWithoutHeader from './FoldableTableWithoutHeader'
import FoldableTableCustomState from './FoldableTableCustomState'

class FaldableComponentTest extends React.Component {
    render() {

        return (
            <div>
                <p>- Sample With Header Columns</p>
                <br />
                <FoldableTableWithHeader />
                <br /> <br />
                <p>- Sample With Normal Columns</p>
                <br />
                <FoldableTableWithoutHeader />
                <br /> <br />
                <p>- Custom State and selectedTable</p>
                <br />
                <FoldableTableCustomState />
            </div >
        )
    }
}

export default FaldableComponentTest
