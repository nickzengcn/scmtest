import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Checkbox, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message } from 'antd';
import SamplyApply from '../../components/SCMTable/SamplyApply';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ApplyForm from './ApplyForm';
import InfiniteScroller from './erwerwe/Infinite';
import { handleFormReset, handleSearch, toggleForm, renderSimpleForm, sampleAdvancedForm, renderSampleForm } from '../Wave/DemandSearchFilter';
const { TextArea } = Input;


import styles from '../Wave/Demand.less';

const confirm = Modal.confirm;

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ firstJudge, loading, sysparames }) => ({
    firstJudge,
    sysparames,
    defaultType: firstJudge.defaultType,
    loading: loading.models.firstJudge,
}))
@Form.create()
export default class Demand extends PureComponent {
    state = {
        addInputValue: '',
        modalVisible: false,
        queryVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        item: {},
        mask: '',
        editItem: {},
    };

    handleFormReset = handleFormReset.bind(this);
    handleSearch = handleSearch.bind(this);
    toggleForm = toggleForm.bind(this);
    renderSimpleForm = renderSimpleForm.bind(this);
    sampleAdvancedForm = sampleAdvancedForm.bind(this);
    renderForm = renderSampleForm.bind(this);

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'firstJudge/fetch',
            payload: {
                start: 0,
                length: 9,
            },
        });
    }
    handleAudit = (item)=> {
        const { dispatch } = this.props;
        dispatch({
            type: 'firstJudge/setItem',
            payload: item,
        });
    }
    render() {
        const { firstJudge: { data: { list } }, loading } = this.props;
        const { selectedRows, modalVisible, addInputValue, queryVisible, editItem } = this.state;
        const funs = {
            Audit:this.handleAudit
        };

        return (
            <PageHeaderLayout title="样衣一审打分">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <InfiniteScroller funs={funs} data={list} loading={loading} />
                    </div>
                </Card>
                
            </PageHeaderLayout>
        );
    }
}

