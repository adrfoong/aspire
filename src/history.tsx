import React, {
  InputHTMLAttributes,
  StyleHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header>Component</header>
      <TagField />
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
}

const RemoveIcon = () => {
  return <span className="remove-icon">×</span>;
};

const ErrorIcon = () => {
  return <span className="error-icon">!</span>;
};

const Tag: React.FC<Tag> = ({ children, state }) => {
  if (state === "error") {
    return (
      <span className="tag tag-error">
        {children}
        <ErrorIcon />
      </span>
    );
  }

  return (
    <span className="tag">
      {children}
      <RemoveIcon />
    </span>
  );
};

const ITEMS = [
  { label: "eric@asda.cd" },
  { label: "eric@asd2a.cd" },
  { label: "eric@as3da.cd" },
  { label: "erasdas2222dasdasdic@asda.cdd" },
  { label: "erasdaseeedasdasdic@asda.cdd" },
  { label: "erasdas222dasdasdic@asda.cdd" },
  { label: "erasd111asdasdasdic@asda.cdd" },
];

export const TagField = () => {
  const [tags, setTags] = useState([
    { label: "theresa@outlook.com", valid: true },
    { label: "eric", valid: false },
  ]);
  return (
    <>
      <div className="tag-field">
        {tags.map((tag) => (
          <Tag state={tag.valid ? undefined : "error"}>{tag.label}</Tag>
        ))}
        <AutocompleteInputField placeholder="Enter recipients..." />
      </div>
    </>
  );
};

interface Menu {
  items: { label: string }[];
  style?: React.CSSProperties;
}

interface DropdownMenu extends Menu {
  isOpen: boolean;
}

const useDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return {
    DropdownMenu,
    toggleMenu: () => setIsOpen(!isOpen),
  };

  // return (
  //   <DropdownMenu items={items} />
  // )
};

interface AutocompleteInputField
  extends InputHTMLAttributes<HTMLInputElement> {}

const AutocompleteInputField: React.FC<AutocompleteInputField> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rect = inputRef.current?.getBoundingClientRect();
  return (
    <>
      <InputField
        ref={inputRef}
        onFocus={() => setIsOpen(true)}
        // onBlur={() => setIsOpen(false)}
      />
      {isOpen ? (
        <Menu
          style={{
            position: "absolute",
            top: rect?.y + 20 + "px",
            left: rect?.x + "px",
          }}
          items={ITEMS}
        />
      ) : null}
    </>
  );
};

const DropdownMenu: React.FC<DropdownMenu> = ({ items, isOpen }) => {
  if (isOpen) {
    return <Menu items={items} />;
  }

  return null;
};

const useKeyPressed = (targetKey: string) => {
  const [keyPressed, setKeyPressed] = useState(false);
  useEffect(() => {
    const keyDownHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };

    const keyUpHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, [targetKey]);

  return keyPressed;
};

const Menu: React.FC<Menu> = ({ items, style }) => {
  const upArrowPressed = useKeyPressed("ArrowUp");
  const downArrowPressed = useKeyPressed("ArrowDown");

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (upArrowPressed) {
      setSelectedIndex(Math.max(0, selectedIndex - 1));
    }
  }, [upArrowPressed]);

  useEffect(() => {
    if (downArrowPressed) {
      setSelectedIndex(Math.min(selectedIndex + 1, items.length - 1));
    }
  }, [downArrowPressed]);

  return (
    <ul className="dropdown-menu" style={style}>
      {items.map((item, i) => (
        <MenuItem key={item.label} tabIndex={i === selectedIndex ? 0 : -1}>
          {item.label}
        </MenuItem>
      ))}
    </ul>
  );
};

interface MenuItem {
  tabIndex: number;
}

const MenuItem: React.FC<MenuItem> = ({ tabIndex, children }) => {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (tabIndex === 0) {
      ref.current?.focus();
    }
  });

  return (
    <li ref={ref} tabIndex={tabIndex}>
      {children}
    </li>
  );
};

export default App;
