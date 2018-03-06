import React, { PureComponent } from 'react';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message } from 'antd';
import { handleFormReset, handleSearch, toggleForm, renderSimpleForm, shouhuoadvancedForm, renderShouhuoForm } from '../Wave/DemandSearchFilter';
import styles from '../Wave/Demand.less';


@connect(({ sampleWerewr, loading, user, sysparames }) => ({
    sampleWerewr,
    sysparames,
    // user,
    defaultType: sampleWerewr.defaultType,
    loading: loading.models.sampleApply,
}))
@Form.create()
export default class Demand extends PureComponent {
    state = {
    };

    handleFormReset = handleFormReset.bind(this);
    handleSearch = handleSearch.bind(this);
    toggleForm = toggleForm.bind(this);
    renderSimpleForm = renderSimpleForm.bind(this);
    shouhuoadvancedForm = shouhuoadvancedForm.bind(this);
    renderForm = renderShouhuoForm.bind(this);
    
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'sampleApply/fetch',
            payload: {
                start: 0,
                length: 9,
            },
        });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            start: pagination.current - 1,
            length: pagination.pageSize,
            ...formValues,
            ...filters,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }

        dispatch({
            type: 'sampleApply/fetch',
            payload: params,
        });
    }

    render() {
        const { sampleApply: { data: { list } }, user, loading } = this.props;
    
        return (
            <PageHeaderLayout title="样衣初选收货">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                            <Checkbox onChange={this.handleChange} >全选</Checkbox>
                            <Button onClick={() => this.handleModalVisible(true)} type="primary" >
                                批量收货
                            </Button>
                        </div>
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}