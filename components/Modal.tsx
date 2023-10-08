"use client";
import Image from "next/image";
import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";
import { PhotoIcon } from "@heroicons/react/24/solid";

function Modal() {
	const [isOpen, closeModel] = useModalStore((state) => [state.isOpen, state.closeModel]);
	const [image, setImage, newTaskType, newTaskInput, setNewTaskInput, addTask] = useBoardStore((state) => [
		state.image,
		state.setImage,
		state.newTaskType,
		state.newTaskInput,
		state.setNewTaskInput,
		state.addTask,
	]);

	const imagePickerRef = useRef<HTMLInputElement>(null);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!newTaskInput) return;

		// Add Task
		addTask(newTaskInput, newTaskType, image);

		setImage(null);
		closeModel();
	}

	return (
		// Use the `Transition` component at the root level
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="form" onSubmit={handleSubmit} onClose={closeModel} className="relative z-10">
				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<div className="fixed inset-0 bg-black bg-opacity-25" />
						</Transition.Child>
					</div>
				</div>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<Dialog.Panel
								className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left 
											align-middle shadow-xl transition-all">
								<Dialog.Title>
									<h3 className="text-lg font-medium leading-6 text-gray-900 pb-2">Add a task</h3>
								</Dialog.Title>

								<div className="mt-2">
									<input
										type="text"
										value={newTaskInput}
										onChange={(e) => setNewTaskInput(e.target.value)}
										placeholder="Enter a task here..."
										className="w-full p-5 outline-none border border-gray-300 rounded-md"
									/>
								</div>

								<TaskTypeRadioGroup />

								<div className="mt-2">
									<button
										type="button"
										onClick={() => imagePickerRef.current?.click()}
										className="w-full border border-gray-300 rounded-md outline-none p-5 
										focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
										<PhotoIcon className="h-6 w-6 mr-2 inline-block" />
										Upload Image
									</button>

									{image && (
										<Image
											alt="Task Image"
											src={URL.createObjectURL(image)}
											width={200}
											height={200}
											className="w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
											onClick={() => setImage(null)}
										/>
									)}
									<button
										type="button"
										onClick={() => {
											setImage(null);
											closeModel();
										}}
										className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700
										bg-white ${image && "border border-gray-300"} rounded-md hover:bg-gray-50 focus:outline-none`}
									/>
									<input
										className="hidden display-none"
										type="file"
										ref={imagePickerRef}
										hidden
										onChange={(e) => {
											if (!e.target.files![0].type.startsWith("image/")) return;
											setImage(e.target.files![0]);
										}}
									/>
								</div>

								<div>
									<button
										type="submit"
										disabled={!newTaskInput}
										className="inline-flex justify-center rounded-md border border-transparent w-full bg-blue-100 hover:bg-blue-200
										px-4 py-2 text-sm font-medium text-blue-900 focus: outline-none focus-visible: ring-2 focus-visible:ring-offset-2
										 focus-visible:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
									>
										Add Task
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

export default Modal;
