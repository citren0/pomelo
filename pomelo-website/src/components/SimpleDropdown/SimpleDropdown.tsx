
import "./SimpleDropdown.css";

export interface DropdownOption
{
    value: string;
    display: string;
};

interface Props
{
    label: string;
    id: string;
    options: DropdownOption[];
    onSelect: (value: string) => void;
}

const SimpleDropdown = ({label, id, options, onSelect}: Props) =>
{

    return (
        <>
            <div className="simple-dropdown-wrapper">
                <label
                    htmlFor={id}
                    className="simple-input-label"
                >
                    {label}
                </label>
                <select id={id} className="simple-dropdown-select">
                    { options.map((option) =>
                    {
                        return (
                            <>
                                <option key={option.value} value={option.value} onClick={() => onSelect(option.value)}>{option.display}</option>
                            </>
                        );
                    }) }
                </select>
            </div>
        </>
    );
};

export default SimpleDropdown;