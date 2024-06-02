import { useState, useRef, useEffect } from "react";
import { PageContainer } from "@ant-design/pro-layout";

import { ProFormInstance } from "@ant-design/pro-form";

import { useRequest } from "umi";
import { Modal, Button, List, Card, Typography, Tooltip } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import {
  queryClusters,
  saveCluster,
  removeCluster,
  updateCluster,
} from "./service";

import { useIntl, FormattedMessage } from "umi";

import { waitTime } from "./components/utils";

import styles from "./styles/index.less";

import ClusterForm from "./components/ClusterForm";
import type { App } from "./data.d";

const { Paragraph } = Typography;

const Clusters: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);

  const [currentCluster, setCurrentCluster] = useState<App.Cluster>();

  const formRef = useRef<ProFormInstance<App.Cluster>>();

  const { data, loading } = useRequest(() => {
    return queryClusters({
      count: 4,
    });
  });

  const refresh = () => window.location.reload(true);

  const list = data?.list || [];

  const { formatMessage } = useIntl();

  const routes = [
    {
      path: "/app/clusters",
      breadcrumbName: formatMessage({ id: "menu.app.clusters" }),
    },
  ];

  const content = (
    <div className={styles.pageHeaderContent}>
      <p>
        <FormattedMessage id="menu.app.clusters" />
      </p>
      <div className={styles.contentLink}>
        <a>
          <img
            alt=""
            src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg"
          />{" "}
          快速开始
        </a>
        <a>
          <img
            alt=""
            src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg"
          />{" "}
          产品简介
        </a>
        <a>
          <img
            alt=""
            src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg"
          />{" "}
          产品文档
        </a>
      </div>
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
  const nullData: Partial<App.Cluster> = {};
  return (
    <div
      style={{
        background: "#F5F7FA",
      }}
    >
      <PageContainer
        header={{
          title: formatMessage({ id: "menu.app.clusters" }),
          ghost: true,
          breadcrumb: {
            routes,
          },
        }}
        content={content}
        extraContent={extraContent}
      >
        <div className={styles.cardList}>
          <List<Partial<App.Cluster>>
            rowKey="id"
            loading={loading}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 3,
              xxl: 3,
            }}
            dataSource={[nullData, ...list]}
            renderItem={(item) => {
              if (item && item.id) {
                return (
                  <List.Item key={item.id}>
                    <Card
                      hoverable
                      className={styles.card}
                      actions={[
                        <a
                          key="cluster-edit"
                          onClick={() => {
                            setCurrentCluster(item as App.Cluster);
                            formRef?.current?.setFieldsValue(item);
                            setUpdateModalVisible(true);
                          }}
                        >
                          <FormattedMessage id="commons.operation.edit" />
                        </a>,
                        <a
                          key="cluster-delete"
                          onClick={() => {
                            const confirm = Modal.confirm({
                              title: formatMessage({
                                id: "app.cluster.delete",
                              }),
                              content: formatMessage({
                                id: "commons.comfirm.delete",
                              }),
                              onOk: async () => {
                                await waitTime(1000);
                                const id = item.id as string;
                                const clusters = await removeCluster({
                                  id,
                                });
                                if (clusters) {
                                  confirm.destroy();
                                  refresh();
                                }
                              },
                            });
                          }}
                        >
                          <FormattedMessage id="commons.operation.delete" />
                        </a>,
                      ]}
                    >
                      <a href={`/app/cluster/${item.id}`}>
                        <Card.Meta
                          avatar={
                            <img
                              alt=""
                              className={styles.cardAvatar}
                              src={item.logo}
                            />
                          }
                          title={<a>{item.name}</a>}
                          description={
                            <Tooltip title={item.description}>
                              <Paragraph
                                className={styles.item}
                                ellipsis={{ rows: 3 }}
                              >
                                {item.description}
                              </Paragraph>
                            </Tooltip>
                          }
                        />
                      </a>
                    </Card>
                  </List.Item>
                );
              }
              return (
                <List.Item>
                  <Button
                    type="dashed"
                    className={styles.newButton}
                    onClick={() => {
                      setModalVisible(true);
                      setCurrentCluster(undefined);
                    }}
                  >
                    <PlusOutlined />
                    <FormattedMessage
                      id="app.cluster.new"
                      defaultMessage="New Cluster"
                    />
                  </Button>
                </List.Item>
              );
            }}
          />
        </div>

        <div>
          <ClusterForm
            visible={modalVisible}
            onVisibleChange={setModalVisible}
            onSubmit={async (values) => {
              await waitTime(1000);
              const clusters = await saveCluster({ cluster: values });
              if (clusters) {
                setModalVisible(false);
                refresh();
              }
            }}
          ></ClusterForm>

          <ClusterForm
            visible={updateModalVisible}
            onVisibleChange={setUpdateModalVisible}
            onSubmit={async (values) => {
              await waitTime(1000);
              const cluster = values;
              const clusters = await updateCluster({ cluster });
              if (clusters) {
                setCurrentCluster(cluster);
                refresh();
              }
            }}
            values={currentCluster}
            formRef={formRef}
          ></ClusterForm>
        </div>
      </PageContainer>
    </div>
  );
};

export default Clusters;
