"use client"

import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";

export default function Board() {

  const [ board, getBoard, setBoardState, updateTodoInDB ] = useBoardStore((state) => [state.board, state.getBoard, state.setBoardState, state.updateTodoInDB])

  useEffect(() => {
    getBoard()
  }, [getBoard])

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
     
    if (!destination) return;

    if (type === "column"){
      const entries = Array.from(board.columns.entries())
      const [removed] = entries.splice(source.index, 1)
      entries.splice(destination.index, 0, removed)
      const rearrangedColumns = new Map(entries)
      setBoardState({
        ...board,
        columns: rearrangedColumns
      })
    }

    // This step is needed as the indexes are stored as numbers 0,1,2 etc insted of ids in DND lib.
    const columns = Array.from(board.columns)
    const startColIndex = columns[Number(source.droppableId)]
    const endColIndex = columns[Number(destination.droppableId)]
    
    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos
    }

    const endCol: Column = {
      id: endColIndex[0],
      todos: endColIndex[1].todos
    }

    if (!startCol || !endCol) return;

    if (source.index === destination.index && startCol === endCol) return;

    const newTodos = startCol.todos
    const [todoMoved] = newTodos.splice(source.index, 1)

    if (startCol.id === endCol.id){
      // Same Column task drag
      newTodos.splice(destination.index, 0, todoMoved)
      const newCol = {
        id: startCol.id,
        todos: newTodos
      }
      const newColumns = new Map(board.columns)

      setBoardState({...board, columns: newColumns})
    } else{
      // different column task drag 

      const endTodos = Array.from(endCol.todos)
      endTodos.splice(destination.index, 0, todoMoved)

      const newColumns = new Map(board.columns)
      const newCol = {
        id: startCol.id,
        todos: newTodos
      }

      newColumns.set(startCol.id, newCol)
      newColumns.set(endCol.id, {
        id: endCol.id,
        todos: endTodos
      })

      // Update state and DB
      updateTodoInDB(todoMoved, endCol.id)
      setBoardState({ ...board, columns: newColumns})
    }

  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}> 
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided, snapshot) => (
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {Array.from(board.columns.entries()).map(([id, column], index) => (
                <Column key={id} id={id} todos={column.todos} index={index} />
              ))}
            </div>
          )}
        </Droppable>;
    </DragDropContext>
  )
}
