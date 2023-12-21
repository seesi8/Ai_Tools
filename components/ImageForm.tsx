"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const ImageForm = ({ modelsList }: { modelsList: Array<string> }) => {
    const messageInput = useRef<HTMLTextAreaElement | null>(null);
    // causes rerender without useEffect due to suspense boundary
    // const storedResponse = typeof localStorage !== 'undefined' ? localStorage.getItem('response') : null;
    // const initialHistory = storedResponse ? JSON.parse(storedResponse) : [];
    // const [history, setHistory] = useState<string[]>(initialHistory);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [models, setModels] = useState<ModelType[]>([])
    const [models, setModels] = useState(modelsList);
    const [res, setRes] = useState<Array<string>>([]);
    const [currentModel, setCurrentModel] = useState<string>("dall-e-2");
    const [number, setNumber] = useState(1);

    const handleEnter = (
        e: React.KeyboardEvent<HTMLTextAreaElement> &
            React.FormEvent<HTMLFormElement>
    ) => {
        if (e.key === "Enter" && isLoading === false) {
            e.preventDefault();
            setIsLoading(true);
            handleSubmit(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const message = messageInput.current?.value;

        if (!message) {
            return;
        }

        const response = await fetch("/api/image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
                currentModel,
                number,
            }),
        });
        console.log("Edge function returned.");

        console.log(response);

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data: Array<{}> = await response.json();

        if (!data) {
            return;
        }

        setRes(
            data.map((value) => {
                return value["url"] ?? "";
            })
        );

        setIsLoading(false);
    };

    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentModel(e.target.value);
    };

    return (
        <div className="flex justify-center">
            <select
                value={currentModel}
                onChange={handleModelChange}
                className="w-72 fixed top-20 left-5 outline-none border-none p-1 rounded-md text-white dark:hover:text-gray-400"
            >
                {models.map((model) => (
                    <option key={model} value={model}>
                        {model}
                    </option>
                ))}
            </select>

            <input
                name="Message"
                type="number"
                value={number}
                onChange={(e) => {
                    setNumber(parseInt(e.target.value));
                }}
                className="fixed top-20 right-5 p-1 rounded-md text-white dark:hover:bg-white dark:hover:text-black  disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
            />
            <div className="w-full mx-2 flex flex-col items-start gap-3 pt-6 last:mb-6 md:mx-auto md:max-w-3xl">
                {!isLoading
                    ? res.map((value) => {
                          return (
                              <div
                                  key={value}
                                  className="w-full aspect-[1/1] relative"
                              >
                                  <Image
                                      alt="ai generated image"
                                      src={value}
                                      fill
                                  />
                              </div>
                          );
                      })
                    : "Loading..."}
            </div>
            <form
                onSubmit={handleSubmit}
                className="fixed bottom-0 w-full md:max-w-3xl bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] mb-4"
            >
                <textarea
                    name="Message"
                    placeholder="Enter Image Query"
                    ref={messageInput}
                    onKeyDown={handleEnter}
                    className="w-full resize-none bg-transparent outline-none pt-4 pl-4 translate-y-1"
                />
                <button
                    disabled={isLoading}
                    type="submit"
                    className="absolute top-[1.4rem] right-5 p-1 rounded-md text-gray-500 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                >
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 20 20"
                        className="h-4 w-4 rotate-90"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ImageForm;
