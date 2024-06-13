import type { I18n } from "./data.d";

const sources: I18n.Sources[] = [
  {
    name: "common",
    resources: [
      {
        locale: "zh_CN",
        content: {
          "common.a": "啊",
          "common.b": "波",
          "common.c": "西",
        },
      },
    ],
  },
  {
    name: "i18n-bootstrap",
    resources: [
      {
        locale: "en_US",
        content: {
          "common.a": "a",
          "common.b": "b",
          "common.c": "c",
        },
      },
    ],
  },
];

function getSources(req: Request, res: Response) {
  return res.json(sources);
}

export default {
  "GET /api/i18n/sources": getSources,
};
