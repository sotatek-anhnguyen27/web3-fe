import Web3 from "web3"

export const getDataFromResultMultiCall = (data) => {
    return Web3.utils.fromWei(Web3.utils.toBN(data.callsReturnContext[0].returnValues[0].hex).toString());
}