import React from "react";
import { useSelector, useDispatch } from "react-redux";

function Index() {
  const [second, setSecond] = React.useState(0)
  const [name, setName] = React.useState('')
  const timer = React.useRef(null)

  const taskList = useSelector(state => state.task.taskList)
  const dispatch = useDispatch()

  const onChangeTaskField = (e) => setSecond(e.target.value)
  const onChangeTaskName = (e) => setName(e.target.value)

  const startTimer = () => {
    timer.current = setInterval(() => setSecond(newVal => newVal += 1), 1000);
  }
  const stopTimer = () => {
    dispatch({ type: 'ADD_TASKLIST', payload: { taskName: name, taskField: second } })
    clearInterval(timer.current)
  }

  return (
    <>
      <div className="p-4">
        <label>Task name</label>
        <input id="taskName" type='text' onChange={onChangeTaskName} />
        <label>Task field</label>
        <input id="taskField" type='number' value={second} onChange={onChangeTaskField} />
        <button onClick={startTimer}>Start</button>
        <button onClick={stopTimer}>Stop</button>
      </div>

      <ul>
        {taskList.map((list, index) =>
          <li key={index}>{`${index + 1} ${list.taskName} ${list.taskField}`}</li>
        )}
      </ul>
    </>
  )
}
export default Index