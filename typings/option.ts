import { ReactNode } from "react";
import { ObjectItem } from "mendix";

type boolOption = {
    selectionType: "BOOLEAN";
    id: boolean;
};

type enumOption = {
    selectionType: "ENUMERATION";
    id: string;
};

type refOption = {
    selectionType: "REFERENCE";
    id: ObjectItem;
};

export type IOption = {
    isSelected: boolean;
    isSelectable: boolean;
    content: ReactNode;
    badgeContent?: ReactNode;
    ariaLiveText?: string;
} & (enumOption | refOption | boolOption);
