/* eslint-disable */

declare module I18n {
  interface Source {
    name: string;
    resources: LocaledResource[];
  }

  interface LocaledResource {
    locale: string;
    content: LocaledText;
  }

  interface LocaledText extends Record<string, string> {}
}
