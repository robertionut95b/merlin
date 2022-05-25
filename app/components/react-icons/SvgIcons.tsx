export interface ISvgProps {
  width?: number;
  height?: number;
}

export const GithubSvg = ({ width = 22, height = 22 }: ISvgProps) => (
  <img
    width={width}
    height={height}
    src="/images/github-logo.svg"
    alt="github-logo"
  />
);
export const FacebookSvg = ({ width = 22, height = 22 }: ISvgProps) => (
  <img
    width={width}
    height={height}
    src="/images/facebook-logo.svg"
    alt="facebook-logo"
  />
);
export const GoogleSvg = ({ width = 22, height = 22 }: ISvgProps) => (
  <img
    width={width}
    height={height}
    src="/images/google-logo.svg"
    alt="google-logo"
  />
);
