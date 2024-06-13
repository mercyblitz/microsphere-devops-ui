import { useState, useRef, useEffect } from "react";
import { PageContainer } from "@ant-design/pro-layout";

import { ProFormInstance } from "@ant-design/pro-form";

import { useRequest } from "umi";
import {
  Modal,
  Button,
  List,
  Card,
  Typography,
  Tooltip,
  Space,
  Tabs,
} from "antd";

import { PlusOutlined } from "@ant-design/icons";

import { querySources } from "./service";

import type { I18n } from "./data.d";

import SourceCards from "./components/SourceCards";

import { useIntl, FormattedMessage } from "umi";

import styles from "./styles/sources.less";

const Sources: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);

  const refresh = () => window.location.reload(true);

  const list: any = [];

  const { formatMessage } = useIntl();

  const [sources, setSources] = useState<I18n.Source[]>([]);

  useEffect(() => {
    const query = async () => {
      const sources = await querySources();
      setSources(sources);
    };
    query();
  }, []);

  console.log(sources);

  const content = (
    <div className={styles.pageHeaderContent}>
      <SourceCards sources={sources} />
    </div>
  );

  const extraContent = (
    <div className={styles.extraImg}>
      <img
        alt=""
        src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
      />
    </div>
  );
  return (
    <div
      style={{
        background: "#F5F7FA",
      }}
    >
      <PageContainer
        header={{
          title: formatMessage({ id: "menu.i18n.sources" }),
          ghost: true,
        }}
        content={content}
        extraContent={extraContent}
      ></PageContainer>
    </div>
  );
};

export default Sources;
