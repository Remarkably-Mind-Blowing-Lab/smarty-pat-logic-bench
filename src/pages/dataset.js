import React from 'react';
import {Divider, Row, List, Tag, Typography} from 'antd';
import Layout from '@theme/Layout';

import fallacyList from '@site/static/data/fallacies.json';
import labelList from '@site/static/data/label500.json';
import {ResponsivePie} from "@nivo/pie";

const COLORS = ['red', 'volcano', 'orange', 'gold', 'yellow', 'lime',
    'green', 'cyan', 'blue', 'geekblue', 'purple', 'magenta']
const hashString = (string) => string.split('').map((char) => char.charCodeAt(0)).reduce((a, b) => a + b, 0)
const stringToColor = (string) => COLORS[hashString(string) % COLORS.length];

function getPieChartData(data) {
    // Object to store counts for each fallacy (in lowercase)
    const counts = {};

    // Iterate over each item in the data array
    data.forEach(item => {
        // Check if fallacies is an array
        if (Array.isArray(item.fallacies)) {
            item.fallacies.forEach(fallacy => {
                // Convert to lowercase to ignore case
                const key = fallacy.toLowerCase();
                // Increment the count or initialize it
                counts[key] = (counts[key] || 0) + 1;
            });
        }
    });

    // Convert the counts object into an array of desired objects
    const result = Object.keys(counts).map(key => ({
        id: key,
        label: key,
        value: counts[key]
    })).sort((a, b) => b.value - a.value);

    return result;
}

const Dataset = () => {
    const pieData = getPieChartData(labelList);

    console.log(pieData);

    const MyResponsivePie = ({ pieData }) => (
        <ResponsivePie
            data={pieData}
            wideth={300}
            height={300}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.2
                    ]
                ]
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        2
                    ]
                ]
            }}
        />
    );

    return (
        <Layout
            title={`Publication`}
            description="">
            <main>
                <div className="container" style={{padding: "16px", marginBottom: "16px"}}>
                    <Row>
                        <Divider orientation="left">Logic Fallacies</Divider>
                        <p>There is no universally agreed-upon classification of logical fallacies,
                            and many existing categorizations contain overlapping concepts.
                            After reviewing relevant literature and prior studies,
                            we have identified the following {fallacyList.length} types of logical fallacies for labelling our data.</p>
                        <List
                            bordered
                            size={"small"}
                            dataSource={fallacyList}
                            renderItem={(item) => (
                                <List.Item>
                                    <Tag bordered={false} color={stringToColor(item.name)}>{item.name}</Tag> {item.description}
                                </List.Item>
                            )}
                        />
                    </Row>
                    <Row style={{marginTop: "16px"}}>
                        <p>The distribution of fallacies in the shitty-advice dataset is: </p>
                    </Row>
                    <Row style={{marginTop: "16px"}}>
                        <div style={{height: "500px", width: "500px"}}>
                            <MyResponsivePie pieData={pieData}/>
                        </div>
                    </Row>
                </div>
            </main>
        </Layout>
    );
};
export default Dataset;