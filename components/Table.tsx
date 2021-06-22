import React, { useEffect, useState } from "react";
import { DataTable } from "react-native-paper";

interface TableProps<T> {
  headers: string[];
  data: T[];
}

const optionsPerPage = [5, 10];

export function Table<T>({ headers, data }: TableProps<T>) {
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);

  useEffect(() => {
    setPage(1);
  }, [itemsPerPage]);

  return (
    <DataTable>
      <DataTable.Header>
        {headers.map((h) => (
          <DataTable.Title>{h}</DataTable.Title>
        ))}
      </DataTable.Header>

      {data
        .slice(
          itemsPerPage * (page - 1),
          Math.min(itemsPerPage * (page - 1) + itemsPerPage, data.length)
        )
        .map((d) => (
          <DataTable.Row>
            {Object.keys(d).map((p) => {
              let key = p as keyof T;
              if (typeof d[key] === "number") {
                return <DataTable.Cell numeric>{d[key]}</DataTable.Cell>;
              } else {
                return <DataTable.Cell>{d[key]}</DataTable.Cell>;
              }
            })}
          </DataTable.Row>
        ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(data.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${itemsPerPage * (page - 1)} - ${Math.min(
          itemsPerPage * (page - 1) + itemsPerPage,
          data.length - 1
        )} of ${data.length}`}
        showFastPaginationControls
        numberOfItemsPerPageList={optionsPerPage}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        selectPageDropdownLabel={"Rows per page"}
      />
    </DataTable>
  );
}
