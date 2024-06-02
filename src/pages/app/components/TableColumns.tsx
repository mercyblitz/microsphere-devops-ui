import moment from "moment";
import { Space, Tag } from "antd";
import type { ProColumns, ActionType } from "@ant-design/pro-table";

import Actions from "./Actions";
import type { App } from "../data.d";

const TableColumns = (columns: App.Namespace[] | undefined) => {
  const newColumns: App.Namespace[] = [
    { title: "ID", dataIndex: "id", key: "id" },
  ];
  (columns || []).forEach((column) => {
    if (column.hideInColumn !== true) {
      switch (column.type) {
        case "datatime":
          column.render = (value: any) => {
            return moment(value).format("YYYY-MM-DD HH:mm:ss");
          };
          break;
        case "switch":
          column.render = (value: any) => {
            const option = (column.data || []).find((item) => {
              return item.value === value;
            });
            return <Tag color={value ? "blue" : "red"}>{option?.title}</Tag>;
          };
          break;
        case "actions":
          column.render = (value: any) => {
            return <Space>{Actions(column.actions)}</Space>;
          };
          break;
      }
      newColumns.push(column);
    }
  });
  return newColumns;
};

function buildProColumns(field: App.Field): ProColumns<App.Namespace> {
  return {
    title: field.title,
    dataIndex: field.dataIndex,
    key: field.key,
    render: (dom, entity) => {},
  };
}
export default TableColumns;
