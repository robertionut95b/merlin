import { Button } from "@mantine/core";
import { useLocation, useNavigate } from "@remix-run/react";

const TheatresPage = (): JSX.Element => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div className="grid grid-cols-1 gap-y-4">
        Theatres
        <Button
          variant="outline"
          onClick={() => navigate(`${pathname}/new`, { replace: true })}
        >
          Create
        </Button>
      </div>
    </>
  );
};

export default TheatresPage;
