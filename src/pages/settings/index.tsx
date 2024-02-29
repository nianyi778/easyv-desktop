import { Descriptions, DescriptionsProps, Input } from "antd";
import Header from "./components/header";

export default function Settings() {

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: '后端服务',
            children: <span>
                <Input></Input>
            </span>,
        },
    ];

    return <div className=" px-[20px] text-gray-50">
        <Header></Header>

        <div className=" pt-[20px]">
            <Descriptions title="产品设置" layout="vertical" items={items} />
        </div>
    </div>
}