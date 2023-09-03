"use client"

import { DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

type Props = {
    todo: Todo;
    index: number;
    id: TypedColumn;
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}


export default function TodoCard({
    todo,
    index,
    id,
    innerRef,
    draggableProps,
    dragHandleProps
} : Props) {
  return (
    <div
        className="bg-white rounded-md space-y-2 drop-shadow-md"
        {...draggableProps} {...dragHandleProps} ref={innerRef}
    >
        <h1>Hello</h1>
    </div>
  )
}
