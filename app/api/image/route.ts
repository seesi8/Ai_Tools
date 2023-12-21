import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

type RequestData = {
    currentModel: string;
    message: string;
    number: number;
};

export const runtime = "edge";

export async function POST(request: Request) {
    const { currentModel, message, number } =
        (await request.json()) as RequestData;

    if (!message) {
        return new Response("No message in the request", { status: 400 });
    }

    const image = await openai.images.generate({
        model: currentModel,
        prompt: message,
        n: number,
    });

    return NextResponse.json(image.data);
}
