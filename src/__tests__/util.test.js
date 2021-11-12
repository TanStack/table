import {isFunction, unpreparedAccessWarning,  flattenBy, assignColumnAccessor, decorateColumn, getBy} from '../utils'

describe('testing utils', () => {
    let original;
    beforeAll(()=>{
         original=console.error
        console.error= jest.fn()
    })
    afterAll(()=>{
        console.error=original
    })
    test('isFunctions tests',()=>{
        expect(isFunction(null)).toBe(undefined);
        expect(isFunction(undefined)).toBe(undefined);
        expect(isFunction(12)).toBe(undefined);
        expect(isFunction('string')).toBe(undefined);
        const mocKFunc= isFunction(()=> 'mock')
        expect(mocKFunc()).toBe('mock');

    })
    test('unpreparedAccessWarning tests', () => {
        expect(()=>unpreparedAccessWarning()).toThrow()
    })
    
    test('flattenBy', () => {
        const arr=[
            {
              Header: 'Name',
              columns: [
                {
                  Header: 'First Name',
                  accessor: 'firstName',
                },
                {
                  Header: 'Last Name',
                  accessor: 'lastName',
                },
              ],
            },
            {
              Header: 'Info',
              columns: [
                {
                  Header: 'Age',
                  accessor: 'age',
                  columns:[{
                    Header: 'Your Name',
                    accessor: 'Morteza',
                  }]
                },
                {
                  Header: 'Visits',
                  accessor: 'visits',
                }          
              ],
            },
          ]
        const flat=[
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
          {
            Header: 'Your Name',
            accessor: 'Morteza',
          },
          {
            Header: 'Visits',
            accessor: 'visits',
          }  
        ]  
        
        expect(flattenBy(arr,'columns')).toStrictEqual(flat)
    })
    test('assignColumnAccessor test', () => {
      
        expect(()=>assignColumnAccessor({})).toThrow()
        expect(()=>assignColumnAccessor({columns:[]})).toThrow()
        
    })
    test('decorateColumn',()=>{
        expect(()=>decorateColumn()).toThrow()
    })
    test('getBy tests',()=>{
        const obj={name:'Morteza', path:undefined}
        expect(getBy(obj)).toStrictEqual(obj)
    })
})
