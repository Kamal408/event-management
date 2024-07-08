import { EditOutlined } from "@ant-design/icons";
import type { CalendarProps } from "antd";
import { Badge, Button, Calendar, Flex, Tag, Tooltip } from "antd";
import type { Dayjs } from "dayjs";
import DeleteButton from "./DeleteButton";
import { FieldTypeWithId } from "../EventForm/types-d";

interface EventCalendarProps {
  events: {
    [key: string]: {
      description: string;
      endDateTime: string;
      id: number;
      participants: string;
      startDateTime: string;
      title: string;
    }[];
  };
  handleInitialValue: (value: FieldTypeWithId) => void;
}

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const EventCalendar = ({
  events,
  handleInitialValue,
  holiday,
}: EventCalendarProps) => {
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const dateKey = value.format("YYYY-MM-DD");

    const listData = events[dateKey];

    const holidayData = holiday[dateKey];

    return (
      <div className="events">
        {holidayData?.length > 0 &&
          holidayData.map((day) => (
            <div key={`${day?.date}-${day.country}`}>
              <div style={{ color: "red", fontWeight: 700, fontSize: "12px" }}>
                {day?.name}
              </div>
              <Tag
                bordered={false}
                color="magenta"
                style={{ fontSize: "10px", padding: "1px 2px" }}
              >
                {day?.type}
              </Tag>
            </div>
          ))}
        {listData?.length > 0 &&
          listData.map((item) => (
            <Tooltip
              key={item.id}
              title={
                <Flex vertical key={item.id}>
                  <div>Start time: {item?.startDateTime}</div>
                  <div>End time: {item?.endDateTime}</div>
                </Flex>
              }
            >
              <Flex wrap="wrap" justify="space-between">
                <Badge
                  color="rgb(45, 183, 245)"
                  text={item.title}
                  style={{ fontSize: "10px", color: "hwb(205 6% 9%)" }}
                />
                <Flex>
                  <DeleteButton selectedEvent={item} />

                  <Button
                    size="small"
                    type="text"
                    onClick={(e) => {
                      handleInitialValue(item);

                      e.stopPropagation();
                    }}
                    icon={<EditOutlined />}
                  ></Button>
                </Flex>
              </Flex>
            </Tooltip>
          ))}
      </div>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return <Calendar cellRender={cellRender} />;
};

export default EventCalendar;
