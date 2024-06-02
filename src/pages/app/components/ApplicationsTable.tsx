import {
  ProTable,
  ProColumns,
  ActionType,
  TableDropdown,
} from "@ant-design/pro-table";

import { useRef } from "react";
import type { App } from "../data.d";
import { waitTime } from "./utils";
import { FormattedMessage } from "umi";
import { queryApplications } from "../service";

const columns: ProColumns<App.Application>[] = [
  {
    title: <FormattedMessage id="commons.id" defaultMessage="Application ID" />,
    dataIndex: "id",
    hideInSearch: true,
    hideInTable: true,
  },
  {
    title: (
      <FormattedMessage id="commons.name" defaultMessage="Application Name" />
    ),
    dataIndex: "name",
    copyable: true,
    ellipsis: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: (
            <FormattedMessage
              id="commons.item.required"
              defaultMessage="This item is required"
            />
          ),
        },
      ],
    },
  },
  {
    disable: true,
    title: (
      <FormattedMessage
        id="commons.description"
        defaultMessage="Application Description"
      />
    ),

    dataIndex: "description",
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_);
    },
    hideInSearch: true,
  },
  {
    title: (
      <FormattedMessage id="commons.createdAt" defaultMessage="Created At" />
    ),
    key: "createdAt",
    dataIndex: "createdAt",
    valueType: "date",
    sorter: true,
    hideInSearch: true,
  },
  {
    title: (
      <FormattedMessage id="commons.operations" defaultMessage="Operations" />
    ),
    valueType: "option",
    key: "option",
    render: (text, record, _, action) => [
      <a href={`/app/application/${record.id}`} key="details">
        <FormattedMessage
          id="commons.operation.details"
          defaultMessage="Details"
        />
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          {
            key: "copy",
            name: (
              <FormattedMessage
                id="commons.operation.copy"
                defaultMessage="Copy"
              />
            ),
          },
          {
            key: "delete",
            name: (
              <FormattedMessage
                id="commons.operation.delete"
                defaultMessage="Delete"
              />
            ),
          },
        ]}
      />,
    ],
  },
];

const ApplicationsTable = ({
  clusterId,
  namespaceId,
}: {
  clusterId: string;
  namespaceId: string;
}) => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<App.Application>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        await waitTime(1000);
        const result = queryApplications({
          ...params,
          applicationName: params?.name,
          clusterId,
          namespaceId,
        });
        return result;
      }}
      columnsState={{
        persistenceKey: `applications-table-${clusterId}-${namespaceId}`,
        persistenceType: "localStorage",
        defaultValue: {
          option: { fixed: "right", disable: true },
        },
        onChange(value) {
          console.log("value: ", value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: "auto",
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        syncToUrl: (values, type) => {
          if (type === "get") {
            return {
              ...values,
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => {},
      }}
      dateFormatter="string"
      headerTitle=<FormattedMessage
        id="app.list"
        defaultMessage="Application List"
      />
      toolBarRender={() => []}
    />
  );
};

export default ApplicationsTable;
