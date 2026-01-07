import type { Dispatch, FC, ReactNode, Ref, RefAttributes } from "react";
import { createContext, isValidElement, useEffect, useState } from "react";
import { ChevronDown } from "@untitledui/icons";
import type { SelectProps as AriaSelectProps } from "react-aria-components";
import {
  Button as AriaButton,
  ListBox as AriaListBox,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
} from "react-aria-components";
import { Avatar } from "@/components/base/avatar/avatar";
import { HintText } from "@/components/base/input/hint-text";
import { Label } from "@/components/base/input/label";
import { cx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";
import { Popover } from "./popover";
import { SelectItem } from "./select-item";

export type SelectItemType = {
  id: string;
  label?: string;
  avatarUrl?: string;
  isDisabled?: boolean;
  supportingText?: string;
  icon?: FC | ReactNode;
};

export interface CommonProps {
  hint?: string;
  label?: string;
  tooltip?: string;
  size?: "sm" | "md";
  placeholder?: string;
}

interface SelectProps
  extends
  Omit<AriaSelectProps<SelectItemType>, "children" | "items">,
  RefAttributes<HTMLDivElement>,
  CommonProps {
  items?: SelectItemType[];
  popoverClassName?: string;
  placeholderIcon?: FC | ReactNode;
  children: ReactNode | ((item: SelectItemType) => ReactNode);
  selected: any;
  setSelected: Dispatch<React.SetStateAction<any>>;
}

interface SelectValueProps {
  isOpen: boolean;
  size: "sm" | "md";
  isFocused: boolean;
  isDisabled: boolean;
  placeholder?: string;
  ref?: Ref<HTMLButtonElement>;
  placeholderIcon?: FC | ReactNode;
  selected: string;
  setSelected: Dispatch<React.SetStateAction<any>>;
}

export const sizes = {
  sm: { root: "py-2 px-3", shortcut: "pr-2.5" },
  md: { root: "py-2.5 px-3.5", shortcut: "pr-3" },
};

const SelectValue = ({
  isOpen,
  isFocused,
  isDisabled,
  size,
  placeholder,
  placeholderIcon,
  ref,
  selected,
  setSelected
}: SelectValueProps) => {


  return (
    <AriaButton
      ref={ref}
      className={cx(
        "relative flex w-full cursor-pointer items-center rounded-lg bg-primary shadow-xs ring-1 ring-primary outline-hidden transition duration-100 ease-linear ring-inset",
        (isFocused || isOpen) && "ring-2 ring-brand",
        isDisabled && "cursor-not-allowed bg-disabled_subtle text-disabled",
      )}
    >
      <AriaSelectValue<SelectItemType>
        className={cx(
          "flex h-max w-full items-center justify-start gap-2 truncate text-left align-middle",

          // Icon styles
          "*:data-icon:size-5 *:data-icon:shrink-0 *:data-icon:text-fg-quaternary in-disabled:*:data-icon:text-fg-disabled",

          sizes[size].root,
        )}
      >
        {(state) => {
          // console.log(state);
          const selectedItem = state.selectedItems[0];
          if (selectedItem !== undefined && selectedItem?.id != selected) {
            // console.log(selectedItem?.id);
            // console.log(selected);
            setSelected(selectedItem);
          }
          const Icon = selectedItem?.icon || placeholderIcon;
          return (
            <>
              {selectedItem?.avatarUrl ? (
                <Avatar
                  size="xs"
                  src={selectedItem.avatarUrl}
                  alt={selectedItem.label}
                />
              ) : isReactComponent(Icon) ? (
                <Icon data-icon aria-hidden="true" />
              ) : isValidElement(Icon) ? (
                Icon
              ) : null}

              {selectedItem ? (
                <section className="flex w-full gap-2 truncate">
                  <p className="truncate text-sm font-medium text-primary">
                    {selectedItem?.label}
                  </p>
                  {selectedItem?.supportingText && (
                    <p className="text-sm text-tertiary">
                      {selectedItem?.supportingText}
                    </p>
                  )}
                </section>
              ) : (
                <p
                  className={cx(
                    "text-sm text-placeholder",
                    isDisabled && "text-disabled",
                  )}
                >
                  {placeholder}
                </p>
              )}

              <ChevronDown
                aria-hidden="true"
                className={cx(
                  "ml-auto shrink-0 text-fg-quaternary",
                  size === "sm" ? "size-4 stroke-[2.5px]" : "size-5",
                )}
              />
            </>
          );
        }}
      </AriaSelectValue>
    </AriaButton>
  );
};

export const SelectContext = createContext<{ size: "sm" | "md" }>({
  size: "sm",
});

const Select = ({
  placeholder = "Select",
  placeholderIcon,
  size = "sm",
  children,
  items,
  label,
  hint,
  tooltip,
  className,
  selected,
  setSelected,
  ...rest
}: SelectProps) => {

  const [selectedItem, setSelectedItem] = useState<SelectItemType | null>();

  useEffect(() => {
    if (selectedItem === undefined) return;
    if (setSelected !== undefined && selectedItem !== null && selectedItem.id !== selected) {
      setSelected(selectedItem.id);
    };
  }, [selectedItem])

  return (
    <SelectContext.Provider value={{ size }}>
      <AriaSelect
        {...rest}
        className={(state) =>
          cx(
            "flex flex-col gap-1.5",
            typeof className === "function" ? className(state) : className,
          )
        }
      >
        {(state) => {
          return (<>
            {label && (
              <Label isRequired={state.isRequired} tooltip={tooltip}>
                {label}
              </Label>
            )}

            <SelectValue
              {...state}
              {...{ size, placeholder }}
              placeholderIcon={placeholderIcon}
              selected={selected}
              setSelected={setSelectedItem}
            />

            <Popover size={size} className={rest.popoverClassName}>
              <AriaListBox items={items} className="size-full outline-hidden">
                {children}
              </AriaListBox>
            </Popover>

            {hint && <HintText isInvalid={state.isInvalid}>{hint}</HintText>}
          </>
          )
        }}
      </AriaSelect>
    </SelectContext.Provider>
  );
};

const _Select = Select as typeof Select & {
  // ComboBox: typeof ComboBox;
  Item: typeof SelectItem;
};
// _Select.ComboBox = ComboBox;
_Select.Item = SelectItem;

export { _Select as Select };
