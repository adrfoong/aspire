import React, { InputHTMLAttributes, useEffect, useRef, useState } from "react";

import { useCombobox } from "downshift";
import EMAILS from "./email.json";
// import { TagField as OldTagField } from "./history";

import "./App.css";

// Mock network request for emails
const getDataFromServer = async () => {
  return EMAILS;
};

type Email = string;

function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getDataFromServer();
      setEmails(data);
    };

    fetchData();
  });

  return (
    <div className="App">
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 30,
          alignItems: "center",
        }}
      >
        <h1>Email Input Component</h1>
        {/* <OldTagField /> */}
        <div>
          <TagField
            options={emails}
            initialOptions={[
              "sporer.roxanne@hotmail.com",
              "cedrick.harvey@gmail.com",
            ]}
          />
        </div>

        <div
          style={{
            width: 500,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <label>Fixed width (500px)</label>
          <TagField
            options={emails}
            initialOptions={[
              "sporer.roxanne@hotmail.com",
              "cedrick.harvey@gmail.com",
            ]}
          />
        </div>
      </main>
    </div>
  );
}

const InputField = React.forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return <input ref={ref} className="input-field" {...props} />;
});

interface Tag {
  state?: "error";
  removeTag: (item: any) => void;
}

const RemoveIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <span className="remove-icon" onClick={onClick}>
      ×
    </span>
  );
};

const ErrorIcon = () => {
  return <span className="error-icon">!</span>;
};

const Tag: React.FC<Tag> = ({ children, state, removeTag }) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  if (state === "error" && !isMouseOver) {
    return (
      <span
        className="tag tag-error"
        onMouseOver={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        {children}
        <ErrorIcon />
      </span>
    );
  }

  return (
    <span
      className="tag"
      onMouseOver={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      {children}
      <RemoveIcon onClick={() => removeTag(children)} />
    </span>
  );
};

interface TagField<T> {
  options: T[];
  initialOptions?: T[];
}

const TagField = <T extends string>({
  options,
  initialOptions = [],
}: TagField<T>) => {
  const [tags, setTags] = useState(initialOptions);
  return (
    <>
      <div className="tag-field">
        {tags.map((tag) => (
          <Tag
            state={options.includes(tag) ? undefined : "error"}
            removeTag={(item) => {
              setTags(tags.filter((tag) => tag !== item));
            }}
          >
            {tag}
          </Tag>
        ))}
        <AutocompleteInputField
          placeholder="Enter recipients..."
          options={options}
          onItemSelected={(selectedItem) => {
            setTags([...tags, selectedItem]);
          }}
        />
      </div>
    </>
  );
};

interface Menu {
  style?: React.CSSProperties;
}

interface AutocompleteInputField extends InputHTMLAttributes<HTMLInputElement> {
  onItemSelected: (item: any) => void;
  options: any[];
}

const AutocompleteInputField: React.FC<AutocompleteInputField> = ({
  placeholder,
  options,
  onItemSelected,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputItems, setInputItems] = useState(options);
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      if (inputValue) {
        setInputItems(
          options
            .filter((item) =>
              item.toLowerCase().startsWith(inputValue.toLowerCase())
            )
            // Shorten list for performance
            .slice(0, 50)
        );
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onItemSelected(selectedItem);
        // Make sure to clear input after submitting
        selectItem(null);
      }
    },
  });

  // Calculate dropdown menu position
  const rect = inputRef.current?.getBoundingClientRect() ?? { x: 0, y: 0 };
  const top = rect.y + 40;
  const left = rect.x;

  return (
    <>
      <div {...getComboboxProps()}>
        <InputField
          {...getInputProps({
            ref: inputRef,

            onKeyDown: (event) => {
              if (event.key === "Enter") {
                /**
                 * Downshift does not allow options that are not in the initial list.
                 * This allows entries that are not in the list.
                 */
                if (!inputItems.includes(event.currentTarget.value)) {
                  selectItem(event.currentTarget.value);
                }
              }
            },
          })}
          placeholder={placeholder}
        />
      </div>
      <Menu
        {...getMenuProps()}
        style={{
          position: "absolute",
          top,
          left,
        }}
      >
        {isOpen
          ? inputItems.map((item, i) => (
              <MenuItem
                key={item}
                selected={highlightedIndex === i}
                {...getItemProps({ index: i, item })}
              >
                {item}
              </MenuItem>
            ))
          : null}
      </Menu>
    </>
  );
};

const Menu: React.FC<Menu> = React.forwardRef<HTMLUListElement, Menu>(
  ({ children, style, ...props }, ref) => {
    return (
      <ul className="dropdown-menu" ref={ref} {...props} style={style}>
        {children}
      </ul>
    );
  }
);

interface MenuItem {
  selected?: boolean;
}

const MenuItem: React.FC<MenuItem> = React.forwardRef<HTMLLIElement, MenuItem>(
  ({ children, selected, ...props }, ref) => {
    return (
      <li
        ref={ref}
        style={{
          backgroundColor: selected ? "#eff5f9" : "initial",
        }}
        {...props}
      >
        {children}
      </li>
    );
  }
);

export default App;
