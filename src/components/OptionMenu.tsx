import {
    createElement,
    CSSProperties,
    Fragment,
    ReactElement,
    useEffect,
    useRef,
    useState,
    MouseEvent,
    useMemo
} from "react";
import Option from "./Option";
import { focusModeEnum } from "typings/general";
import {
    OptionsStyleSetEnum,
    OptionsStyleSingleEnum,
    SelectStyleEnum
} from "typings/SearchableReferenceSelectorMxNineProps";
import { IOption } from "typings/option";
import classNames from "classnames";

interface OptionMenuProps {
    id: string;
    options: IOption[];
    currentFocus: number;
    onSelect: (selectedOption: IOption) => void;
    onSelectMoreOptions: (() => void) | undefined;
    noResultsText: string;
    maxMenuHeight: string | undefined;
    moreResultsText: string | undefined;
    optionsStyle: OptionsStyleSetEnum | OptionsStyleSingleEnum;
    selectStyle: SelectStyleEnum;
    position?: DOMRect;
    hasMoreOptions: boolean;
    isLoading: boolean;
    allowLoadingSelect: boolean;
    loadingText: string;
    multiSelect: boolean;
    mxFilter: string;
}

const OptionsMenu = (props: OptionMenuProps): ReactElement => {
    const selectedObjRef = useRef<HTMLLIElement>(null);
    const [focusMode, setFocusMode] = useState<focusModeEnum>(
        props.currentFocus !== undefined ? focusModeEnum.arrow : focusModeEnum.hover
    );

    const contentCloseToBottom = useMemo(
        () => (props.position ? props.position.y > window.innerHeight * 0.7 : 0),
        [props.position]
    );

    const OptionMenuStyle = useMemo(
        (): CSSProperties =>
            props.selectStyle === "dropdown" && props.position !== undefined
                ? {
                      maxHeight: props.maxMenuHeight ? props.maxMenuHeight : undefined,
                      top: contentCloseToBottom ? "unset" : props.position.height + props.position.y,
                      bottom: contentCloseToBottom ? window.innerHeight - props.position.y : "unset",
                      width: props.position.width,
                      left: props.position.x
                  }
                : {
                      maxHeight: props.maxMenuHeight ? props.maxMenuHeight : undefined
                  },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.position, props.maxMenuHeight]
    );

    // keep the selected item in view when using arrow keys
    useEffect(() => {
        if (selectedObjRef.current) {
            selectedObjRef.current.scrollIntoView({ block: "center" });
        }
        setFocusMode(focusModeEnum.arrow);
    }, [props.currentFocus]);

    return (
        <Fragment>
            <ul
                id={props.id + "-listbox"}
                className={classNames(
                    "srs-menu",
                    { "srs-dropdown": props.selectStyle === "dropdown" },
                    { "srs-list": props.selectStyle === "list" },
                    { wait: props.isLoading && !props.allowLoadingSelect }
                )}
                style={OptionMenuStyle}
                onMouseMove={() => setFocusMode(focusModeEnum.hover)}
                role="listbox"
                aria-labelledby={props.id + "-label"}
                aria-activedescendant={`${props.id}-${props.currentFocus === -1 ? 0 : props.currentFocus}`}
                aria-multiselectable={props.multiSelect ? "true" : "false"}
                aria-busy={props.isLoading ? "true" : "false"}
            >
                {props.options.length > 0 ? (
                    <Fragment>
                        {props.isLoading && (
                            <li className="mx-text srs-infooption disabled" role="option">
                                {props.loadingText}
                            </li>
                        )}
                        {props.options.map((option, key) => (
                            <li
                                id={`${props.id}-${key}`}
                                key={key}
                                ref={key === props.currentFocus ? selectedObjRef : undefined}
                                role="option"
                                aria-selected={option.isSelectable ? (option.isSelected ? "true" : "false") : undefined}
                                aria-description={
                                    option.isSelected ? "selected" : !option.isSelectable ? "not selectable" : undefined
                                }
                            >
                                <Option
                                    isFocused={key === props.currentFocus}
                                    onSelect={selectedOption => {
                                        if (props.allowLoadingSelect || !props.isLoading) {
                                            props.onSelect(selectedOption);
                                        }
                                    }}
                                    focusMode={focusMode}
                                    optionsStyle={props.optionsStyle}
                                    option={option}
                                />
                            </li>
                        ))}
                        {props.hasMoreOptions && (
                            <li
                                id={`${props.id}-${props.options.length}`}
                                key={props.options.length}
                                ref={props.currentFocus === props.options.length ? selectedObjRef : undefined}
                                role="option"
                                aria-selected={props.isLoading ? undefined : "true"}
                            >
                                <div
                                    className={
                                        props.currentFocus === props.options.length
                                            ? "srs-option focused"
                                            : "mx-text srs-infooption"
                                    }
                                    style={{ cursor: props.onSelectMoreOptions ? "pointer" : "default" }}
                                    onClick={(event: MouseEvent<HTMLDivElement>) => {
                                        if (
                                            (props.allowLoadingSelect || !props.isLoading) &&
                                            props.onSelectMoreOptions !== undefined
                                        ) {
                                            event.stopPropagation();
                                            props.onSelectMoreOptions();
                                        }
                                    }}
                                >
                                    {props.isLoading ? props.loadingText : props.moreResultsText}
                                </div>
                            </li>
                        )}
                    </Fragment>
                ) : (
                    <li id={`${props.id}-0`} role="option" aria-description="not selectable">
                        <div className="mx-text srs-infooption">
                            {props.isLoading
                                ? props.loadingText
                                : props.mxFilter !== ""
                                ? `${props.noResultsText} by search: ${props.mxFilter}`
                                : props.noResultsText}
                        </div>
                    </li>
                )}
            </ul>
        </Fragment>
    );
};

export default OptionsMenu;
