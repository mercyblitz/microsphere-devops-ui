import { request, useRequest } from "umi";
import type { RequestData } from "@ant-design/pro-table";
import type { App } from "./data.d";

export async function queryClusters(params: {
  count: number;
}): Promise<{ data: { list: App.Cluster[] } }> {
  return request("/api/app/clusters", {
    params,
  });
}

export async function queryCluster(params: {
  id: string;
}): Promise<App.Cluster> {
  return request(`/api/app/cluster/${params.id}`);
}

export async function saveCluster(params: { cluster: App.Cluster }) {
  return request<App.Cluster[]>("/api/app/cluster/", {
    method: "POST",
    data: params,
  });
}

export async function updateCluster(params: { cluster: App.Cluster }) {
  return request<App.Cluster[]>("/api/app/cluster/", {
    method: "PUT",
    data: params,
  });
}

export async function removeCluster(params: { id: string }) {
  return request(`/api/app/cluster/`, {
    method: "DELETE",
    data: params,
  });
}

export async function saveNamespace(params: {
  clusterId: string;
  namespace: App.Namespace;
}) {
  return request<App.Namespace[]>("/api/app/namespace/", {
    method: "POST",
    data: params,
  });
}

export async function updateNamespace(params: {
  clusterId: string;
  namespace: App.Namespace;
}) {
  return request<App.Namespace[]>("/api/app/namespace/", {
    method: "PUT",
    data: params,
  });
}

export async function queryNamespaces(params: {
  clusterId: string;
}): Promise<{ data: { list: App.Namespace[] } }> {
  return request(`/api/app/namespaces/${params.clusterId}`);
}

export async function removeNamespace(params: {
  clusterId: string;
  namespaceId: string;
}) {
  return request(`/api/app/namespace/`, {
    method: "DELETE",
    data: params,
  });
}

export async function queryApplications(params: {
  pageSize?: number;
  current?: number;
  keyword?: string;
  applicationName?: string;
  clusterId?: string;
  namespaceId?: string;
}): Promise<Partial<RequestData<App.Application[]>>> {
  return request("/api/app/applications", {
    params,
  });
}

export async function queryApplication(params: {
  id: string;
}): Promise<App.Application> {
  return request(`/api/app/application/${params.id}`);
}

export async function saveInstanceMetadata(params: {
  applicationId: string;
  instanceId: string;
  metadata: App.Metadata;
}): Promise<App.ApplicationInstance> {
  return request("/api/app/instance/metadata/", {
    method: "POST",
    data: params,
  });
}
