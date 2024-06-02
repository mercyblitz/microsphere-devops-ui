import { Form } from "antd";

import ItemControl from "./ItemControl";
import { resolveMessage } from "./utils";
import type { App } from "../data.d";

const FormItem = (field: App.FieldData) => {
  const { label, name, hidden, value } = field;
  const control = ItemControl(field);
  if (control) {
    return (
      <Form.Item
        label={resolveMessage(label)}
        name={name}
        hidden={hidden}
        initialValue={value}
      >
        {control}
      </Form.Item>
    );
  }
  return null;
};

export default FormItem;
