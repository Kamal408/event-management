import { Dayjs } from "dayjs";
import { Component } from "react";

export interface FieldType {
  title: string;
  startDateTime: string;
  endDateTime: string;
  description?: string;
  participants: string[] | string;
}

export interface FieldTypeWithId extends FieldType {
  id: string;
}

export interface EventFormProps {
  initialValue?: FieldTypeWithId;
  handleInitialValue?: () => void;
}

export interface EventFormState {
  emails: string[];
  loader: boolean;
}

export type OnFinishValues = {
  title: string;
  startDateTime: Dayjs;
  endDateTime: Dayjs;
  description?: string;
  participants: string[];
};

export type DisabledDateFunc = (current: Dayjs) => boolean;

declare module "react-multi-email" {
  interface ReactMultiEmailProps {
    placeholder?: string;
    emails: string[];
    onChange: (emails: string[]) => void;
    style?: React.CSSProperties;
    getLabel: (
      email: string,
      index: number,
      removeEmail: (index: number) => void
    ) => React.ReactNode;
  }

  export class ReactMultiEmail extends Component<ReactMultiEmailProps> {}
}
