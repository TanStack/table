/* eslint-disable */

import React from 'react'

export default (Component) => {
  const wrapper = class RTTreeTable extends React.Component {
    
    constructor(props)
    {
      super(props);
      this.getWrappedInstance.bind(this);
      this.TrComponent.bind(this);
      this.getTrProps.bind(this);
    }

    // this is so we can expose the underlying ReactTable to get at the sortedData for selectAll
    getWrappedInstance = () => {
      if (!this.wrappedInstance) console.warn('RTTreeTable - No wrapped instance');
      if (this.wrappedInstance.getWrappedInstance) return this.wrappedInstance.getWrappedInstance();
      else return this.wrappedInstance
    }

    TrComponent = (props) => {
      const { 
        ri,
        ...rest 
      } = props;
      if(ri && ri.groupedByPivot) {
        const cell = {...props.children[ri.level]};
        
        cell.props.style.flex = 'unset';
        cell.props.style.width = '100%';
        cell.props.style.maxWidth = 'unset';
        cell.props.style.paddingLeft = `${this.props.treeTableIndent*ri.level}px`;
        // cell.props.style.backgroundColor = '#DDD';
        cell.props.style.borderBottom = '1px solid rgba(128,128,128,0.2)';
        
        return <div className={`rt-tr ${rest.className}`} style={rest.style}>{cell}</div>;
      }
      return <Component.defaultProps.TrComponent {...rest} />;
    }

    getTrProps = (state,ri,ci,instance) => {
      return {ri};
    }

    render() {
      const { columns, treeTableIndent, ...rest } = this.props;
      const { TrComponent, getTrProps } = this;
      const extra = {
        columns: columns.map((col)=>{
          let column = col;
          if(rest.pivotBy && rest.pivotBy.includes(col.accessor))
          {
            column = {
              accessor: col.accessor,
              width: `${treeTableIndent}px`,
              show: false,
              Header: '',
            }
          }
          return column;
        }),
        TrComponent,
        getTrProps,
      };
      
      return (
        <Component {...rest} {...extra} ref={ r => this.wrappedInstance=r }/>
      )
    }
  }
  wrapper.displayName = 'RTTreeTable';
  wrapper.defaultProps = 
  {
    treeTableIndent: 10,
  }
  
  return wrapper;
}
