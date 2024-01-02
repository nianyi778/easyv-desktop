import { Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ImportScreen from './importScreen';

function Header({ onHide }: { onHide?: () => void }) {

    return (
        <div className='flex align-middle justify-end'>
            <Space>
                <Input placeholder="搜索" prefix={<SearchOutlined />} />
                <Button type='default'>管理</Button>
                <ImportScreen onHide={onHide}>
                    <Button type='primary'> 导入</Button>
                </ImportScreen>
            </Space>
        </div>
    )
}

export default Header;