import { Inter } from "next/font/google";
import Form from "@/components/Form";
import Header from "@/components/Header";
import type OpenAI from "openai";

const inter = Inter({ subsets: ["latin"] });

function getBaseURL() {
    if (typeof process.env.VERCEL_URL === "string") {
        return `https://chatgpt.shivanshu.in`;
    }
    return "http://localhost:3000";
}

export default async function Home() {
    // console.log(modelsList)
    return (
        <main className={inter.className}>
            <Header />
            <Form
                modelsList={["gpt-4", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"]}
            />
        </main>
    );
}
