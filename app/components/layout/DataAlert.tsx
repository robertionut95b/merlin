import { Alert } from "@mantine/core";

const DataAlert = ({ message }: { message: string }): JSX.Element => {
  return (
    <Alert
      classNames={{
        icon: "h-10 w-10",
      }}
      title={
        <div className="flex flex-row-reverse items-center gap-x-1">
          Data error{" "}
          <svg
            width="18"
            height="18"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.0429 21H3.95705C2.41902 21 1.45658 19.3364 2.22324 18.0031L10.2662 4.01533C11.0352 2.67792 12.9648 2.67791 13.7338 4.01532L21.7768 18.0031C22.5434 19.3364 21.581 21 20.0429 21Z"
              stroke="currentColor"
              strokeLinecap="round"
            />
            <path d="M12 9V13" stroke="currentColor" strokeLinecap="round" />
            <path
              d="M12 17.01L12.01 16.9989"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      }
      color="red"
      icon={<img src="/images/broken.svg" alt="broken" />}
    >
      <p className="font-base mt-2">{message}</p>
    </Alert>
  );
};

export default DataAlert;
