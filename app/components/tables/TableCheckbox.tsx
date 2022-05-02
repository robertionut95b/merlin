import { Checkbox } from "@mantine/core";
import React, { useEffect } from "react";

interface Props {
  indeterminate?: boolean;
  name: string;
}

// @ts-expect-error("Type error on refs")
const useCombinedRefs = (...refs): React.MutableRefObject<any> => {
  const targetRef = React.useRef();

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};

export const TableCheckbox = React.forwardRef<HTMLInputElement, Props>(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef(null);
    const combinedRef = useCombinedRefs(ref, defaultRef);

    useEffect(() => {
      if (combinedRef?.current) {
        combinedRef.current.indeterminate = indeterminate ?? false;
      }
    }, [combinedRef, indeterminate]);

    return <Checkbox ref={defaultRef} {...rest} color={"violet"} />;
  }
);

TableCheckbox.displayName = "TableCheckbox";
