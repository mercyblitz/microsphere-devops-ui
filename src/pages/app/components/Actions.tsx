import { Button } from "antd";
import type { ButtonType } from "antd/lib/button";

const Actions = (
  actions: BasicList.Action[] | undefined,
  actionHandler: () => void
) => {
  return (actions || []).map((action) => {
    switch (action.component) {
      case "button":
        return (
          <Button
            key={action.type}
            type={action.type as ButtonType}
            onClick={() => actionHandler(action)}
          >
            {action.text}
          </Button>
        );
    }
    return null;
  });
};

export default Actions;
