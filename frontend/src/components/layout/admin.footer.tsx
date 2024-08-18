'use client'
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                NextJS/NestJS ©{new Date().getFullYear()} All time
            </Footer>
        </>
    )
}

export default AdminFooter;