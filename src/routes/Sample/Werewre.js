import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, Checkbox, Modal, message } from 'antd';
import SamplyApply from '../../components/SCMTable/SamplyApply';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ApplyForm from './ApplyForm';
import ApplyDetail from './ApplyDetail';
import InfiniteScroller from './werewre/Infinite';
const { TextArea } = Input;
// import { handleFormReset, handleSearch } from '../Wave/DemandSearchFilter';


import styles from '../Wave/Demand.less';

const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ sampleWerewre, loading, user, sysparames }) => ({
    sampleWerewre,
    sysparames,
    user,
    loading: loading.models.werewre,
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
        checkedList: ['连衣裙', '套裤'],
        indeterminate: true,
        checkAll: false,
        
    };
    

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'sampleWerewre/fetch',
            payload: {
                start: 0,
                length: 9,
            },
        });
    }
    renderSimpleForm() {
        
        
    }

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    }

    handleQueryVisible = (flag) => {
        this.setState({
            queryVisible: !!flag,
        });
    }

    handleAddInput = (e) => {
        this.setState({
            addInputValue: e.target.value,
        });
    }
    handleTxt = (e) => {
        this.setState({
            mask: e.target.value,
        });
    }
    onChange = (checkedList) => {
        this.setState({
          checkedList,
          indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
          checkAll: checkedList.length === plainOptions.length,
        });
      }
      onCheckAllChange = (e) => {
        this.setState({
          checkedList: e.target.checked ? plainOptions : [],
          indeterminate: false,
          checkAll: e.target.checked,
        });
    }

    render() {
        const { sampleWerewre: { data: { list } }, user, loading } = this.props;
        const { selectedRows, modalVisible, addInputValue, queryVisible, editItem } = this.state;
        const plainOptions = ['连衣裙', '套裤', '单裙'];
        const defaultCheckedList = ['连衣裙', '套裤'];

        return (
            <PageHeaderLayout title="样衣海选">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            <Checkbox
                                indeterminate={this.state.indeterminate}
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                            >
                                全选
                            </Checkbox>
                            <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
                            <Button type="primary" style={{marginLeft:20}}> 查询 </Button>
                            <Button style={{marginLeft:20}}> 重置 </Button>
                        </div>
                        <InfiniteScroller user={user}  data={list} loading={loading} />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}






