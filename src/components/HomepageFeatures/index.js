import React, { useRef, useState } from 'react';
import styles from './styles.module.css';

import {Card, Col, Row, Divider, Timeline, Space, Table, Tag, Form, Radio, Switch, List, Button, Input } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { ResponsiveRadar } from '@nivo/radar'

const {Meta} = Card;

// import useBaseUrl from '@docusaurus/useBaseUrl';

// import resultList from '@site/static/data/sample_result.json';
import resultList from '@site/static/data/result500.json';

// import dataList from '@site/static/data/sample_dataset.json';
// import dataList from '@site/static/data/data500.json';

import labelList from '@site/static/data/label500.json';

const uniqueModels = [...new Set(resultList.map(record => record.model))];
const modelFilters = uniqueModels.map((model) => ({text: model, value: model}));

const uniqueOrgs = [...new Set(resultList.map(record => record.org))];
const orgFilters = uniqueOrgs.map((org) => ({text: org, value: org}));

const COLORS = [
    '#6BB9F0', // Soft sky blue
    '#F5AB35', // Warm amber
    '#FF6F69', // Coral red
    '#88D8B0', // Mint green
    '#F3D250', // Sunny yellow
    '#A593E0', // Soft violet
    '#79BD9A', // Sage green
    '#F67280', // Rose pink
    '#4D9DE0', // Ocean blue
    '#C06C84', // Dusty mauve
    '#F8B195', // Peach
    '#C9CBA3', // Soft khaki
    '#8D8741', // Olive brown
    '#FFB447', // Mango orange
    '#4ECDC4'  // Turquoise]
]
const hashString = (string) => string.split('').map((char) => char.charCodeAt(0)).reduce((a, b) => a + b, 0)
const stringToColor = (string) => COLORS[hashString(string) % COLORS.length];
const orgColorMap = {};
uniqueOrgs.forEach((org, index) => {
    orgColorMap[org] = COLORS[index % COLORS.length];
});

const defaultTitle = () => 'Leaderboard';

const radarTopN = 10;

function getRadarChartData(data) {
    // Step 1: group by org and pick model with highest F1 for each org
    const bestByOrg = {};
    for (const item of data) {
        const org = item.org;
        if (!bestByOrg[org] || item.f1 > bestByOrg[org].f1) {
            bestByOrg[org] = item;
        }
    }

    const selectedModels = Object.values(bestByOrg); // one model per org
    const metrics = ["f1", "fallacy_label_score", "explanation_score"];
    const result = [];

    metrics.forEach(metric => {
        const values = selectedModels.map(item => item[metric]);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const metricObj = { metric };

        selectedModels.forEach(item => {
            const value = item[metric];
            const normalized = (maxVal - minVal === 0)
                ? 1
                : 0.2 + ((value - minVal) / (maxVal - minVal)) * 0.8;
            metricObj[item.org] = normalized;
        });

        result.push(metricObj);
    });

    return result;
}


// function getRadarChartData(data) {
//     // 1. Sort data descending by f1 score
//     // Step 1: group by org and pick model with highest F1 for each org
//     const bestByOrg = {};
//     const sortedData = data.sort((a, b) => b.f1 - a.f1);
//
//     // 2. Select top 3 items
//     const topData = sortedData.slice(0, radarTopN);
//
//     // 3. Define the metrics to process
//     const metrics = ["f1", "fallacy_label_score", "explanation_score"];
//
//     const result = [];
//
//     // 4. Process each metric
//     metrics.forEach(metric => {
//         // Extract metric values from the top data
//         const values = topData.map(item => item[metric]);
//         const minVal = Math.min(...values);
//         const maxVal = Math.max(...values);
//
//         const metricObj = { metric };
//
//         topData.forEach(item => {
//             const value = item[metric];
//             let normalized;
//             // If all values are equal, assign normalized value 1 (or you could choose 0)
//             if (maxVal - minVal === 0) {
//                 normalized = 1;
//             } else {
//                 normalized = 0.2 + ((value - minVal) / (maxVal - minVal)) * 0.8;
//             }
//             // Create a key combining org and model
//             metricObj[`${item.org}-${item.model}`] = normalized;
//         });
//
//         result.push(metricObj);
//     });
//
//     return result;
// }

function getTopF1ScoreIdentifiers(data) {
    const bestByOrg = {};
    for (const item of data) {
        const org = item.org;
        if (!bestByOrg[org] || item.f1 > bestByOrg[org].f1) {
            bestByOrg[org] = item;
        }
    }

    return Object.keys(bestByOrg); // org names
}

// function getTopF1ScoreIdentifiers(data) {
//     // Create a shallow copy and sort descending by f1 score
//     const sortedData = data.slice().sort((a, b) => b.f1 - a.f1);
//     // Select the top N objects
//     const topN = sortedData.slice(0, radarTopN);
//     // Map each object to the formatted string "org-model"
//     return topN.map(item => `${item.org}-${item.model}`);
// }

export default function HomepageFeatures() {
    const initRandomData = labelList[Math.floor(Math.random() * labelList.length)];
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
            title: 'Explanation Score',
            dataIndex: 'explanation_score',
            key: 'explanation_score',
            sorter: (a, b) => a.explanation_score - b.explanation_score,
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
        setRandomData(labelList[Math.floor(Math.random() * labelList.length)])
    };


    const radarChartData = getRadarChartData(resultList);

    const topIdentifiers = getTopF1ScoreIdentifiers(resultList);

    console.log(radarChartData);
    console.log(topIdentifiers);

    const FallacyLabelList = ({fallacy_label_list}) => (
        <>
            {fallacy_label_list.map((label) => {
                return <Tag bordered={false} color={stringToColor(label)}>{label}</Tag>;
            })}
        </>
    );

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
            colors={d => orgColorMap[d.key] || '#ccc'}
            // colors={{ scheme: 'nivo' }}
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
                    data: topIdentifiers.map(org => ({
                        id: org,
                        label: org,
                        color: orgColorMap[org],
                    })),
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
            <div className="container" style={{marginBottom: "20px"}}>
                <Row>
                    <Col span={24}>
                        <Divider orientation="center">
                                <span style={{ fontWeight: 600, fontSize: '22px', letterSpacing: '2px' }}>
                                    Leaderboard
                                </span>
                        </Divider>
                        <div style={{
                            // background: "#EFF2F5",
                            padding: "20px",
                            textAlign: "center"
                            // marginLeft: "5%",
                            // marginRight: "5%"
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
                </Row>

                <Row gutter={24} style={{ marginTop: "32px" }}>
                    <Col span={12}>
                        <div style={{ marginBottom: "24px" }}>
                            <Divider orientation="center">
                                <span style={{ fontWeight: 600, fontSize: '22px', letterSpacing: '2px' }}>
                                    Introduction
                                </span>
                            </Divider>
                            <p>
                                Despite the growing focus on evaluating LLM reasoning, no existing benchmark specifically targets
                                &nbsp;<strong>logic traps</strong>—often humorous yet deceptive statements common in English-speaking contexts.
                                Moreover, no systematic survey has been conducted to assess how well LLMs navigate such reasoning challenges.
                            </p>
                            <p>
                                To fill this gap, <strong>SocratesEval</strong> introduces a benchmark with <strong>clear logical error labels</strong>,
                                evaluating LLMs on two key tasks: (1) determining whether a given statement contains a logical error, and
                                (2) classifying the type of fallacy. We introduce <strong>structured scoring</strong> to assess fallacy
                                identification and overall reasoning quality, providing a detailed evaluation of LLM performance.
                            </p>
                            <p>
                                Our results offer the first comparative analysis of LLMs’ ability to handle logic traps, shedding light on
                                their reasoning limitations and potential.
                            </p>
                        </div>
                        <div>
                            <Divider orientation="center">
                                <span style={{ fontWeight: 600, fontSize: '22px', letterSpacing: '2px' }}>
                                    Metric
                                </span>
                            </Divider>
                            <p>
                                <strong>False Positive (FP)</strong> occurs when a logically correct sentence is misclassified as a logical fallacy,
                                while <strong>False Negative (FN)</strong> means a logical fallacy is mistakenly labeled as correct.
                            </p>
                            <p>
                                <strong>F1 Score</strong> evaluates the model’s ability to distinguish logical errors, balancing precision and recall.
                            </p>
                            <p>
                                <strong>Fallacy Labelling Score</strong> measures how accurately the model classifies sentences into human-annotated and
                                verified logical fallacy categories.
                            </p>
                            <p>
                                <strong>Explanation Score</strong> assesses how well the model's interpretation of logical errors aligns with human reasoning.
                            </p>
                        </div>
                    </Col>
                    <Col span={12}>
                        <Divider orientation="center">
                                <span style={{ fontWeight: 600, fontSize: '22px', letterSpacing: '2px' }}>
                                    Radar Chart: Top F1 Model from Each Family
                                </span>
                        </Divider>
                        <div style={{ height: "400px" }}>
                            <MyResponsiveRadar radarChartData={radarChartData} />
                        </div>
                    </Col>
                </Row>
                {/*    <Col span={1}></Col>*/}
                {/*    <Col span={8}>*/}
                {/*        <Divider orientation="left">Top {radarTopN} F1 Score Models (values normalized to 0.2-1)</Divider>*/}
                {/*        <div style={{height: "300px"}}>*/}
                {/*            <MyResponsiveRadar radarChartData={radarChartData} />*/}
                {/*        </div>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                {/*<Row>*/}
                {/*    <Col span={11}>*/}
                {/*        <Divider orientation="left">Introduction</Divider>*/}
                {/*        <p>*/}
                {/*            Despite the growing focus on evaluating LLM reasoning, no existing benchmark specifically targets*/}
                {/*            &nbsp;<strong>logic traps</strong>—often humorous yet deceptive statements common in English-speaking contexts.*/}
                {/*            Moreover, no systematic survey has been conducted to assess how well LLMs navigate such reasoning challenges.*/}
                {/*        </p>*/}
                {/*        <p>*/}
                {/*            To fill this gap, <strong>SocratesEval</strong> introduces a benchmark with <strong>clear logical error labels</strong>,*/}
                {/*            evaluating LLMs on two key tasks: (1) determining whether a given statement contains a logical error, and */}
                {/*            (2) classifying the type of fallacy. We introduce <strong>structured scoring</strong> to assess fallacy */}
                {/*            identification and overall reasoning quality, providing a detailed evaluation of LLM performance.*/}
                {/*        </p>*/}
                {/*        <p>*/}
                {/*            Our results offer the first comparative analysis of LLMs’ ability to handle logic traps, shedding light on */}
                {/*            their reasoning limitations and potential.*/}
                {/*        </p>*/}
                {/*    </Col>*/}
                {/*    <Col span={2}></Col>*/}
                {/*    <Col span={11}>*/}
                {/*        <Divider orientation="left">Metrics</Divider>*/}
                {/*        <p>*/}
                {/*        <strong>False Positive (FP)</strong> occurs when a logically correct sentence is misclassified as a logical fallacy, */}
                {/*            while <strong>False Negative (FN)</strong> means a logical fallacy is mistakenly labeled as correct.*/}
                {/*        </p>*/}
                {/*        <p>*/}
                {/*        <strong>F1 Score</strong> evaluates the model’s ability to distinguish logical errors, balancing precision and recall.*/}
                {/*        </p>*/}
                {/*        <p>*/}
                {/*        <strong>Fallacy Labelling Score</strong> measures how accurately the model classifies sentences into human-annotated and */}
                {/*            verified logical fallacy categories.*/}
                {/*        </p>*/}
                {/*        <p>*/}
                {/*        <strong>Explanation Score</strong> assesses how well the model's interpretation of logical errors aligns with human reasoning.*/}
                {/*        </p>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                <Divider orientation="center">
                                <span style={{ fontWeight: 600, fontSize: '22px', letterSpacing: '2px' }}>
                                    Peek into Our Dataset
                                </span>
                </Divider>
                <Row>
                    <Col span={24} style={{ textAlign: "center"}}>
                        <Button type="primary" size="large" onClick={changeRandomData}>
                            Click me!
                        </Button>
                    </Col>
                </Row>
                <Row style={{marginTop: "20px", background: "#EFF2F5", padding: "20px"}}>
                    <Col span={6}></Col>
                    <Col span={12}>
                        <Card title="" variant="borderless">
                            <p>{randomData.question}</p>
                            <FallacyLabelList fallacy_label_list={randomData.fallacies}/>
                        </Card>
                    </Col>
                    <Col span={6}></Col>
                </Row>
            </div>
        // </section>
);
}
