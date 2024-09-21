import React from 'react'
import ScheduleForm from '../../components/schedule/ScheduleForm'
import ScheduleTable from '../../components/schedule/ScheduleTable'

const SchedulePage = () => {
  return (
    <>
      <ScheduleForm />
      <div className="max-w-5xl mx-auto bg-gray-100 p-6 rounded-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Schedule Table</h2>
        <ScheduleTable />
      </div>
    </>
  )
}

export default SchedulePage
