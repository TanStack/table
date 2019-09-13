import { useState, useEffect } from 'react'
import _ from 'lodash'

export default function useStream(
  getPage,
  dataLocation = 'data',
  totalRecordsLocation = 'total'
) {
  let [totalRecords, setTotalRecords] = useState(0)
  let [rows, setRows] = useState([])
  let [isStreaming, setIsStreaming] = useState(false)
  let [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let currentPage = 1
    let totalPages = 1

    const fetchPage = async () => {
      let response = await getPage(currentPage)

      let pageRows = _.get(response, dataLocation)
      let totalRecords = _.get(response, totalRecordsLocation)

      setRows(rows => rows.concat(pageRows))

      if (currentPage === 1) {
        setTotalRecords(totalRecords)
        totalPages = Math.ceil(totalRecords / pageRows.length)
      }
    }

    ;(async () => {
      await fetchPage()

      setIsLoading(false)

      while (currentPage < totalPages) {
        setIsStreaming(true)
        currentPage += 1
        await fetchPage(currentPage)
      }

      setIsStreaming(false)
    })()
  }, [getPage, dataLocation, totalRecordsLocation])

  return {
    rows,
    totalRecords,
    isStreaming,
    isLoading,
  }
}
