import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        // Extract todos from the body of the POST request
        const { todos } = await request.json();

        // Send the message to the OpenAI API
        const response = await openai.chat.completions.create({
            model: "text-curie-001",
            temperature: 0.8,
            n: 1,
            stream: false,
            messages: [
                {
                    "role": "system", 
                    "content": "When responding, welcome the user always as Mr. Noman and say welcome to Trello AI App! Limit response to 200 characters."
                },
                {
                    "role": "user", 
                    "content": `Hi there, provide a summary of the following todos. Count how many todos are in each category such as To do, in progress, and done, then tell the user to have a productive day! Here's the data: ${JSON.stringify(todos)}`
                }
            ],
        });

        // Return the generated message from OpenAI's response
        return NextResponse.json(response.choices[0].message);

    } catch (error) {

        // Handle the exception and return a null response
        console.error("OpenAI Error:", (error as Error).message);
        return NextResponse.json(null);
    }
}
