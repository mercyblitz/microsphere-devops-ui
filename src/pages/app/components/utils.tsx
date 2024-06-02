import { useIntl, FormattedMessage } from "umi";
import moment from "moment";

export function resolveMessage(message: string) {
  const msg = message.trim();
  const beginIndex = msg.indexOf("{");
  const endIndex = msg.indexOf("}");
  if (beginIndex == 0 && endIndex == msg.length - 1) {
    let fullMessage = msg.substring(1, endIndex);
    return resolveMessage0(fullMessage);
  } else {
    return message;
  }
}

function resolveMessage0(message: string) {
  let id = message;
  let defaultMessage = message;

  const separatorIndex = message.indexOf(":");

  if (separatorIndex > -1) {
    id = message.substring(0, separatorIndex);
    defaultMessage = message.substring(separatorIndex + 1);
  }

  return <FormattedMessage id={id} defaultMessage={defaultMessage} />;
}

export const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const resolveFormValues = (formValues: any) => {
  const result = formValues;
  Object.keys(formValues).forEach((key) => {
    if (moment.isMoment(formValues[key])) {
      result[key] = moment(formValues[key]).format();
    }
  });
  return result;
};
