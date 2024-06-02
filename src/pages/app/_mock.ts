// eslint-disable-next-line import/no-extraneous-dependencies
import type { Application, Request, Response } from "express";
import type { App } from "./data.d";
import { Metadata } from "@playwright/test";

const defaultNamespaces: App.Namespace[] = [
  {
    id: "1",
    name: "test",
    status: "ACTIVE",
    description: "test namespace",
  },
  {
    id: "2",
    name: "dev",
    status: "INACTIVE",
    description: "dev namespace",
  },
  {
    id: "3",
    name: "default",
    status: "UNKNOWN",
    description: "default namespace",
  },
];
const clusters: App.Cluster[] = [
  {
    id: "1",
    name: "Nacos",
    kind: "Nacos",
    description:
      "Nacos 通过提供简单易用的动态服务发现、服务配置、服务共享与管理等服务基础设施，帮助用户在云原生时代，在私有云、混合云或者公有云等所有云环境中，更好的构建、交付、管理自己的微服务平台，更快的复用和组合业务服务，更快的交付商业创新的价值，从而为用户赢得市场。",
    logo: "https://img.alicdn.com/imgextra/i1/O1CN01YjDURc26ODF5FQt4d_!!6000000007651-55-tps-123-24.svg",
    url: "127.0.0.1:8848",
    createdAt: 1715325352,
    updatedAt: 1715325352,
    namespaces: defaultNamespaces,
  },
  {
    id: "2",
    name: "Kubernetes",
    kind: "Kubernetes",
    description:
      "Kubernetes 也称为 K8s, 是用于自动部署、扩缩和管理容器化应用程序的开源系统",
    logo: "https://kubernetes.io/images/wheel.svg",
    url: "127.0.0.1",
    createdAt: 1715325352,
    updatedAt: 1715325352,
    namespaces: [
      {
        id: "101",
        name: "test",
        status: "ACTIVE",
        description: "test namespace",
      },
      {
        id: "102",
        name: "dev",
        status: "ACTIVE",
        description: "dev namespace",
      },
      {
        id: "103",
        name: "default",
        status: "ACTIVE",
        description: "default namespace",
      },
    ],
  },
];

const clusterKinds: App.ClusterKindList = {
  Nacos: {
    name: "Nacos",
    description:
      "Nacos 通过提供简单易用的动态服务发现、服务配置、服务共享与管理等服务基础设施，帮助用户在云原生时代，在私有云、混合云或者公有云等所有云环境中，更好的构建、交付、管理自己的微服务平台，更快的复用和组合业务服务，更快的交付商业创新的价值，从而为用户赢得市场。",
    logo: "https://img.alicdn.com/imgextra/i1/O1CN01YjDURc26ODF5FQt4d_!!6000000007651-55-tps-123-24.svg",
  },
  Kubernetes: {
    name: "Kubernetes",
    description:
      "Kubernetes 也称为 K8s, 是用于自动部署、扩缩和管理容器化应用程序的开源系统",
    logo: "https://kubernetes.io/images/wheel.svg",
  },
};

const formData: App.FormData = [
  {
    name: "id",
    label: "{id.label}",
    type: "number",
    defaultValue: null,
    value: 1,
    description: "{id.description}",
    constraints: [
      {
        kind: "NotNull",
        message: "{} must not be null",
      },
    ],
  },
  {
    name: "name",
    label: "{name.label}",
    type: "string",
    defaultValue: null,
    description: "{name.description}",
    constraints: [
      {
        kind: "NotBlank",
        message: "{} must not be blank",
      },
    ],
  },
];

function findClusters(req: Request, res: Response) {
  const result = clusters;
  return res.json({
    data: {
      list: result,
    },
  });
}

function findCluster(req: Request, res: Response) {
  const id = req.params?.id;
  const cluster: App.Cluster = findClusterById(id);
  return res.json(cluster);
}

function findClusterById(id: string): App.Cluster {
  const result = clusters.filter((item) => {
    return item.id == id;
  });
  return result[0] as App.Cluster;
}

function addCluster(req: Request, res: Response) {
  const body = req.body;
  const { cluster } = body;
  const { name, kind, url, description, logo } = cluster;

  const clusterKind: App.ClusterKind = clusterKinds[kind];

  const createdAt: number = new Date().getTime();
  const updatedAt: number = createdAt;

  const newCluster: App.Cluster = {
    id: `${clusters.length + 1}`,
    name,
    kind,
    description: description || clusterKind.description,
    url,
    logo: logo || clusterKind.logo,
    createdAt,
    updatedAt,
    namespaces: defaultNamespaces,
  };

  clusters.push(newCluster);
  return res.json(clusters);
}

function updateCluster(req: Request, res: Response) {
  const body = req.body;
  const { cluster } = body;
  const { id, name, kind, url, description, logo } = cluster;

  const clusterKind: App.ClusterKind = clusterKinds[kind];

  const updatedAt: number = new Date().getTime();

  const existedCluster: App.Cluster = findClusterById(id);
  existedCluster.name = name;
  existedCluster.kind = kind;
  existedCluster.url = url;
  existedCluster.description = description || clusterKind.description;
  existedCluster.logo = logo || clusterKind.logo;
  existedCluster.updatedAt = updatedAt;

  return res.json(clusters);
}

function deleteCluster(req: Request, res: Response) {
  const body = req.body;
  const { id } = body;
  const index = clusters.findIndex((item) => item.id == id);
  if (index > -1) {
    clusters.splice(index, 1);
  }
  return res.json(clusters);
}

function findNamespace(clusterId: string, namespaceId: string): App.Namespace {
  const cluster: App.Cluster = findClusterById(clusterId);
  return findNamespace0(cluster.namespaces, namespaceId);
}

function findNamespace0(
  namespaces: App.Namespace[],
  namespaceId: string
): App.Namespace {
  const result = namespaces.filter((item) => {
    return item.id == namespaceId;
  });
  return result[0] as App.Namespace;
}

function addNamespace(req: Request, res: Response, u: URL, b: Body) {
  const body = (b && JSON.parse(b.toString())) || req.body;
  const { clusterId, namespace } = body;
  const cluster: App.Cluster = findClusterById(clusterId);
  const newNamespace: App.Namespace = {
    id: `${cluster.namespaces.length + 1}`,
    name: namespace.name,
    status: "ACTIVE",
    description: namespace.description,
  };
  cluster.namespaces.push(newNamespace);
  return res.json(cluster.namespaces);
}

function findNamespaces(req: Request, res: Response) {
  const clusterId = req.params?.clusterId;
  const cluster: App.Cluster = findClusterById(clusterId);
  return res.json(cluster.namespaces);
}

function deleteNamespace(req: Request, res: Response) {
  const body = req.body;
  const { clusterId, namespaceId } = body;

  const cluster: App.Cluster = findClusterById(clusterId);

  const namespaces: App.Namespace[] = cluster.namespaces;
  const namespace: App.Namespace = findNamespace0(namespaces, namespaceId);
  const index = namespaces.indexOf(namespace);
  if (index > -1) {
    namespaces.splice(index, 1);
  }

  return res.json(namespaces);
}

function updateNamespace(req: Request, res: Response) {
  const body = req.body;
  const { clusterId, namespace } = body;

  const cluster: App.Cluster = findClusterById(clusterId);

  const namespaces: App.Namespace[] = cluster.namespaces;
  const existedNamespace: App.Namespace = findNamespace0(
    namespaces,
    namespace.id
  );

  existedNamespace.name = namespace.name;
  existedNamespace.description = namespace.description;

  return res.json(namespaces);
}

function findApplications(req: Request, res: Response) {
  const params = req.query;

  const {
    pageSize,
    current,
    keyword,
    applicationName,
    clusterId,
    namespaceId,
  } = params;
  let applications: App.Application[] = [];
  const total = 100;
  const size: number = Number(pageSize);
  const startIndex: number = (Number(current) - 1) * size;
  for (let i = 0; i < size; i++) {
    const application: App.Application = buildApplication(
      startIndex + i + 1,
      clusterId as string,
      namespaceId as string
    );
    applications.push(application);
  }

  applications = applications.filter((app) => {
    return applicationName
      ? app.name.indexOf(applicationName as string) > -1
      : true;
  });

  return res.json({
    data: applications,
    success: true,
    total,
  });
}

function findApplication(req: Request, res: Response) {
  const id = req.params?.id;
  const application: App.Application = findApplicationById(id);
  return res.json(application);
}

function findApplicationById(id: string): App.Application {
  const application: App.Application = buildApplication(Number(id), "1", "1");
  const size = 30;
  const instances: App.ApplicationInstance[] =
    new Array<App.ApplicationInstance>(size);
  for (let i = 0; i < size; i++) {
    instances[i] = buildApplicationInstance(i + 1, application.name, id);
  }
  application.instances = instances;
  return application;
}

function buildApplicationInstance(
  id: number,
  applicationName: string,
  applicationId: string,
  metadata?: Metadata
): App.ApplicationInstance {
  const date: number = new Date().getTime();
  const health = id % 2 == 0 ? "UP" : "DOWN";
  const secure: boolean = id % 2 == 0;
  const host = `192.168.1.${id}`;
  const port = id + 27000;
  const uri = `${secure ? "https" : "http"}://${host}:${port}`;
  const meta: Metadata = metadata || {
    key1: "value1",
    key2: "value2",
    Key3: "value3",
  };
  return {
    id,
    applicationId,
    instanceId: `${applicationName}-instance-${id}`,
    health,
    host,
    port,
    secure,
    uri,
    createdAt: date,
    updatedAt: date,
    metadata: meta,
  };
}

function buildApplication(
  index: number,
  clusterId: string,
  namespaceId: string
): App.Application {
  const date: number = 1715325352000;
  return {
    id: `${index}`,
    name: `App-${index}`,
    description: "NO DESC",
    createdAt: date + index * 10000,
    updatedAt: date + index * 20000,
    clusterId,
    namespaceId,
  };
}

function saveInstanceMetadata(req: Request, res: Response) {
  const body = req.body;
  const { applicationId, instanceId, metadata } = body;

  const instance: App.ApplicationInstance = buildApplicationInstance(
    instanceId,
    "App-1",
    applicationId,
    metadata
  );

  return res.json(instance);
}

export default {
  "GET  /api/app/clusters": findClusters,
  "GET /api/app/cluster/:id": findCluster,
  "POST /api/app/cluster": addCluster,
  "PUT /api/app/cluster": updateCluster,
  "DELETE /api/app/cluster/": deleteCluster,
  "POST /api/app/namespace/": addNamespace,
  "DELETE /api/app/namespace/": deleteNamespace,
  "GET /api/app/namespaces/:clusterId": findNamespaces,
  "PUT /api/app/namespace/": updateNamespace,
  "GET /api/app/applications": findApplications,
  "GET /api/app/application/:id": findApplication,
  "POST /api/app/instance/metadata/": saveInstanceMetadata,
};
