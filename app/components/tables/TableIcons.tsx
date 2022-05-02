interface ISvgProps {
  size?: number;
}

const EditSvg = ({ size = 16 }: ISvgProps): JSX.Element => (
  <svg
    width={size}
    height={size}
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 21L12 21H21"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.2218 5.82839L15.0503 2.99996L20 7.94971L17.1716 10.7781M12.2218 5.82839L6.61522 11.435C6.42769 11.6225 6.32233 11.8769 6.32233 12.1421L6.32233 16.6776L10.8579 16.6776C11.1231 16.6776 11.3774 16.5723 11.565 16.3847L17.1716 10.7781M12.2218 5.82839L17.1716 10.7781"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ViewSvg = ({ size = 16 }: ISvgProps): JSX.Element => (
  <svg
    width={size}
    height={size}
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 12C19.1114 14.991 15.7183 18 12 18C8.2817 18 4.88856 14.991 3 12C5.29855 9.15825 7.99163 6 12 6C16.0084 6 18.7015 9.1582 21 12Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DeleteSvg = ({ size = 16 }: ISvgProps): JSX.Element => (
  <svg
    width={size}
    height={size}
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 11V20.4C19 20.7314 18.7314 21 18.4 21H5.6C5.26863 21 5 20.7314 5 20.4V11"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 17V11"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 17V11"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 7L16 7M3 7L8 7M8 7V3.6C8 3.26863 8.26863 3 8.6 3L15.4 3C15.7314 3 16 3.26863 16 3.6V7M8 7L16 7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FileSvg = ({ size = 16 }: ISvgProps): JSX.Element => (
  <svg
    width={size}
    height={size}
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 3L5 3C3.89543 3 3 3.89543 3 5L3 19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 7L17 7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 12L17 12"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 17L13 17"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FilterSvg = ({ size = 16 }: ISvgProps): JSX.Element => (
  <svg
    width={size}
    height={size}
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.99961 3H19.9997C20.552 3 20.9997 3.44764 20.9997 3.99987L20.9999 5.58569C21 5.85097 20.8946 6.10538 20.707 6.29295L14.2925 12.7071C14.105 12.8946 13.9996 13.149 13.9996 13.4142L13.9996 19.7192C13.9996 20.3698 13.3882 20.8472 12.7571 20.6894L10.7571 20.1894C10.3119 20.0781 9.99961 19.6781 9.99961 19.2192L9.99961 13.4142C9.99961 13.149 9.89425 12.8946 9.70672 12.7071L3.2925 6.29289C3.10496 6.10536 2.99961 5.851 2.99961 5.58579V4C2.99961 3.44772 3.44732 3 3.99961 3Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CancelSvg = ({ size = 16 }: ISvgProps): JSX.Element => (
  <svg
    width={size}
    height={size}
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export { EditSvg, ViewSvg, DeleteSvg, FileSvg, FilterSvg, CancelSvg };
