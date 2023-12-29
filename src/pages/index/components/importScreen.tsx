import { Modal, Upload } from 'antd';
import { ReactNode, useCallback, useState } from "react";
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { extractJsonFromZip, createJson } from '@/utils/index';
import type { UploadFile } from 'antd/es/upload/interface';
const { Dragger } = Upload;


export default function ImportScreen({ children, onHide }: { children: ReactNode, onHide?: () => void }) {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [open, setOpen] = useState(false);

    const handleOk = useCallback(() => {
        // 123
        setOpen(false);
        onHide?.();
    }, []);
    const handleCancel = useCallback(() => {
        //handleCancel
        setOpen(false);
        onHide?.();
    }, [])

    const props: UploadProps = {
        accept: '.screen',
        onRemove: (file: UploadFile<any>) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file: UploadFile<any>) => {
            setFileList([...fileList, file]);
            return false;
        },
        async onChange(info: { file: any; fileList: any; }) {
            const { file, fileList } = info;
            const cur = fileList.find((d: { uid: any; }) => d.uid === file.uid);
            if (cur) {
                const result = extractJsonFromZip(
                    cur?.originFileObj?.path as string,
                )
                createJson(result);
                console.log(result);
            }

        },
        fileList,
    };


    return <>
        <span onClick={() => setOpen(true)}>
            {children}
        </span>
        <Modal open={open} title='大屏导入' onOk={handleOk} onCancel={handleCancel} footer={(_, { OkBtn }) => (<>
            <OkBtn />
        </>)} >
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
                <p className="ant-upload-hint">
                    支持单个或批量上传，仅支持.screen文件类型。
                </p>
            </Dragger>
        </Modal>
    </>
}