
"use client";
import { useEffect, useState } from "react";
import "./Modal.css";
import Image from "next/image";


interface Props
{
    content: React.ReactNode;
    title: string;
    triggerOpen?: boolean;
    triggerOpenDone?: () => void;
}

const Modal = ({ content, title, triggerOpen, triggerOpenDone }: Props) =>
{
    const [ isOpen, setIsOpen ] = useState<boolean>(false);

    useEffect(() =>
    {
        if (triggerOpen == true)
        {
            setIsOpen(true);
            triggerOpenDone?.();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerOpen]);

    return (
        <>
            { isOpen && <>
                <div className="modal-wrapper">
                    <div className="modal-top-bar">
                        <span className="modal-title">{title}</span>
                        <button className="btn-image" onClick={() => setIsOpen(false)}>
                            <Image src="/assets/x.svg" height={32} width={32} alt={"Exit button."} />
                        </button>
                    </div>
                    <hr className="hr-100" />
                    <div className="modal-content">
                        {content}
                    </div>
                </div>
            </> }
        </>
    );
};

export default Modal;