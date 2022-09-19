import { task } from "./Interfaces/Tasks";

type functionType = {
  tempArray: task,
  tempIndex: number
}

interface ReturnType {
  updateOperation: (updatedTask: string) => functionType,
  deleteOperation: () => functionType,
}

interface PropType {
  tasks: object[],
  index: number
}

export const useFetchTaskDetails = (tasks: task, index: number): ReturnType => {

  let obj = tasks.find(o => o.id == index);
  if(obj == undefined) obj = {task: 'NA', id: -1}
    var tempIndex = tasks.indexOf(obj);
  let tempArray = [...tasks]

  const deleteOperation = () => {
    tempArray.splice(tempIndex, 1);
    return {tempArray, tempIndex}
  }

  const updateOperation = (updatedTask: string) => {
    tempArray[tempIndex] = { task: updatedTask, id: index }
    return {tempArray, tempIndex}
  }

  return {
    deleteOperation,
    updateOperation
  };
};
