import OpenAI from "openai";

const openai = new OpenAI();

type RequestData = {
    currentModel: string;
    message: string;
    history: any;
};

export const runtime = "edge";

export async function POST(request: Request) {
    const { currentModel, message, history } =
        (await request.json()) as RequestData;

    console.log(currentModel);

    if (!message) {
        return new Response("No message in the request", { status: 400 });
    }

    const messages = history.map((item: string, index: number) => {
        if (index % 2 === 0) {
            return { role: "user", content: item };
        } else {
            return { role: "assistant", content: item };
        }
    });

    const completion = await openai.chat.completions.create({
        model: currentModel,
        messages: [...messages, { role: "user", content: message }],
        stream: true,
    });

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            for await (const part of completion) {
                const text = part.choices[0]?.delta.content ?? "";
                const chunk = encoder.encode(text);
                controller.enqueue(chunk);
            }
            controller.close();
        },
    });

    return new Response(stream);
}
