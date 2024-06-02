import { Input, DatePicker, TreeSelect, Switch } from "antd";
const { TextArea } = Input;
import type { App } from "../data.d";

const ItemControl = (field: App.FieldData) => {
  const { type, disabled = false, value } = field;
  switch (type) {
    case "text":
      return <Input value={value} disabled={disabled} />;
    case "textarea":
      return <TextArea value={value} disabled={disabled} showCount />;
    case "datetime":
      return <DatePicker showTime={true} value={value} disabled={disabled} />;
    case "tree":
      return <TreeSelect treeData={value} disabled={disabled} />;
    case "switch":
      return <Switch checked={value} disabled={disabled} />;
    default:
      return null;
  }
};

export default ItemControl;
