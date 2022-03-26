import { InputNumber, Modal } from "antd";
import Text from "antd/lib/typography/Text";
import { useState } from "react";

const ModalWriteContract = (props) => {
    const { title, balance, titleBalance, isModalVisible, handleOk, handleCancel} = props;
    const [dataInput, setDataInput]= useState(0);
    return (
        <Modal title={title} visible={isModalVisible} onOk={() => handleOk(dataInput)} onCancel={handleCancel}>
            <InputNumber value={dataInput}  max={balance} placeholder="Input you amount" onChange={(e)=> setDataInput(e)}></InputNumber>
            <br/>
            <Text>Your WETH {titleBalance}: {balance}</Text>
        </Modal>
    )
}

export default ModalWriteContract;
