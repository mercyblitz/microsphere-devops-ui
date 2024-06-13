import type { I18n } from "./data.d";

import { List } from "antd";

const ContentList: React.FC<{ content: I18n.LocaledText }> = ({ content }) => {
  const data = Object.keys(content).map((key) => {
    return {
      title: key,
    };
  });

  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={item.title}
            description={content[item.title]}
          />
        </List.Item>
      )}
    />
  );
};

export default ContentList;
