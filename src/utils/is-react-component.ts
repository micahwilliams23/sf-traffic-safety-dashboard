import type { FC, ReactNode } from "react";

/**
 * Type guard to check if a value is a React functional component.
 * Used to differentiate between a component function and a rendered ReactNode.
 */
export function isReactComponent(
  value: FC<{ className?: string }> | ReactNode,
): value is FC<{ className?: string }> {
  return typeof value === "function";
}
