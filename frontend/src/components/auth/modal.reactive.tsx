"use client";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import {
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, notification, Steps } from "antd";
import React, { useState } from "react";

const ModalReactive = (props: any) => {
  const { isOpenModal, setIsOpenModal, email } = props;
  const [current, setCurrent] = useState(0);
  const [userId, setUserId] = useState("");
  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;
  const onFinishStepZero = async (values: any) => {
    const { email } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
      method: "POST",
      body: {
        email,
      },
    });
    if (res?.data) {
      setUserId(res?.data?._id);
      setCurrent(1);
    } else {
      notification.error({
        message: "Error active",
        description: "Mã xác nhận sai",
      });
    }
  };
  const onFinishStepOne = async (values: any) => {
    const { code } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
      method: "POST",
      body: {
        code,
        _id: userId,
      },
    });
    if (res?.data) {
      setCurrent(2);
    } else {
      notification.error({
        message: "Error active",
        description: "Mã xác nhận sai",
      });
    }
  };
  return (
    <>
      <Modal
        title="Kích hoạt tài khoản"
        open={isOpenModal}
        onOk={() => setIsOpenModal(false)}
        onCancel={() => setIsOpenModal(false)}
        maskClosable={false}
        footer={null}
      >
        <Steps
          current={current}
          items={[
            {
              title: "Login",
              icon: <UserOutlined />,
            },
            {
              title: "Verification",
              icon: <SolutionOutlined />,
            },
            {
              title: "Done",
              icon: <SmileOutlined />,
            },
          ]}
        />
        {current === 0 && (
          <>
            <p style={{ margin: "12px 0" }}>
              Tài khoản chưa được kích hoạt. Vui lòng click Resend để gửi lại mã kích hoạt.
            </p>
            <Form
              name="stepzero"
              onFinish={onFinishStepZero}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item label="" name="email" initialValue={email}>
                <Input disabled value={email} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Resend
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
        {current === 1 && (
          <>
            <p style={{ margin: "12px 0" }}>Nhập mã xác nhận.</p>
            <Form
              name="stepone"
              onFinish={onFinishStepOne}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label=""
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input your code!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Kích hoạt
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
        {current === 2 && (
          <>
            <p style={{ margin: "12px 0" }}>Tài khoản kích hoạt thành công.</p>
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalReactive;
