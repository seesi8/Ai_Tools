import type { NextPage } from "next";
import ImageForm from "@/components/ImageForm";
const Home: NextPage = () => {
    return (
        <div>
            <ImageForm modelsList={["dall-e-3", "dall-e-2"]} />
        </div>
    );
};
export default Home;
