import { gql, useQuery } from "@apollo/client";
import { Table } from "antd";
import moment from "moment";
import Web3 from "web3";

const HistoryTable = () => {
    const { loading, data } = useQuery(gql`
    {
      historyEntities(orderBy: time, orderDirection: desc, where: {account: "0x8489bd91c7eD030fc5Fa38632b273f5d9097EE74"}) {
        id
        account
        amount
        time
        method
      }
    }    
  `);

    const columns = [
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Time',
          dataIndex: 'time',
          key: 'time',
        },
      ];
    
      const dataConvert = data?.historyEntities?.map((item, index) => {
        return {
          key: index,
          action: item.method,
          amount: Web3.utils.fromWei(item.amount),
          time: moment.unix(item.time).format("MM/DD/YYYY HH:mm")
        }
      })
    return (
            <Table style={{width: "500px", margin: "0 auto", border: "1px solid gray"}} loading={loading} columns={columns} dataSource={dataConvert} />
    )
}

export default HistoryTable;
