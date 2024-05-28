import { FunctionComponent, createElement, ReactElement } from "react";
export interface AlertProps {
    id: string;
    alertStyle?: "default" | "primary" | "success" | "info" | "warning" | "danger";
    className?: string;
    children: ReactElement | string;
}
export const Alert: FunctionComponent<AlertProps> = ({ id, alertStyle = "danger", children }): ReactElement | null =>
    children ? (
        <div className="alert-wrapper srs-alert" role="alert">
            <div id={`${id}-error`} className={`alert alert-${alertStyle} mx-validation-message`}>
                {children}
            </div>
        </div>
    ) : null;
