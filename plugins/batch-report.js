import moment from "moment"

class BatchReport {
  /** Properties */
  #startRange = new Date() // format "YYYY-MM-DD"
  #endRange = new Date() // format "YYYY-MM-DD"
  #workingBatchStart = new Date() // format "YYYY-MM-DD"
  #workingBatchEnd = new Date() // format "YYYY-MM-DD"
  #workingBatchReload = new Date() // boolean

  batchSize = 1 // range length
  busyWaiting = 5000 // timemillis

  loadingInit = false
  loadingBatch = false
  warningBusy = false

  /** Callbacks */

  // getReport callback should have parameter date_range
  // date_range format will be "YYYY-MM-DD_YYYY-MM-DD"
  getReport = async () => { }

  // concatRows callback should have parameter batch of data and dummyIndex
  concatRows = () => { }

  /** Functions */

  // Set startDate and endDate using date range
  // range consist of two-length array [start, end]
  setDateRange(range) {
    this.#startRange = new Date(range[0])
    this.#endRange = new Date(range[1])
  }

  // Set startDate and endDate using month
  setMonth(monthPeriod) {
    const [year, month] = monthPeriod.split("-")
    this.#startRange = new Date(year, parseInt(month) - 1, 1)
    this.#endRange = new Date(year, month, 0)

    const today = new Date()
    if (today < this.#endRange) this.#endRange = today
  }

  isLoadingInit() { return this.loadingInit }

  isLoadingBatch() { return this.loadingBatch }

  isWarningBusy() { return this.warningBusy }

  isReloadingBatch() { return this.#workingBatchReload }

  isWorkingBatch(startDate) {
    return startDate.getTime() == this.#workingBatchStart.getTime()
  }

  isFirstBatch() {
    // check if difference between workingBatchEnd and endRange less than 1 day
    const diff = this.#endRange.getTime() - this.#workingBatchEnd.getTime()
    return diff < (1000 * 60 * 60 * 24)
  }

  isLastBatch() {
    // check if difference between workingBatchStart and startRange less than 1 day
    const diff = this.#workingBatchStart.getTime() - this.#startRange.getTime()
    return diff < (1000 * 60 * 60 * 24)
  }

  getWorkingBatch() {
    const range = [this.#workingBatchStart]
    if (this.#workingBatchStart.getTime() !== this.#workingBatchEnd.getTime()) range.push(this.#workingBatchEnd)
    return range.map(date => moment(date).format("MMM-DD")).join(" s.d. ")
  }

  async gatherData() {
    this.loadingInit = true

    let end = this.#endRange

    // set helper.warning to true after 5 seconds (busyWaiting)
    setTimeout(() => {
      if (this.loadingInit || this.loadingBatch) this.warningBusy = true;
    }, this.busyWaiting)

    while (end >= this.#startRange) {
      // set start
      const startMillis = end.getTime() - ((this.batchSize - 1) * 1000 * 60 * 60 * 24)
      let start = startMillis > this.#startRange.getTime() ? new Date(startMillis) : this.#startRange

      await this.getBatchData(start, end)

      // decrease end value (helper.batch_size) days
      end = new Date(start.getTime() - (1000 * 60 * 60 * 24))
    }

    this.warningBusy = false
  }

  async getBatchData(start, end, dummyIndex) {
    this.#workingBatchStart = start
    this.#workingBatchEnd = end
    this.#workingBatchReload = isFinite(dummyIndex)

    this.loadingBatch = true
    try {
      // date range, format YYYY-MM-DD_YYYY-MM-DD
      const range = `${moment(start).format("YYYY-MM-DD")}_${moment(end).format("YYYY-MM-DD")}`

      // get data
      const data = await this.getReport(range)
      if (Array.isArray(data.rows)) this.#checkRows(data.rows)

      // concat row data
      this.concatRows(data, dummyIndex)
    } catch (error) {
      // fill dummy row if not reload
      if (!this.#workingBatchReload) {
        let dummy = this.#generateDummyRow(start, end)
        this.concatRows({ error: true, rows: [dummy] })
      }
    }
    this.loadingInit = false
    this.loadingBatch = false
  }

  #checkRows(rows) {
    let date = this.#workingBatchStart

    const empties = []
    let idxRow = 0
    let prevFound = null

    while (date <= this.#workingBatchEnd) {
      // date string to compare
      const strDate = moment(date).format("MMM-DD")

      // if strDate (iterator) matches with row.date
      if (strDate === rows[idxRow]?.date) {
        // record matched date to prevFound
        prevFound = rows[idxRow]?.date

        // increment date
        date = this.#add24Hours(date)

        // increment row
        idxRow++
      }

      // if previous found date matches current row.date
      else if (prevFound === rows[idxRow]?.date) {
        // increment row
        idxRow++
      }

      // if row.date doesn't match prevFound nor strDate
      else {
        // collect empty data to array empties
        empties.push({
          data: this.#generateEmptyRow(date),
          index: empties.length + idxRow
        })

        // increment date
        date = this.#add24Hours(date)
      }
    }

    // inserting empty data to rows
    empties.forEach(empty => {
      rows.splice(empty.index, 0, empty.data)
    })
  }

  #add24Hours(date) {
    return new Date(date.getTime() + (1000 * 60 * 60 * 24))
  }

  #generateEmptyRow(date) {
    return {
      empty: true,
      date: moment(date).format("MMM-DD"),
      days: moment(date).locale("id").format("dddd")
    }
  }

  #generateDummyRow() {
    const date_range = this.getWorkingBatch()

    return {
      dummy: true,
      start: this.#workingBatchStart,
      end: this.#workingBatchEnd,
      date: date_range,
      shift: date_range,
      gate: date_range
    }
  }
}

export { BatchReport }