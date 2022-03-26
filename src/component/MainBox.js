import { Button, Col, Row } from "antd";

const MainBox = (props) => {
  const {
    account,
    balance,
    balanceAllowance,
    handleApproved,
    balanceEarnDD2,
    stake,
    totalStake,
    handleDeposit,
    handleWithDraw,
    handleHarvest
  } = props;
  return (
    <div className="container main-box">
      <Row>
        <Col span={12}>
          Wallet address: <span className="three-dots">{account}</span>
        </Col>
        <Col span={12}>
          Balance: <span className="three-dots">{balance}</span> WETH
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          Token earned: <span className="three-dots">{balanceEarnDD2}</span> DD2
        </Col>
        <Col span={12}>
          {" "}
          <Button onClick={handleHarvest}>Harvest</Button>
        </Col>
      </Row>
      <Row>
        {balanceAllowance > 0 ? (
          <>
            <Col span={12}>
              <Button onClick={() => handleDeposit()}>Deposit</Button>
            </Col>
            <Col span={12}>
              <Button onClick={() => handleWithDraw()}>WithDraw</Button>
            </Col>
          </>
        ) : (
          <Col span={24}>
            <Button onClick={() => handleApproved()}>Approved</Button>
          </Col>
        )}
      </Row>
      <Row>
        <Col style={{ justifyContent: "flex-start" }} span={24}>
          Your stake: {stake} WETH
        </Col>
      </Row>
      <Row>
        <Col style={{ justifyContent: "flex-start" }} span={24}>
          Total staked: {totalStake} WETH
        </Col>
      </Row>
    </div>
  );
};

export default MainBox;
