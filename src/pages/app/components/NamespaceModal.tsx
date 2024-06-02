import React from "react";
import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { useIntl, FormattedMessage } from "umi";
import type { App } from "../data";

export type UpdateFormProps = {
  onSubmit: (values: App.Namespace) => Promise<void>;
  onVisibleChange: (visible: boolean) => void;
  updateModalVisible: boolean;
  values: Partial<App.Namespace>;
};

const NamespaceModal: React.FC<UpdateFormProps> = (props) => {
  const { formatMessage } = useIntl();
  return (
    <ModalForm
      title={formatMessage({
        id: "app.cluster.namespace.edit",
        defaultMessage: "Edit Namespace",
      })}
      width="400px"
      visible={props.updateModalVisible}
      onFinish={props.onSubmit}
      onVisibleChange={props.onVisibleChange}
      formRef={props.formRef}
    >
      <ProForm.Group>
        <ProFormText
          label={formatMessage({
            id: "app.cluster.namespace.id",
            defaultMessage: "Namespace ID",
          })}
          name="id"
          width="md"
          initialValue={props.values.id}
          readonly={true}
        />
      </ProForm.Group>
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
          initialValue={props.values.name}
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
          initialValue={props.values.description}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default NamespaceModal;
