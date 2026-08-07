import type { SVGProps } from "react";
import { AppIcons, type IconName } from "../icons/icons";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({
  name,
  size = 18,
  ...props
}: IconProps) {
  const Component = AppIcons[name];

  return (
    <Component
      size={size}
      {...props}
    />
  );
}
