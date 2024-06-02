import React, { useRef, useState, useEffect } from "react";
import {
  GridContent,
  RouteContext,
  PageContainer,
} from "@ant-design/pro-layout";

import { ProForm, ProFormInstance } from "@ant-design/pro-form";

import {
  ProTable,
  ProColumns,
  TableDropdown,
  ActionType,
  EditableProTable,
} from "@ant-design/pro-table";

import { Modal, Card, Descriptions, Space } from "antd";

import { useIntl, FormattedMessage } from "umi";

import { queryApplication, saveInstanceMetadata } from "./service";
import styles from "./styles/details.less";
import type { App } from "./data.d";
import { waitTime } from "./components/utils";

const ApplicationDetails: React.FC = (props: any) => {
  const applicationId = props?.match?.params?.id;

  const instanceActionRef = useRef<ActionType>();

  const [metadataUpdateModalVisible, setMetadataUpdateModelVisible] =
    useState<boolean>(false);

  const [currentInstace, setCurrentInstance] =
    useState<App.ApplicationInstance>();

  const [application, setApplication] = useState<App.Application>(
    {} as App.Application
  );

  const [instances, setInstances] = useState<App.ApplicationInstance[]>();

  useEffect(() => {
    const query = async () => {
      const application = await queryApplication({
        id: applicationId,
      });
      setApplication(application);
      setInstances(application.instances);
    };
    query();
  }, []);

  const extraContent = (
    <div className={styles.extraImg}>
      <img alt="" src={application.logo} />
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
          <Descriptions.Item label={formatMessage({ id: "app.id" })}>
            <a href={props?.location?.pathname}>{application.id}</a>
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: "app.name" })}>
            <a href={props?.location?.pathname}>{application.name}</a>
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: "commons.createdAt" })}>
            {new Date(application.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: "commons.updatedAt" })}>
            {new Date(application.updatedAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item
            label={formatMessage({ id: "commons.description" })}
          >
            {application.description}
          </Descriptions.Item>
        </Descriptions>
      )}
    </RouteContext.Consumer>
  );

  const { formatMessage } = useIntl();

  const instanceColumns: ProColumns<App.ApplicationInstance>[] = [
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
        id: "app.instance.id",
        defaultMessage: "Instance ID",
      }),
      dataIndex: "instanceId",
      renderText: (text, record) => {
        return record.instanceId;
      },
    },
    {
      title: formatMessage({
        id: "commons.health",
        defaultMessage: "Health",
      }),
      dataIndex: "health",
      valueEnum: {
        UNKNOWN: {
          text: formatMessage({
            id: "commons.health.unknown",
            defaultMessage: "Unknown",
          }),
        },
        DOWN: {
          text: formatMessage({
            id: "commons.health.down",
            defaultMessage: "Down",
          }),
          status: "Error",
        },
        UP: {
          text: formatMessage({
            id: "commons.health.up",
            defaultMessage: "Up",
          }),
          status: "Success",
        },
        OUT_OF_SERVICE: {
          text: formatMessage({
            id: "commons.health.out-of-service",
            defaultMessage: "Out of service",
          }),
          status: "Processing",
        },
      },
    },
    {
      title: formatMessage({
        id: "commons.host",
        defaultMessage: "Host",
      }),
      dataIndex: "host",
      renderText: (text, record) => {
        return record.host;
      },
    },
    {
      title: formatMessage({
        id: "commons.port",
        defaultMessage: "Port",
      }),
      dataIndex: "port",
      renderText: (text, record) => {
        return record.port;
      },
    },
    {
      title: formatMessage({
        id: "commons.operations",
        defaultMessage: "Operations",
      }),
      dataIndex: "opertions",
      render: (dom, entity) => {
        return (
          <Space size="small">
            <a
              key="editOperation"
              onClick={() => {
                setCurrentInstance(entity);
                setInstanceMetadata(entity);
                setMetadataUpdateModelVisible(true);
              }}
            >
              <FormattedMessage
                id="commons.metdata"
                defaultMessage="Metadata"
              />
            </a>

            <TableDropdown
              key="actionGroup"
              onSelect={() => instanceActionRef?.current.reload()}
              menus={[
                {
                  key: "copy",
                  name: (
                    <FormattedMessage
                      id="commons.operation.online"
                      defaultMessage="Online"
                    />
                  ),
                },
                {
                  key: "delete",
                  name: (
                    <FormattedMessage
                      id="commons.operation.offline"
                      defaultMessage="Offline"
                    />
                  ),
                },
              ]}
            />
          </Space>
        );
      },
    },
  ];

  type MetadataType = {
    id: number;
    key: string;
    value: string;
  };

  const [metadata, setMetadata] = useState<MetadataType[]>([]);

  const metadataFormRef = useRef<ProFormInstance<any>>();

  const setInstanceMetadata = (instance: App.ApplicationInstance) => {
    const metadata = instance?.metadata;
    if (metadata) {
      const metadataList = Object.entries(metadata).map(([key, value]) => ({
        id: key.hashCode(),
        key,
        value,
      }));
      setMetadata(metadataList);
    }
  };

  String.prototype.hashCode = function () {
    const length = this.length;
    let hash: number = 0;
    for (let i = 0; i < length; i++) {
      hash += this.charCodeAt(i) * 31;
    }
    return hash;
  };

  const generateMetadataId = (): number => {
    return parseInt((Math.random() * 1000000).toFixed(0));
  };

  const metadataColumns: ProColumns<MetadataType>[] = [
    {
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
      dataIndex: "id",
    },
    {
      title: formatMessage({
        id: "commons.metdata.key",
        defaultMessage: "Metadata Key",
      }),
      dataIndex: "key",
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: formatMessage({
                id: "commons.item.required",
                defaultMessage: "This item is required",
              }),
            },
          ],
        };
      },
    },
    {
      title: formatMessage({
        id: "commons.metdata.value",
        defaultMessage: "Metadata value",
      }),
      dataIndex: "value",
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: formatMessage({
                id: "commons.item.required",
                defaultMessage: "This item is required",
              }),
            },
          ],
        };
      },
    },
    {
      title: formatMessage({
        id: "commons.operations",
        defaultMessage: "Opeartions",
      }),
      valueType: "option",
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          <FormattedMessage id="commons.operation.edit" defaultMessage="Edit" />
        </a>,
        <a
          key="delete"
          onClick={() => {
            const metadatFormInstance = metadataFormRef.current;
            const metadata = metadatFormInstance?.getFieldValue(
              "metadataList"
            ) as MetadataType[];
            metadatFormInstance?.setFieldsValue({
              metadataList: metadata.filter((item) => item.id !== record.id),
            });
          }}
        >
          <FormattedMessage
            id="commons.operation.delete"
            defaultMessage="Delete"
          />
        </a>,
      ],
    },
  ];

  return (
    <div>
      <PageContainer content={clusterDescription} extraContent={extraContent}>
        <div className={styles.main}>
          <GridContent>
            <Card
              title={formatMessage({
                id: "app.instances",
                defaultMessage: "Instances List",
              })}
              style={{ marginBottom: 24 }}
              bordered={false}
            >
              <ProTable<App.ApplicationInstance>
                cardBordered
                actionRef={instanceActionRef}
                rowKey={(r) => r.id}
                headerTitle={false}
                search={false}
                options={{
                  setting: {
                    listsHeight: 400,
                  },
                }}
                pagination={{
                  pageSize: 10,
                  onChange: (page) => {},
                }}
                dataSource={instances}
                columns={instanceColumns}
                toolBarRender={() => []}
              />
            </Card>
          </GridContent>
          <Modal
            title={formatMessage({
              id: "app.instance.edit",
              defaultMessage: "Edit Instance",
            })}
            width="60%"
            open={metadataUpdateModalVisible}
            onCancel={() => {
              setMetadataUpdateModelVisible(false);
            }}
            footer={[]}
          >
            <Descriptions className={styles.headerList} size="small" column={1}>
              <Descriptions.Item
                label={formatMessage({ id: "app.instance.id" })}
              >
                {currentInstace?.instanceId}
              </Descriptions.Item>
              <Descriptions.Item
                label={formatMessage({ id: "commons.health" })}
              >
                {currentInstace?.health}
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: "commons.host" })}>
                {currentInstace?.host}
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: "commons.port" })}>
                {currentInstace?.port}
              </Descriptions.Item>
            </Descriptions>

            <ProForm<{
              metadataList: MetadataType[];
            }>
              formRef={metadataFormRef}
              initialValues={{
                metadataList: metadata,
              }}
              onFinish={async (values) => {
                waitTime(1000);
                console.log(values);
                if (currentInstace) {
                  const { applicationId, instanceId } = currentInstace;
                  const metadata: App.Metadata = {};
                  values.metadataList.forEach((item) => {
                    metadata[item.key] = item.value;
                  });
                  const instance: App.ApplicationInstance =
                    await saveInstanceMetadata({
                      applicationId,
                      instanceId,
                      metadata,
                    });

                  if (instance) {
                    setInstanceMetadata(instance);
                    setMetadataUpdateModelVisible(false);
                    instanceActionRef?.current.reload();
                  }
                }
              }}
            >
              <EditableProTable<MetadataType>
                rowKey="id"
                scroll={{
                  x: 960,
                }}
                headerTitle={formatMessage({
                  id: "app.instance.metadata.list",
                  defaultMessage: "Metadata List",
                })}
                bordered={true}
                maxLength={50}
                name="metadataList"
                columns={metadataColumns}
                dataSource={metadata}
                recordCreatorProps={{
                  newRecordType: "dataSource",
                  record: () => ({
                    id: generateMetadataId(),
                    key: "",
                    value: "",
                  }),
                }}
                editable={{
                  type: "multiple",
                  actionRender: (row, config, defaultDom) => {
                    return [
                      defaultDom.save,
                      defaultDom.delete || defaultDom.cancel,
                    ];
                  },
                }}
              />
            </ProForm>
          </Modal>
        </div>
      </PageContainer>
    </div>
  );
};

export default ApplicationDetails;
