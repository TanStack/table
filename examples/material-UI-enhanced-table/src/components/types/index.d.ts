import { Column } from "react-table";

declare module "fraud-profiling" {
  export type Data = object;
  export interface TableProps {
    columns: Column<Data>[];
    data: Data[];
    updateMyData: Function;
    onChangeSort: Function;
    skipPageReset: boolean;
  }

  export interface ColumnData {
    Header: string;
    id: string;
    isVisible: boolean;
  }

  export interface ModalProps {
    columns: Column<ColumnData>[];
    closeModalHandler: Function;
    open: boolean;
    saveSettings: Function;
  }
}
