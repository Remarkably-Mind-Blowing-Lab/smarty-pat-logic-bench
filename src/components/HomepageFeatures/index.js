import React, { useRef, useState } from 'react';
import styles from './styles.module.css';

import {Card, Col, Row, Divider, Timeline, Space, Table, Tag, Form, Radio, Switch, List, Button, Input } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { ResponsiveRadar } from '@nivo/radar'

const {Meta} = Card;

// import useBaseUrl from '@docusaurus/useBaseUrl';

import resultList from '@site/static/data/sample_result.json';
// import dataList from '@site/static/data/sample_dataset.json';
import dataList from '@site/static/data/data500.json';

const uniqueModels = [...new Set(resultList.map(record => record.model))];
const modelFilters = uniqueModels.map((model) => ({text: model, value: model}));

const uniqueOrgs = [...new Set(resultList.map(record => record.org))];
const orgFilters = uniqueOrgs.map((org) => ({text: org, value: org}));

const defaultTitle = () => 'Leaderboard';

function getRadarChartData(data) {
    // Sort the data descending by "f1" and take the top 3 objects
    const topThree = data
        .sort((a, b) => b.f1 - a.f1)
        .slice(0, 3);

    // List of metrics to include in the output
    const metrics = ["false_positive", "false_negative", "fallacy_label_score", "reasoning_score"];

    // Build the output array where each element corresponds to a metric
    const result = metrics.map(metric => {
        // Start with an object that includes the metric name
        const obj = { metric };

        // For each top data entry, add a key in the format "org-model" with its corresponding metric value
        topThree.forEach(item => {
            const key = `${item.org}-${item.model}`;
            obj[key] = item[metric];
        });

        return obj;
    });

    return result;
}

function getTop3F1ScoreIdentifiers(data) {
    // Create a shallow copy and sort descending by f1 score
    const sortedData = data.slice().sort((a, b) => b.f1 - a.f1);
    // Select the top 3 objects
    const top3 = sortedData.slice(0, 3);
    // Map each object to the formatted string "org-model"
    return top3.map(item => `${item.org}-${item.model}`);
}

export default function HomepageFeatures() {
    const initRandomData = dataList[Math.floor(Math.random() * dataList.length)];
    const [bordered, setBordered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState('middle');
    const [showTitle, setShowTitle] = useState(false);
    const [tableLayout, setTableLayout] = useState();
    const [ellipsis, setEllipsis] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [randomData, setRandomData] = useState(initRandomData);

    const columns = [
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
            // filters: modelFilters,
            // onFilter: (value, record) => record.venue === value,
        },
        {
            title: 'Org',
            dataIndex: 'org',
            key: 'org',
            filters: orgFilters,
            onFilter: (value, record) => record.org === value,
        },
        {
            title: 'F1 Score',
            dataIndex: 'f1',
            key: 'f1',
            sorter: (a, b) => a.f1 - b.f1,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'False Positive',
            dataIndex: 'false_positive',
            key: 'false_positive',
            sorter: (a, b) => a.false_positive - b.false_positive,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'False Negative',
            dataIndex: 'false_negative',
            key: 'false_negative',
            sorter: (a, b) => a.false_negative - b.false_negative,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Fallacy Labelling Score',
            dataIndex: 'fallacy_label_score',
            key: 'fallacy_label_score',
            sorter: (a, b) => a.fallacy_label_score - b.fallacy_label_score,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Reasoning Score',
            dataIndex: 'reasoning_score',
            key: 'reasoning_score',
            sorter: (a, b) => a.reasoning_score - b.reasoning_score,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => a.date - b.date,
            sortDirections: ['descend', 'ascend'],
        },
    ];


    const tableColumns = columns.map((item) => ({
        ...item,
        ellipsis,
    }));

    const changeRandomData = () => {
        setRandomData(dataList[Math.floor(Math.random() * dataList.length)])
    };

    const radarChartData = getRadarChartData(resultList);

    const topIdentifiers = getTop3F1ScoreIdentifiers(resultList);

    console.log(radarChartData);
    console.log(topIdentifiers);

    const MyResponsiveRadar = ({ radarChartData }) => (
        <ResponsiveRadar
            data={radarChartData}
            keys={topIdentifiers}
            indexBy="metric"
            valueFormat=">-.2f"
            margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
            borderColor={{ from: 'color' }}
            gridLabelOffset={36}
            dotSize={10}
            dotColor={{ theme: 'background' }}
            dotBorderWidth={2}
            colors={{ scheme: 'nivo' }}
            blendMode="multiply"
            motionConfig="wobbly"
            legends={[
                {
                    anchor: 'top-left',
                    direction: 'column',
                    translateX: -50,
                    translateY: -40,
                    itemWidth: 80,
                    itemHeight: 20,
                    itemTextColor: '#999',
                    symbolSize: 12,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000'
                            }
                        }
                    ]
                }
            ]}
        />
    );

    return (
        // <section className={styles.features}>
            <div className="container">
                <Row>
                    <Col span={15}>
                        <Divider orientation="left">Leaderboard</Divider>
                        <div style={{
                            // background: "#EFF2F5",
                            padding: "16px",
                            textAlign: "center",
                            marginLeft: "5%",
                            marginRight: "5%"
                        }}>
                            <Table
                                columns={tableColumns}
                                dataSource={resultList}
                                // pagination={{
                                //     position: ["bottomCenter"],
                                // }}
                                pagination={false}
                                size={"middle"}
                            />
                        </div>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={8}>
                        <Divider orientation="left">Top 3 F1 Score Models</Divider>
                        <div style={{height: "300px"}}>
                            <MyResponsiveRadar radarChartData={radarChartData} />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <Divider orientation="left">Introduction</Divider>
                        <p>haha</p>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <Divider orientation="left">Metrics</Divider>
                        <p>hehe</p>
                    </Col>
                </Row>
                <Divider orientation="left">Peek into Our Dataset</Divider>
                <Row>
                    <Col span={6} style={{ textAlign: "center"}}>
                        <Button type="primary" size="large" onClick={changeRandomData}>
                            Click me to get some shitty advice!
                        </Button>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={16} style={{ background: "#EFF2F5", padding: "16px"}}>
                        <p>
                            {randomData}
                        </p>
                    </Col>
                </Row>
            </div>
        // </section>
);
}
