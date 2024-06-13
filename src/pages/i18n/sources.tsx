import { useState, useRef, useEffect } from "react";
import { PageContainer } from "@ant-design/pro-layout";

import { ProFormInstance } from "@ant-design/pro-form";

import { useRequest } from "umi";
import { Modal, Button, List, Card, Typography, Tooltip } from "antd";

import { PlusOutlined } from "@ant-design/icons";

import { useIntl, FormattedMessage } from "umi";

import styles from "./styles/sources.less";

const { Paragraph } = Typography;

const Sources: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);

  const refresh = () => window.location.reload(true);

  const list: any = [];

  const { formatMessage } = useIntl();

  const routes = [];

  const content = <div className={styles.pageHeaderContent}></div>;

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
