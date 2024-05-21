import Select, { MultiValue } from "react-select";
import makeAnimated from "react-select/animated";

export type Option = {
  value: string;
  label: string;
};

type MultiSelectDropdownProps = {
  options: string[];
  placeholder: string;
  onChange: (selectedOptions: Option[] | null) => void;
  value: Option[] | null;
};
const animatedComponents = makeAnimated();

export const MultiSelectDropdown = ({
  options,
  placeholder,
  onChange,
  value,
}: MultiSelectDropdownProps) => {
  // const [selectedOptions, setSelectedOptions] = useState<Option[] | null>(null);

  const handleSelectionChange = (newValue: MultiValue<Option>) => {
    onChange(newValue as Option[]);
    /* if (newValue) {
            setSelectedOptions(newValue as Option[]);
            onChange(newValue as Option[]);
        } else {
            setSelectedOptions(null);
            onChange(null);
        } */
  };

  return (
    <Select
      isMulti
      value={value}
      onChange={handleSelectionChange}
      options={options.map((option) => ({ value: option, label: option }))}
      placeholder={placeholder}
      components={animatedComponents}
      closeMenuOnSelect={false}
    />
  );
};
