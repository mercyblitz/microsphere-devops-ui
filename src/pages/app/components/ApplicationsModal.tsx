import { useIntl } from "umi";
import { ModalForm } from "@ant-design/pro-form";
import React from "react";
import ApplicationsTable from "./ApplicationsTable";

export type ApplicationsModalProps = {
  onVisibleChange: (visible: boolean) => void;
  visible: boolean;
  clusterId: string;
  namespaceId: string;
};

const ApplicationsModal: React.FC<ApplicationsModalProps> = (props) => {
  const { formatMessage } = useIntl();

  return (
    <ModalForm
      title={formatMessage({ id: "app.list" })}
      visible={props.visible}
      onVisibleChange={props.onVisibleChange}
      width="70%"
      onFinish={async (values) => {
        return false;
      }}
    >
      <ApplicationsTable
        clusterId={props.clusterId}
        namespaceId={props.namespaceId}
      />
    </ModalForm>
  );
};

export default ApplicationsModal;
