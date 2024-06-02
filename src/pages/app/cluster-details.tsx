import { useRef, useState, useEffect } from "react";
import {
  GridContent,
  RouteContext,
  PageContainer,
} from "@ant-design/pro-layout";

import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";

import { ProTable, ProColumns, ActionType } from "@ant-design/pro-table";

import { message, Modal, Card, Descriptions, Button, Space } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useIntl, FormattedMessage } from "umi";

import {
  queryCluster,
  saveNamespace,
  queryNamespaces,
  removeNamespace,
  updateNamespace,
} from "./service";
import styles from "./styles/details.less";
import NamespaceModal from "./components/NamespaceModal";
import ApplicationsModal from "./components/ApplicationsModal";
import type { App } from "./data.d";

const ClusterDetails: React.FC = (props: any) => {
  const clusterId = props?.match?.params?.id;

  const [deleteNamespaceModal, contextHolder] = Modal.useModal();

  const actionRef = useRef<ActionType>();

  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);

  const [applicationsModalVisible, setApplicationsModalVisible] =
    useState<boolean>(false);

  const [currentNamespace, setCurrentNamespace] = useState<App.Namespace>();

  const [cluster, setCluster] = useState<App.Cluster>({});

  const [namespaces, setNamespaces] = useState<App.Namespace[]>();

  useEffect(() => {
    const query = async () => {
      const cluster = await queryCluster({
        id: clusterId,
      });
      setCluster(cluster);
      setNamespaces(cluster.namespaces);
    };
    query();
  }, []);

  const extraContent = (
    <div className={styles.extraImg}>
      <img alt="" src={cluster.logo} />
    </div>
  );

  const clusterDescription = (
    <RouteContext.Consumer>
      {({ isMobile }) => (
        <Descriptions
          className={styles.headerList}
          size="small"
          column={isMobile ? 1 : 2}
        >
          <Descriptions.Item label={formatMessage({ id: "app.cluster.name" })}>
            <a href={props?.location?.pathname}>{cluster.name}</a>
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: "app.cluster.url" })}>
            {cluster.url}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: "commons.createdAt" })}>
            {new Date(cluster.createdAt * 1000).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: "commons.updatedAt" })}>
            {new Date(cluster.updatedAt * 1000).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item
            label={formatMessage({ id: "commons.description" })}
          >
            {cluster.description}
          </Descriptions.Item>
        </Descriptions>
      )}
    </RouteContext.Consumer>
  );

  const { formatMessage } = useIntl();

  const columns: ProColumns<App.Namespace>[] = [
    {
      title: "ID",
      dataIndex: "id",
      renderText: (text, record) => {
        return <a href="#">{record.id}</a>;
      },
      hideInTable: true,
    },
    {
      title: formatMessage({
        id: "commons.name",
        defaultMessage: "name",
      }),
      dataIndex: "name",
      renderText: (text, record) => {
        return record.name;
      },
    },
    {
      title: formatMessage({
        id: "commons.status",
        defaultMessage: "status",
      }),
      dataIndex: "status",
      valueEnum: {
        ACTIVE: {
          text: (
            <FormattedMessage
              id="commons.status.active"
              defaultMessage="Active"
            />
          ),
          status: "Success",
        },
        INACTIVE: {
          text: (
            <FormattedMessage
              id="commons.status.inactive"
              defaultMessage="Inactive"
            />
          ),
          status: "Error",
        },
        UNKNOWN: {
          text: (
            <FormattedMessage
              id="commons.status.unknown"
              defaultMessage="Unknown"
            />
          ),
          status: "Default",
        },
      },
      renderText: (text, record) => {
        return record.status;
      },
    },
    {
      title: formatMessage({
        id: "commons.description",
        defaultMessage: "description",
      }),
      dataIndex: "description",
      renderText: (text, record) => {
        return record.description;
      },
      valueType: "textarea",
    },
    {
      title: formatMessage({
        id: "commons.operations",
        defaultMessage: "Operations",
      }),
      dataIndex: "opertions",
      render: (dom, entity) => {
        return (
          <div>
            <Space size="small">
              <a
                key="detailsOperation"
                onClick={() => {
                  setCurrentNamespace(entity);
                  setApplicationsModalVisible(true);
                }}
              >
                <FormattedMessage id="app.list" defaultMessage="Applications" />
              </a>

              <a
                key="editOperation"
                onClick={() => {
                  setCurrentNamespace(entity);
                  setUpdateModalVisible(true);
                }}
              >
                <FormattedMessage
                  id="commons.operation.edit"
                  defaultMessage="Edit"
                />
              </a>
              <a
                key="deleteOperation"
                onClick={() => {
                  deleteNamespaceModal.confirm({
                    title: (
                      <FormattedMessage id="app.cluster.namespace.delete" />
                    ),
                    icon: <ExclamationCircleOutlined />,
                    content: <FormattedMessage id="commons.comfirm.delete" />,
                    okText: <FormattedMessage id="commons.ok" />,
                    cancelText: <FormattedMessage id="commons.cancel" />,
                    onOk: async () => {
                      const namespaces: App.Namespace[] = await deleteNamespace(
                        entity.id as string
                      );
                      if (namespaces) {
                        setNamespaces(namespaces);
                        if (actionRef.current) {
                          actionRef.current.reload();
                        }
                      }
                    },
                  });
                }}
              >
                <FormattedMessage
                  id="commons.operation.delete"
                  defaultMessage="Delete"
                />
              </a>
            </Space>
          </div>
        );
      },
    },
  ];

  const addNamespace = async (namespace: App.Namespace) => {
    const hide = message.loading(formatMessage({ id: "comomons.adding" }));
    let namespaces: App.Namespace[] = [];
    try {
      namespaces = await saveNamespace({
        clusterId,
        namespace,
      });
      hide();
      message.success(formatMessage({ id: "comomons.added" }));
    } catch (error) {
      hide();
      message.error(
        formatMessage({ id: "comomons.added.failed" }) + ":" + error
      );
    }
    return namespaces;
  };

  const deleteNamespace = async (namespaceId: string) => {
    const hide = message.loading(formatMessage({ id: "comomons.deleting" }));
    let namespaces: App.Namespace[] = [];
    try {
      namespaces = await removeNamespace({
        clusterId,
        namespaceId,
      });
      hide();
      message.success(formatMessage({ id: "comomons.deleted" }));
    } catch (error) {
      hide();
      message.error(
        formatMessage({ id: "comomons.deleted.failed" }) + ":" + error
      );
    }
    return namespaces;
  };

  const editNamespace = async (namespace: App.Namespace) => {
    const hide = message.loading(formatMessage({ id: "comomons.editing" }));
    let namespaces: App.Namespace[] = [];
    try {
      namespaces = await updateNamespace({
        clusterId,
        namespace,
      });
      hide();
      message.success(formatMessage({ id: "comomons.edited" }));
    } catch (error) {
      hide();
      message.error(
        formatMessage({ id: "comomons.edited.failed" }) + ":" + error
      );
    }
    return namespaces;
  };

  const getNamespaces = async () => {
    const result = await queryNamespaces({
      clusterId,
    });
    return {
      data: result,
      success: true,
    };
  };

  return (
    <div>
      <PageContainer content={clusterDescription} extraContent={extraContent}>
        <div className={styles.main}>
          <GridContent>
            <Card
              title={formatMessage({
                id: "app.cluster.namespaces",
                defaultMessage: "Namespaces",
              })}
              style={{ marginBottom: 24 }}
              bordered={false}
            >
              <ProTable<App.Namespace, App.Pagination>
                cardBordered={true}
                actionRef={actionRef}
                rowKey={(r) => r.id}
                headerTitle={false}
                search={false}
                options={false}
                pagination={{
                  showQuickJumper: true,
                }}
                dataSource={namespaces}
                columns={columns}
                toolBarRender={() => [
                  <Button
                    id="btnAddNamespace"
                    type="primary"
                    key="primary"
                    onClick={() => {
                      setCreateModalVisible(true);
                    }}
                  >
                    <PlusOutlined />{" "}
                    <FormattedMessage
                      id="commons.operation.new"
                      defaultMessage="New"
                    />
                  </Button>,
                ]}
              />
            </Card>
          </GridContent>
          <ModalForm
            title={formatMessage({
              id: "app.cluster.namespace.new",
              defaultMessage: "New Namespace",
            })}
            width="400px"
            visible={createModalVisible}
            onVisibleChange={setCreateModalVisible}
            onFinish={async (value) => {
              const namespaces = await addNamespace(value as App.Namespace);
              if (namespaces) {
                setNamespaces(namespaces);
                setCreateModalVisible(false);
              }
            }}
          >
            <ProForm.Group>
              <ProFormText
                label={formatMessage({
                  id: "app.cluster.namespace.name",
                  defaultMessage: "Namespace Name",
                })}
                name="name"
                placeholder={formatMessage({
                  id: "app.cluster.namespace",
                  defaultMessage: "Namespace",
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="commons.name"
                        defaultMessage="Namespace name is required"
                      />
                    ),
                  },
                ]}
                width="md"
              />
            </ProForm.Group>

            <ProForm.Group>
              <ProFormTextArea
                label={formatMessage({
                  id: "app.cluster.namespace.desc",
                  defaultMessage: "Description",
                })}
                placeholder={formatMessage({
                  id: "app.cluster.namespace.decs.tips",
                  defaultMessage: "Namespace...",
                })}
                width="md"
                name="description"
              />
            </ProForm.Group>
          </ModalForm>
          {contextHolder}
          <NamespaceModal
            onSubmit={async (value) => {
              const namespaces = await editNamespace(value as App.Namespace);
              if (namespaces) {
                setNamespaces(namespaces);
                setUpdateModalVisible(false);
              }
            }}
            onVisibleChange={setUpdateModalVisible}
            updateModalVisible={updateModalVisible}
            values={currentNamespace || {}}
          ></NamespaceModal>
          <ApplicationsModal
            visible={applicationsModalVisible}
            clusterId={clusterId}
            namespaceId={currentNamespace?.id}
            onVisibleChange={setApplicationsModalVisible}
          />
        </div>
      </PageContainer>
    </div>
  );
};

export default ClusterDetails;
