// @ts-nocheck
import React from "react";
import type { PopconfirmProps } from "antd";
import { Button, message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { destroy } from "../utils/httpbase";

const DeleteButton: React.FC = ({ selectedEvent, setEvents }) => {
  const { id, startDateTime } = selectedEvent;

  const confirm: PopconfirmProps["onConfirm"] = () => {
    destroy("events", `${id}`);
    setEvents((prevEvents) => {
      const updatedEvents = {...prevEvents};
      const dateKey = startDateTime.match(/(\d{4}-\d{1,2}-\d{1,2})/)[0];
      updatedEvents[dateKey] = updatedEvents[dateKey].filter((item) => {
        return item.id != id
      });
      return updatedEvents;
    });
    message.success("Event deleted");
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
  };

  return (
    <Popconfirm
      title="Delete the task"
      description="Are you sure to delete this event?"
      onConfirm={confirm}
      onCancel={cancel}
      okText="Yes"
      cancelText="No"
    >
      <Button type="text" danger size="small" icon={<DeleteOutlined />} />
    </Popconfirm>
  );
};

export default DeleteButton;
