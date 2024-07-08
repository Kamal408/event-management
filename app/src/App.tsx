import { Flex, Layout, Typography } from "antd";
import EventCalendar from "./EventWrapper/index";
import TimeZoneList from "./TimeZoneList";

const { Header, Content } = Layout;

const App = () => {
  return (
    <Layout>
      <Header>
        <Flex
          justify="space-between"
          align="center"
          style={{ marginTop: "-12px" }}
        >
          <Flex>
            <Typography.Title style={{ color: "#fff" }}>
              Event Management
            </Typography.Title>
          </Flex>

          <div>
            <TimeZoneList />
          </div>
        </Flex>
      </Header>
      <Content
        style={{
          padding: "12px 24px",
        }}
      >
        <EventCalendar />
      </Content>
    </Layout>
  );
};

export default App;
