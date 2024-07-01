import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const ReactMarkdown = ({ children }: Props) => {
    return <div>{children}</div>;
};

export default ReactMarkdown;
