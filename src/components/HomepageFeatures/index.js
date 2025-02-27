import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

import {Card, Col, Row, Divider, Timeline, Space, Table, Tag} from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

const {Meta} = Card;

// import useBaseUrl from '@docusaurus/useBaseUrl';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: (_, { tags }) => (
            <>
                {tags.map((tag) => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Invite {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
];
const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];

export default function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className="container">
                <Row>
                    <Table columns={columns} dataSource={data} />
                </Row>
                <Row>
                    <Col span={11}>
                        <Divider orientation="left">Introduction</Divider>
                        <p>haha</p>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <Divider orientation="left">How to Contribute</Divider>
                        <p>hehe</p>
                    </Col>
                </Row>
            </div>
        </section>
    );
}
