import { IMenuOptionProps } from "./Items";
import ManagementMenuItem from "./ManagementMenuItem";

const ManagementMenu = ({
  options,
}: {
  options: IMenuOptionProps[];
}): JSX.Element => {
  return (
    <>
      {options.map((option, idx) => (
        <ManagementMenuItem key={idx} {...option} />
      ))}
    </>
  );
};

export default ManagementMenu;
