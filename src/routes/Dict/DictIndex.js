
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Tabs, Input } from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { handleFormReset, handleSearch, toggleForm, renderSimpleForm, renderAdvancedForm, renderForm } from '../Wave/DemandSearchFilter';
const { TabPane } = Tabs;
import DictColour from './DictColour'
import DictSptype from './DictSptype'
import DitSeason from './DitSeason'

import styles from './Dict.less';


export default class DictIndex extends PureComponent {
    render() {

        return (
            <PageHeaderLayout title="补货参数维护">
                <Card bordered={false}>
                    <Row>
                        <Tabs size="large">
                            <TabPane tab="颜色表" key="1">
                                <DictColour />
                            </TabPane>
                            <TabPane tab="商品类型表" key="2">
                                <DictSptype />
                            </TabPane>
                            <TabPane tab="季节表" key="3">
                                <DitSeason />
                            </TabPane>
                            <TabPane tab="尺码占比表" key="4">
                            </TabPane>
                            <TabPane tab="分店登记表" key="5">
                            </TabPane>
                        </Tabs>
                    </Row>
                </Card>
            </PageHeaderLayout>
        );
    }
}

