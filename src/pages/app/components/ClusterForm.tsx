import { MutableRefObject } from "react";
import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
  ProFormInstance,
} from "@ant-design/pro-form";
import { useIntl, FormattedMessage } from "umi";
import type { App } from "../data.d";

export type FormProps = {
  onSubmit: (values: App.Cluster) => Promise<void>;
  onVisibleChange: (visible: boolean) => void;
  visible: boolean;
  values?: Partial<App.Cluster>;
  formRef?: MutableRefObject<ProFormInstance<App.Cluster>>;
};

const ClusterForm: React.FC<FormProps> = (props) => {
  const { formatMessage } = useIntl();
  const edited = props.values;
  const title = edited
    ? formatMessage({
        id: "app.cluster.edit",
        defaultMessage: "Edit Cluster",
      })
    : formatMessage({
        id: "app.cluster.new",
        defaultMessage: "new Cluster",
      });

  const idNode = edited ? (
    <ProForm.Group>
      <ProFormText
        label={formatMessage({
          id: "app.cluster.id",
          defaultMessage: "Cluster ID",
        })}
        name="id"
        width="md"
        initialValue={props?.values?.id}
        readonly={true}
      />
    </ProForm.Group>
  ) : null;

  return (
    <ModalForm
      title={title}
      width="400px"
      visible={props.visible}
      onFinish={props.onSubmit}
      onVisibleChange={props.onVisibleChange}
      formRef={props.formRef}
    >
      {idNode}
      <ProForm.Group>
        <ProFormText
          label={formatMessage({
            id: "app.cluster.name",
            defaultMessage: "Cluster Name",
          })}
          name="name"
          placeholder={formatMessage({
            id: "app.cluster.name",
            defaultMessage: "Cluster Name",
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="commons.name"
                  defaultMessage="Cluster name is required"
                />
              ),
            },
          ]}
          width="md"
          initialValue={props?.values?.name}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormRadio.Group
          name="kind"
          layout="vertical"
          label={formatMessage({
            id: "app.cluster.kind",
            defaultMessage: "Cluster Kind",
          })}
          options={[
            {
              label: "Nacos",
              value: "Nacos",
            },
            {
              label: "Kubernetes",
              value: "Kubernetes",
            },
            {
              label: "Eureka",
              value: "Eureka",
            },
            {
              label: "Consul",
              value: "Consul",
            },
            {
              label: "Zookeeper",
              value: "Zookeeper",
            },
          ]}
          initialValue={props?.values?.kind}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormText
          label={formatMessage({
            id: "app.cluster.url",
            defaultMessage: "Cluster URL",
          })}
          name="url"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="commons.url"
                  defaultMessage="Cluster URL is required"
                />
              ),
            },
          ]}
          width="md"
          initialValue={props?.values?.url}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormTextArea
          label={formatMessage({
            id: "commons.description",
            defaultMessage: "Description",
          })}
          width="md"
          name="description"
          initialValue={props?.values?.description}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default ClusterForm;
