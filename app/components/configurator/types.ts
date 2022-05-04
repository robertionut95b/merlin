export type SeatsConfiguration = {
  row: number;
  column: number;
};

export type TheatreConfiguration = {
  rows: number;
  columns: number;
  spots: SeatsConfiguration[];
  setSpots?: React.Dispatch<React.SetStateAction<SeatsConfiguration[]>>;
  setRows?: React.Dispatch<React.SetStateAction<number>>;
  setColumns?: React.Dispatch<React.SetStateAction<number>>;
};
