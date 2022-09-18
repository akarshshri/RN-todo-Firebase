
interface ReturnType {
  updateOperation: (updatedTask: string) => {
    tempArray: object[],
    tempIndex: number
  },
  deleteOperation: () => {
    tempArray: object[],
    tempIndex: number
  },
}

interface PropType {
  tasks: object[],
  index: number
}

export const useFetchTaskDetails = (tasks: object[], index: number): ReturnType => {

  let obj = tasks.find((o: any) => o.id == index);
  if(obj == undefined) obj = {}
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
