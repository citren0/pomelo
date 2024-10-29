
import Image from "next/image";
import "./InputError.css";

interface Props
{
    text: string;
};

const InputError = ({ text }: Props) =>
{
    return (
        <>
            <div className="input-error-wrapper">
                <Image src={"/assets/warning.svg"} height={28} width={28} alt="Warning icon." />
                <span className="input-error-text">{text}</span>
            </div>
        </>
    );
};

export default InputError;