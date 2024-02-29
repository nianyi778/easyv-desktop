import { LeftOutlined } from "@ant-design/icons";

export default function Header() {
    return <div className=" h-[45px] flex items-center">
        <span className=" hover:opacity-70 cursor-pointer transition-opacity" onClick={() => {
            window.location.href = '/';
        }}>
            <LeftOutlined className="mr-[6px] text-[14px]" />
            <span className=" text-[18px] font-bold">返回</span>
        </span>

    </div>
}