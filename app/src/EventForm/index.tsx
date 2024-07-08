// @ts-nocheck
import { useEffect, useState } from "react";
import { Button, Card, DatePicker, Form, Input, message } from "antd";
import { ReactMultiEmail } from "react-multi-email";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import "react-multi-email/dist/style.css";

import { store, update } from "../utils/httpbase";
import useLocalStorage from "../hooks/storage";

import { EventFormProps, FieldType, DisabledDateFunc } from "./types-d"; // Adjust the import path as needed

dayjs.extend(utc);
dayjs.extend(timezone);

const TimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const EventForm = ({ initialValue, handleInitialValue }: EventFormProps) => {
  const [timeZone] = useLocalStorage("timezone", TimeZone);

  // eslint-disable-next-line arrow-body-style
  const disabledDate: DisabledDateFunc = (current) => {
    // Can not select days before today
    // return current && current < dayjs().endOf("day");
    return current < dayjs().endOf("day").subtract(1, 'day');
  };
  const [form] = Form.useForm();

  const [emails, setEmails] = useState<string[]>([]);

  const [loader, setLoader] = useState(false);

  const onFinish = async (values: FieldType) => {
    setLoader(true);

    const formattedValue = {
      ...values,

      startDateTime: dayjs
        .tz(values.startDateTime, timeZone)
        .utc()
        .format("YYYY-MM-DD HH:mm:ss"),
      endDateTime: dayjs
        .tz(values.endDateTime, timeZone)
        .utc()
        .format("YYYY-MM-DD HH:mm:ss"),
      participants: values?.participants.toString(),
    };
    if (initialValue?.id) {
      let res = [];
      try {
        res = await update("events", initialValue.id, formattedValue);
      } catch (error){
        res = error.response
      }

      if (res.status === 200) {
        message.success("Event updated success");
        handleInitialValue();
        setEmails([]);
        form.resetFields();
      } else if(res?.status === 400) {
        message.error(res?.data?.message || "Validation Error");
      } else {
        message.error(res?.data?.error?.message || "Unable to add event");
      }
      setLoader(false);
      return;
    }

    let res = {};
    try {
      res = await store("events", formattedValue);
    } catch (error) {
      res = error.response;
    }
    
    if (res?.status === 200) {
      form.resetFields();
      setEmails([]);
      handleInitialValue();
      message.success("Event added successfully.");
    } else if(res?.status === 400) {
      message.error(res?.data?.message || "Validation Error");
    } else {
      message.error(res?.data?.error?.message || "Unable to add event");
    }
    setLoader(false);
  };

  useEffect(() => {
    if (initialValue) {
      const emailList =
        typeof initialValue.participants === "string"
          ? initialValue.participants.split(",")
          : [];
      setEmails(emailList);
      form.setFieldValue("title", initialValue.title);
      form.setFieldValue("startDateTime", dayjs(initialValue.startDateTime));
      form.setFieldValue("endDateTime", dayjs(initialValue.endDateTime));
      form.setFieldValue("description", initialValue.description);
      form.setFieldValue("participants", initialValue.participants);
    }
  }, [form, initialValue]);

  return (
    <Card title={`${initialValue?.id ? "Update" : "Add"}  Event`} bordered>
      <Form
        layout="vertical"
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item
          label="Name of event"
          name="title"
          rules={[
            { required: true, message: "Required" },
            {
              max: 40,
              message: "Only 40 character max",
            },
          ]}
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Event start on"
          name="startDateTime"
          rules={[{ required: true, message: "Required" }]}
        >
          <DatePicker
            disabledDate={disabledDate}
            style={{ width: "100%" }}
            showTime
          />
        </Form.Item>

        <Form.Item
          label="Event end on"
          name="endDateTime"
          rules={[{ required: true, message: "Required" }]}
        >
          <DatePicker
            disabledDate={disabledDate}
            style={{ width: "100%" }}
            showTime
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Participant"
          name="participants"
          rules={[{ required: true, message: "Required" }]}
        >
          <ReactMultiEmail
            placeholder="input email address"
            emails={emails}
            onChange={(newEmails: string[]) => {
              setEmails(newEmails);
            }}
            style={{ width: "100%" }}
            getLabel={(
              email: string,
              index: number,
              removeEmail: (index: number) => void
            ) => (
              <div data-tag key={index}>
                {email}
                <span data-tag-handle onClick={() => removeEmail(index)}>
                  ×
                </span>
              </div>
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" block htmlType="submit" loading={loader}>
            {`${initialValue?.id ? "Update" : "Add"} event`}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EventForm;
