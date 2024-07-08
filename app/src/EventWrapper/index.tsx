// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Flex, Row, Button, Select } from "antd";

import { fetch } from "../utils/httpbase";

import EventCalendar from "./EventCalendar";

import EventForm from "../EventForm";

import { FieldTypeWithId } from "../EventForm/types-d";

const countries = [
  { label: "Australia", value: "AU" },
  { label: "Austria", value: "AT" },
  { label: "United State of America", value: "USA" },
  { label: "Canada", value: "CA" },
  { label: "France", value: "FR" },
  { label: "Iran", value: "IR" },
  { label: "Finland", value: "FI" },
];

const EventWrapper = () => {
  const [initialValues, setInitialValues] = useState<FieldTypeWithId>();

  const [country, setCountry] = useState("CA");

  const [holiday, setHoliday] = useState([]);

  const fetchRef = useRef<undefined | boolean>(undefined);
  const [loading, setLoading] = useState(false);

  const [events, setEvents] = useState<{
    [key: string]: {
      description: string;
      endDateTime: string;
      id: number;
      participants: string;
      startDateTime: string;
      title: string;
    }[];
  }>({});

  const fetchEventList = useCallback(async () => {
    setLoading(true);
    const res = await fetch("events", {});
    setEvents(res?.data);
    if (res.status) {
      setLoading(false);
    }
  }, []);

  const fetchHolidayList = useCallback(async (name: string) => {
    const res = await fetch("holidays", { country: name, year: "2024" });

    if (res?.status === 200) {
      setHoliday(res?.data);
    }
  }, []);

  useEffect(() => {
    if (!fetchRef.current) {
      fetchRef.current = true;
      fetchEventList();
      fetchHolidayList(country);
    }
  }, [fetchEventList, fetchHolidayList, country]);

  const handleInitialValue = (value: FieldTypeWithId) => {
    setInitialValues(value);
    fetchEventList();
  };

  const handleCountryChanges = (name: string) => {
    setCountry(name);
    fetchHolidayList(name);
  };

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={6}>
          <EventForm
            initialValue={initialValues}
            handleInitialValue={handleInitialValue}
          />
        </Col>
        <Col span={18}>
          <Flex style={{ borderRadius: "8px", padding: "0 12px" }}>
            <Flex vertical gap="8px">
              <div
                style={{
                  borderRadius: "6px",
                  background: "#fff",
                  padding: "12px",
                  position: "relative",
                }}
              >
                <div style={{ position: "absolute", marginTop: "8px" }}>
                  <Select
                    value={country}
                    options={countries}
                    onChange={handleCountryChanges}
                    style={{ width: "240px" }}
                    placeholder="Select country"
                  ></Select>
                </div>
                <EventCalendar
                  events={events}
                  holiday={holiday}
                  handleInitialValue={handleInitialValue}
                  setEvents={setEvents}
                />
              </div>
            </Flex>
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export default EventWrapper;
