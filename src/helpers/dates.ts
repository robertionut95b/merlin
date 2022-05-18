export const isValidDate = (date: Date): boolean => {
  return (
    (date instanceof Date && !isNaN(date.valueOf())) ||
    (date instanceof Date && isFinite(date.valueOf()))
  );
};

export const validDateOrUndefined = (date: string): Date | undefined => {
  const d = new Date(date);
  return date && isValidDate(d) ? d : undefined;
};
