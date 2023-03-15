const getHeaderCsv = (cols: any) => {
  return cols.map((d: any) => {
    return {
      label: d.Header,
      key: d.accessor,
    };
  });
};

export default getHeaderCsv;
