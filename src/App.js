import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import ConnectBox from "./component/ConnectBox";
import ERC20 from "./constants/ERC20.json";
import DD2Abi from "./constants/DD2Abi.json";
import MasterChefAbi from "./constants/masterChefAbi.json";
import "antd/dist/antd.css";
import MainBox from "./component/MainBox";
import {
  DD2_ADDRESS,
  MASTER_CHEF_ADDRESS,
  WETH_ADDRESS,
} from "./constants/constants";
import * as ethMultiCall from "ethereum-multicall";
import { getDataFromResultMultiCall } from "./shared/helpers";
import { Modal, notification } from "antd";
import ModalWriteContract from "./component/ModalWriteContract";
import HistoryTable from "./component/HistoryTable";

const INFURA_KEY = "438e89e17a55438897a1e5a5590211b0";
const WALLET_CONNECT_BRIDGE_URL = "https://bridge.walletconnect.org";

const NETWORK_URLS = {
  1: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  4: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  5: `https://goerli.infura.io/v3/${INFURA_KEY}`,
};

const injected = new InjectedConnector({
  supportedChainIds: [1, 4, 5],
});

const walletConnectConnector = new WalletConnectConnector({
  supportedChainIds: [1, 4, 5],
  rpc: NETWORK_URLS,
  bridge: WALLET_CONNECT_BRIDGE_URL,
  qrcode: true,
});

function App() {
  const { account, chainId, connector, activate, library } = useWeb3React();
  const [web3, setWeb3] = useState(null);
  const [wethContract, setWethContract] = useState(null);
  const [DD2Contract, setDD2Contract] = useState(null);
  const [masterChefContract, setMasterChefContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [balanceEarnDD2, setBalanceEarnDD2] = useState(0);
  const [stake, setStake] = useState(0);
  const [totalStake, setTotalStake] = useState(0);
  const [balanceAllowance, setBalanceAllowance] = useState(0);

  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [isWithDrawModalVisible, setIsWithDrawModalVisible] = useState(false);
  const connectInjectedConnector = () => {
    activate(injected);
  };

  const connectWalletConnectConnector = () => {
    activate(walletConnectConnector, undefined, true).catch((e) =>
      console.log("error:", e)
    );
  };

  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  const handleApproved = async () => {
    try {
      await wethContract.methods
        .approve(
          "0x9da687e88b0A807e57f1913bCD31D56c49C872c2",
          "500000000000000000"
        )
        .send({ from: account });
      openNotificationWithIcon(
        "success",
        "approve notification",
        "successes!!!"
      );
    } catch (error) {
      openNotificationWithIcon("success", "approve notification", error);
    }
  };

  const handleDeposit = async (amount) => {
    try {
      await masterChefContract.methods
        .deposit(Web3.utils.toWei(String(amount), "ether"))
        .send({ from: account });
      openNotificationWithIcon(
        "success",
        "transaction notification",
        "successes!!!"
      );
      setIsDepositModalVisible(false);
    } catch (err) {
      openNotificationWithIcon("error", "transaction notification", err);
      setIsDepositModalVisible(false);
    }
  };

  const handleWithDraw = async (amount) => {
    try {
      await masterChefContract.methods
        .withdraw(Web3.utils.toWei(String(amount), "ether"))
        .send({ from: account });
      openNotificationWithIcon(
        "success",
        "transaction notification",
        "successes!!!"
      );
      setIsWithDrawModalVisible(false);
    } catch (err) {
      openNotificationWithIcon("error", "transaction notification", err);
      setIsWithDrawModalVisible(false);
    }
  };

  const handleCancerPopup = () => {
    setIsDepositModalVisible(false);
    setIsWithDrawModalVisible(false);
  };
  const getStaticInfo = async () => {
    try {
      const multiCall = new ethMultiCall.Multicall({
        web3Instance: web3,
        tryAggregate: true,
      });

      const results = await multiCall.call([
        {
          reference: "balanceWeth",
          contractAddress: WETH_ADDRESS,
          abi: ERC20,
          calls: [
            {
              reference: "balanceWeth",
              methodName: "balanceOf",
              methodParameters: [account],
            },
          ],
        },
        {
          reference: "balanceAllowance",
          contractAddress: WETH_ADDRESS,
          abi: ERC20,
          calls: [
            {
              reference: "balanceAllowance",
              methodName: "allowance",
              methodParameters: [account, MASTER_CHEF_ADDRESS],
            },
          ],
        },
        {
          reference: "balanceEarnDD2",
          contractAddress: MASTER_CHEF_ADDRESS,
          abi: MasterChefAbi,
          calls: [
            {
              reference: "balanceEarnDD2",
              methodName: "pendingDD2",
              methodParameters: [account],
            },
          ],
        },
        {
          reference: "stake",
          contractAddress: MASTER_CHEF_ADDRESS,
          abi: MasterChefAbi,
          calls: [
            {
              reference: "stake",
              methodName: "userInfo",
              methodParameters: [account],
            },
          ],
        },
        {
          reference: "totalStake",
          contractAddress: WETH_ADDRESS,
          abi: ERC20,
          calls: [
            {
              reference: "totalStake",
              methodName: "balanceOf",
              methodParameters: [MASTER_CHEF_ADDRESS],
            },
          ],
        },
      ]);

      const {
        balanceWeth,
        balanceAllowance,
        balanceEarnDD2,
        stake,
        totalStake,
      } = results.results;

      setBalance(getDataFromResultMultiCall(balanceWeth));
      setBalanceAllowance(getDataFromResultMultiCall(balanceAllowance));
      setBalanceEarnDD2(getDataFromResultMultiCall(balanceEarnDD2));
      setStake(getDataFromResultMultiCall(stake));
      setTotalStake(getDataFromResultMultiCall(totalStake));
    } catch (e) {
      console.log(e);
    }
  };

  const showDepositModal = () => {
    setIsDepositModalVisible(true);
  };

  const showWithDrawModalVisible = () => {
    setIsWithDrawModalVisible(true);
  };

  useEffect(() => {
    if (account && chainId && library) {
      const web3 = new Web3(library.provider);
      const wethContract = new web3.eth.Contract(ERC20, WETH_ADDRESS);
      const masterChefContract = new web3.eth.Contract(
        MasterChefAbi,
        MASTER_CHEF_ADDRESS
      );
      const DD2Contract = new web3.eth.Contract(DD2Abi, DD2_ADDRESS);
      setWeb3(web3);
      setWethContract(wethContract);
      setDD2Contract(DD2Contract);
      setMasterChefContract(masterChefContract);
    }
  }, [account, chainId, library]);

  useEffect(() => {
    if (web3 && wethContract && DD2Contract && masterChefContract) {
      getStaticInfo();
    }
  }, [DD2Contract, account, masterChefContract, web3, wethContract]);

  return (
    <div className="App">
      {account ? (
        <>
          <MainBox
            account={account}
            balance={balance}
            balanceEarnDD2={balanceEarnDD2}
            stake={stake}
            totalStake={totalStake}
            balanceAllowance={balanceAllowance}
            handleApproved={handleApproved}
            handleHarvest={() => {
              handleDeposit(0);
            }}
            handleDeposit={showDepositModal}
            handleWithDraw={showWithDrawModalVisible}
          />
          <HistoryTable></HistoryTable>
        </>
      ) : (
        <ConnectBox
          connectInjectedConnector={connectInjectedConnector}
          connectWalletConnectConnector={connectWalletConnectConnector}
        />
      )}
      <ModalWriteContract
        title="Stake"
        balance={balance}
        titleBalance="balance"
        isModalVisible={isDepositModalVisible}
        handleOk={handleDeposit}
        handleCancel={handleCancerPopup}
      />
      <ModalWriteContract
        title="WithDraw"
        balance={stake}
        titleBalance="deposited"
        isModalVisible={isWithDrawModalVisible}
        handleOk={handleWithDraw}
        handleCancel={handleCancerPopup}
      />
    </div>
  );
}

export default App;
