import { Button } from "antd";

const ConnectBox = (props) => {
    const { connectInjectedConnector, connectWalletConnectConnector} = props;
    return (
        <div className="container">
            <Button type="primary" onClick={() => {connectInjectedConnector()}}>Meta Mask</Button>
            <Button type="primary" onClick={() => {connectWalletConnectConnector()}}>Wallet Connect</Button>
        </div>
    )
}

export default ConnectBox;
