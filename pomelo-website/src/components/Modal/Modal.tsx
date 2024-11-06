
"use client";
import { useEffect, useState } from "react";
import "./Modal.css";
import Image from "next/image";


interface Props
{
    title: string;
    triggerOpen?: boolean;
    triggerOpenDone?: () => void;
}

const Modal = ({ title, triggerOpen, triggerOpenDone }: Props) =>
{
    const [ isOpen, setIsOpen ] = useState<boolean>(false);

    useEffect(() =>
    {
        if (triggerOpen == true)
        {
            setIsOpen(true);
            triggerOpenDone?.();
        }
    }, [triggerOpen]);

    return (
        <>
            <div className="modal-wrapper">
                <div className="modal-top-bar">
                    <span className="modal-title">{title}</span>
                    <button className="btn-image" onClick={() => setIsOpen(false)}>
                        <Image src="/assets/x.svg" height={32} width={32} alt={"Exit button."} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Modal;