import React from 'react';
import {Divider, Row, List, Tag, Typography} from 'antd';
import Layout from '@theme/Layout';

import fallacyList from '@site/static/data/fallacies.json';

const COLORS = ['red', 'volcano', 'orange', 'gold', 'yellow', 'lime',
    'green', 'cyan', 'blue', 'geekblue', 'purple', 'magenta']
const hashString = (string) => string.split('').map((char) => char.charCodeAt(0)).reduce((a, b) => a + b, 0)
const stringToColor = (string) => COLORS[hashString(string) % COLORS.length];

const Dataset = () => {
    return (
        <Layout
            title={`Publication`}
            description="">
            <main>
                <div className="container" style={{padding: "16px"}}>
                    <Row>
                        <Divider orientation="left">Logic Fallacies</Divider>
                        <p>There is no universally agreed-upon classification of logical fallacies,
                            and many existing categorizations contain overlapping concepts.
                            After reviewing relevant literature and prior studies,
                            we have identified the following types of logical fallacies for labeling our data.</p>
                        <List
                            bordered
                            dataSource={fallacyList}
                            renderItem={(item) => (
                                <List.Item>
                                    <Tag bordered={false} color={stringToColor(item.name)}>{item.name}</Tag> {item.description}
                                </List.Item>
                            )}
                        />
                    </Row>
                </div>
            </main>
        </Layout>
    );
};
export default Dataset;