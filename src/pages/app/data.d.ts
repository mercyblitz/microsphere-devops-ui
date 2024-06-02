import { Descriptions } from "antd";
declare module App {
  type Member = {
    avatar: string;
    name: string;
    id: string;
  };

  enum ClusterType {
    NACOS = "Nacos",
    KUBERNETES = "Kubernetes",
    EUREKA = "Eureka",
    CONSUL = "Consul",
    ZOOKEEPER = "Zookeeper",
  }

  type ClusterKindList = {
    [name: string]: ClusterKind;
  };

  interface Describable {
    id: number | string;
    description?: string;
    createdAt?: number;
    updatedAt?: number;
  }

  interface Named {
    name: string;
  }

  type ClusterKind = {
    name: string;
    description: string;
    logo: string;
  };

  interface Cluster extends Describable, Named {
    kind?: string | "Nacos" | "Kubernetes" | "Eureka" | "Consul" | "Zookeeper";
    logo: string;
    url: string; // Registry URL
    namespaces: Namespace[];
  }

  interface Namespace extends Describable, Named {
    clusterId?: string;
    status: string | "ACTIVE" | "INACTIVE" | "UNKNOWN";
    applications?: Application[];
  }

  enum NamespaceStatus {
    ACTIVE,
    INACTIVE,
    UNKNOWN,
  }

  interface Application extends Describable, Named {
    namespaceId: string;
    clusterId: string;
    instances?: ApplicationInstance[];
  }

  interface ApplicationInstance extends Describable {
    applicationId: string;
    instanceId: string;
    health: string | "UNKNOWN" | "UP" | "DOWN" | "OUT_OF_SERVICE";
    host: string;
    port: number;
    secure?: boolean;
    uri?: string;
    metadata?: Metadata;
    scheme?: string;
  }

  type Metadata = Record<string, string>;

  type Field = {
    title: string;
    dataIndex: string;
    key: string;
    [key: string]: any;
  };

  type Pagination = {
    total: number;
    pageSize: number;
    current: number;
  };

  type ModalType = {
    title: string;
    visible: boolean;
    onOk?: () => void;
  };

  type TableData = {
    meta: FieldMetadata;
    data: any[][];
  };

  type FormData = {
    fields: FieldData[];
  };

  interface FieldData extends FieldMetadata {
    value?: any;
  }

  interface FieldMetadata {
    name: string;
    label: string;
    type: string;
    defaultValue?: any;
    description?: string;
    constraints?: Constraint[];
    disabled?: boolean;
    hidden?: boolean;
  }

  type Constraint = {
    kind: string;
    message: string;
  };
}
