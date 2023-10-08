"use client";

import getImageUrl from "@/lib/getImageUrl";
import { useBoardStore } from "@/store/BoardStore";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import {
	DraggableProvidedDraggableProps,
	DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";
import Image from "next/image";

type Props = {
	todo: Todo;
	index: number;
	id: TypedColumn;
	innerRef: (element: HTMLElement | null) => void;
	draggableProps: DraggableProvidedDraggableProps;
	dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

export default function TodoCard({
	todo,
	index,
	id,
	innerRef,
	draggableProps,
	dragHandleProps,
}: Props) {
	const deleteTask = useBoardStore((state) => state.deleteTask);
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getImageUrl(todo.image!)
        if (url){
          setImageUrl(url.toString())
        }
      }
      fetchImage();
    }
  }, [todo])
  

	return (
		<div
			className="bg-white rounded-md space-y-2 drop-shadow-md"
			{...draggableProps}
			{...dragHandleProps}
			ref={innerRef}
		>
			<div className="flex justify-between items-center p-5">
				<p>{todo.title}</p>
				<button className="text-red-500 hover:text-red-600">
					<XCircleIcon
						onClick={() => deleteTask(index, todo, id)}
						className="ml-5 h-8 w-8"
					/>
				</button>
			</div>

      {imageUrl && (
        <div className="h-full w-full rounded-b-md">
          <Image
            alt="Task Image"
            src={imageUrl}
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
		</div>
	);
}
