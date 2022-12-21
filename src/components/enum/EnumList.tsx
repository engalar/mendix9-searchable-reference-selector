import { createElement, useState, useRef, ReactElement, ChangeEvent, Fragment } from "react";
import { WebIcon } from "mendix";
import OptionsMenu from "../enum/OptionsMenu";
import { OptionsStyleSingleEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import { EnumOption } from "typings/general";
import handleKeyNavigation from "../../utils/enum/handleKeyNavigation";
import handleClear from "../../utils/handleClear";
import MxIcon from "../MxIcon";
import SearchInput from "../enum/SearchInput";
import useOnClickOutside from "src/custom hooks/useOnClickOutside";
import focusSearchInput from "src/utils/focusSearchInput";
// import LoadingIndicator from "../LoadingIndicator";

interface EnumListProps {
    name: string;
    tabIndex: number | undefined;
    placeholder: string | undefined;
    noResultsText: string;
    options: EnumOption[];
    currentValue: EnumOption | undefined;
    onSelectEnum: (newEnumValue: string | undefined) => void;
    mxFilter: string;
    setMxFilter: (newFilter: string) => void;
    isClearable: boolean;
    clearIcon: WebIcon | undefined;
    isSearchable: boolean;
    isReadOnly: boolean;
    optionsStyle: OptionsStyleSingleEnum;
    // isLoading:Boolean;
}

const EnumList = ({
    isClearable,
    isReadOnly,
    isSearchable,
    mxFilter,
    name,
    onSelectEnum,
    options,
    optionsStyle,
    setMxFilter,
    clearIcon,
    currentValue,
    noResultsText,
    placeholder,
    tabIndex
}: // isLoading
EnumListProps): ReactElement => {
    const [focusedEnumIndex, setFocusedEnumIndex] = useState<number>(-1);
    const [searchInput, setSearchInput] = useState<HTMLInputElement | null>(null);
    const sesRef = useRef(null);

    useOnClickOutside(sesRef, () => {
        // handle click outside
        setFocusedEnumIndex(-1);
        setMxFilter("");
    });

    const onSelectHandler = (selectedEnum: string | undefined): void => {
        if (currentValue === selectedEnum && isClearable) {
            onSelectEnum(undefined);
        } else {
            onSelectEnum(selectedEnum);
        }
        setMxFilter("");
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setMxFilter(value);
        setFocusedEnumIndex(0);
    };

    return (
        <Fragment>
            {isSearchable && (
                <div
                    className={"form-control"}
                    tabIndex={tabIndex || 0}
                    onKeyDown={event =>
                        handleKeyNavigation(
                            event,
                            focusedEnumIndex,
                            setFocusedEnumIndex,
                            options,
                            onSelectHandler,
                            isReadOnly
                        )
                    }
                    onClick={() => focusSearchInput(searchInput, 300)}
                    ref={sesRef}
                >
                    <SearchInput
                        currentValue={currentValue}
                        isReadOnly={isReadOnly}
                        isSearchable={isSearchable}
                        mxFilter={mxFilter}
                        name={name}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        setRef={newRef => setSearchInput(newRef)}
                    />

                    <div className="srs-icon-row">
                        {/* {isLoading && <LoadingIndicator />} */}
                        {isClearable && !isReadOnly && (
                            <MxIcon
                                onClick={event =>
                                    handleClear(
                                        event,
                                        mxFilter,
                                        setMxFilter,
                                        setFocusedEnumIndex,
                                        onSelectHandler,
                                        searchInput
                                    )
                                }
                                title={"Clear"}
                                mxIconOverride={clearIcon}
                                defaultClassName="remove"
                            />
                        )}
                    </div>
                </div>
            )}
            {!isReadOnly && (
                <div className="form-control srs-selectable-list">
                    <OptionsMenu
                        onSelectOption={(newEnumValue: string | undefined) => {
                            onSelectHandler(newEnumValue);
                        }}
                        currentValue={currentValue}
                        currentFocus={options[focusedEnumIndex]}
                        noResultsText={noResultsText}
                        optionsStyle={optionsStyle}
                        selectStyle={"list"}
                        isReadyOnly={isReadOnly}
                        options={options}
                    />
                    {isSearchable === false && isClearable && (
                        <MxIcon
                            onClick={event =>
                                handleClear(
                                    event,
                                    mxFilter,
                                    setMxFilter,
                                    setFocusedEnumIndex,
                                    onSelectHandler,
                                    searchInput
                                )
                            }
                            title={"Clear"}
                            mxIconOverride={clearIcon}
                            defaultClassName="remove"
                        />
                    )}
                </div>
            )}
        </Fragment>
    );
};

export default EnumList;
