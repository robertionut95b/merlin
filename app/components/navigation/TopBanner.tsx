import { Alert } from "@mantine/core";
import { AlertCircle } from "../react-icons/AlertCircle";

const TopBanner = ({
  message,
  title,
  className,
}: {
  message: React.ReactNode;
  title?: string;
  className?: string;
}): JSX.Element => {
  return (
    <Alert
      className={className}
      icon={<AlertCircle size={16} />}
      title={title}
      color="red"
    >
      {message}
    </Alert>
  );
};

export default TopBanner;
