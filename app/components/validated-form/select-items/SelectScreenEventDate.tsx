import { Avatar, Group, Text } from "@mantine/core";
import { forwardRef } from "react";

interface Props extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
  location: string;
}

const SelectScreenEventDate = forwardRef<HTMLDivElement, Props>(
  ({ image, label, description, location, ...others }: Props, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" color="gray">
            {description}
          </Text>
          <Text size="xs" color="dimmed">
            {location}
          </Text>
        </div>
      </Group>
    </div>
  )
);

SelectScreenEventDate.displayName = "SelectScreenEventDate";

export default SelectScreenEventDate;
