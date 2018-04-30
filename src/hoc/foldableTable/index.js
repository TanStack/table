import React from 'react'
import left from './left.svg'
import right from './right.svg'

const defaultFoldIconComponent = ({ collapsed }) => {
    const style = { width: 25 }

    if (collapsed) { return <img src={right} style={style} alt="right" /> }
    return <img src={left} style={style} alt="left" />
}

const defaultFoldButtonComponent = ({
    header, collapsed, icon, onClick
}) => {
    const style = {
        marginLeft: '0px',
        marginTop: '-5px',
        marginBottom: '-8px',
        float: 'left',
        cursor: 'pointer',
    }

    return (<div>
        <div style={style} onClick={onClick}>
            {icon}
        </div>
        {!collapsed && <div>{header}</div>}
    </div>)
}

export default ReactTable => {

    const wrapper = class RTFoldableTable extends React.Component {
        constructor(props, context) {
            super(props, context)

            if (!props.onFoldChange) {
            this.state = {
                folded: {}
            };
            }
        }

        // this is so we can expose the underlying ReactTable.
        getWrappedInstance = () => {
            if (!this.wrappedInstance) console.warn('RTFoldableTable - No wrapped instance');
            if (this.wrappedInstance.getWrappedInstance) return this.wrappedInstance.getWrappedInstance();
            return this.wrappedInstance
        }

        getCopiedKey = key => {
            const { foldableOriginalKey } = this.props
            return `${foldableOriginalKey}${key}`
        }

        copyOriginal = column => {
            const { FoldedColumn } = this.props

            Object.keys(FoldedColumn).forEach(k => {
                const copiedKey = this.getCopiedKey(k)
                //if already copied then DO NOT copy again.
                if (column.hasOwnProperty(copiedKey)) return

                if (k === 'Cell') { column[copiedKey] = column[k] ? column[k] : c => c.value; }
                else column[copiedKey] = column[k]
            })

            if (column.columns && !column.original_Columns) { column.original_Columns = column.columns; }
        }

        restoreToOriginal = column => {
            const { FoldedColumn } = this.props

            Object.keys(FoldedColumn).forEach(k => {
                // ignore header as handling by foldableHeaderRender
                if (k === 'Header') return

                const copiedKey = this.getCopiedKey(k)
                column[k] = column[copiedKey]
            })

            if (column.columns && column.original_Columns) { column.columns = column.original_Columns; }
        }

        getState = () => this.props.onFoldChange ? this.props.folded : this.state.folded;

        isFolded = col => {
            const folded = this.getState()
            return folded[col.id] === true
        }

        foldingHandler = col => {
            if (!col || !col.id) return

            const { onFoldChange } = this.props
            const folded = this.getState()
            const { id } = col

            let newFold = Object.assign({}, folded)
            newFold[id] = !newFold[id]

            if (onFoldChange) { onFoldChange(newFold); }
            else this.setState(previous => ({ folded: newFold }))
        }

        foldableHeaderRender = cell => {
            const { FoldButtonComponent, FoldIconComponent } = this.props
            const { column } = cell
            const collapsed = this.isFolded(column)
            const icon = React.createElement(FoldIconComponent, { collapsed })
            const onClick = () => this.foldingHandler(column)

            return React.createElement(FoldButtonComponent, {
                header: column.original_Header, collapsed, icon, onClick
            })
        }

        applyFoldableForHeaderColumn = (headerCol, collapsed) => {
            const { FoldedColumn } = this.props

            if (collapsed) {
                headerCol.columns = [FoldedColumn]
                headerCol.width = FoldedColumn.width
                headerCol.style = FoldedColumn.style
            }
            else this.restoreToOriginal(headerCol)
        }

        applyFoldableForColumn = (column, collapsed) => {
            const { FoldedColumn } = this.props

            if (collapsed) { column = Object.assign(column, FoldedColumn); }
            else this.restoreToOriginal(column)
        }

        applyFoldableColumn = columns => columns.map((col, index) => {
            if (!col.foldable) return col;

            //If col don't have id then generate id based on index
            if (!col.id)
                col.id = `col_${index}`;

            this.copyOriginal(col);

            //Replace current header with internal header render.
            if (!col.original_Header)
                col.original_Header = col.Header;
            col.Header = c => this.foldableHeaderRender(c);
            const collapsed = this.isFolded(col);

            //Handle Column Header
            if (col.columns)
                this.applyFoldableForHeaderColumn(col, collapsed);
            //Handle Nornal Column.
            else this.applyFoldableForColumn(col, collapsed);

            //return the new column out
            return col;
        })

        render() {
            const {
                columns: originalCols, FoldButtonComponent, FoldIconComponent, FoldedColumn, ...rest
            } = this.props
            const columns = this.applyFoldableColumn([...originalCols])
            const extra = { columns }

            return (
                <ReactTable {...rest} {...extra} ref={r => this.wrappedInstance = r} />
            )
        }
    }

    wrapper.displayName = 'RTFoldableTable'
    wrapper.defaultProps =
        {
            FoldIconComponent: defaultFoldIconComponent,
            FoldButtonComponent: defaultFoldButtonComponent,
            foldableOriginalKey: 'original_',
            FoldedColumn: {
                Cell: c => '',
                style: { width: 30 },
                width: 30,
                sortable: false,
                resizable: false,
                filterable: false,
            },
        }

    return wrapper
}
