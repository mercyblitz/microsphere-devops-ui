import type { I18n } from "./data.d";
import ContentList from "./ContentList";
import { Card, Space, Tabs } from "antd";

const SourceCards: React.FC<{ sources: I18n.Source[] }> = ({ sources }) => {
  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      {sources.map((source) => (
        <Card key={source.name} title={source.name} size="small">
          <Tabs defaultActiveKey="1">
            {source.resources.map((resource) => (
              <Tabs.TabPane tab={resource.locale} key={resource.locale}>
                <ContentList content={resource.content} />
              </Tabs.TabPane>
            ))}
          </Tabs>
        </Card>
      ))}
    </Space>
  );
};

export default SourceCards;
