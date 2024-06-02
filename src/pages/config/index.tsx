import React from "react";
import { PageContainer } from "@ant-design/pro-layout";
import { ProFormGroup, ProFormSwitch } from "@ant-design/pro-form";

import { StatisticCard, CheckCard, ProCard } from "@ant-design/pro-card";
import {
  Dropdown,
  Button,
  Layout,
  Card,
  Alert,
  Row,
  Col,
  Typography,
  Tooltip,
  Space,
  Tabs,
  Breadcrumb,
  Statistic,
} from "antd";
import {
  LikeOutlined,
  RightOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

import {
  StepBackwardOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useIntl, FormattedMessage } from "umi";
import styles from "./index.less";

const { Header, Footer, Sider, Content } = Layout;

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const AppCluster: React.FC = () => {
  const intl = useIntl();

  const routes = [
    {
      path: "",
      breadcrumbName: "首页",
    },
    {
      path: "",
      breadcrumbName: "应用列表",
    },
  ];

  return (
    <div
      style={{
        background: "#F5F7FA",
      }}
    >
      <PageContainer
        header={{
          title: "页面标题",
          ghost: true,
          breadcrumb: {
            routes,
          },
        }}
        tabList={[
          {
            tab: "基本信息",
            key: "base",
            closable: false,
          },
          {
            tab: "详细信息",
            key: "info",
          },
        ]}
        tabProps={{
          type: "editable-card",
          hideAdd: true,
          onEdit: (e, action) => console.log(e, action),
        }}
      >
        <ProCard direction="column" ghost gutter={[0, 16]}>
          <ProCard style={{ height: 200 }} />
          <ProCard gutter={16} ghost style={{ height: 200 }}>
            <ProCard colSpan={16} />
            <ProCard colSpan={8} />
          </ProCard>
        </ProCard>
      </PageContainer>
    </div>
  );
};

export default AppCluster;
