import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, Checkbox, Modal, message } from 'antd';
import SamplyApply from '../../components/SCMTable/SamplyApply';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ApplyForm from './ApplyForm';
import ApplyDetail from './ApplyDetail';
import InfiniteScroller from './werewre/Infinite';
const { TextArea } = Input;
// import cloneDeep  from 'lodash/cloneDeep';
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
        category:[],
    };
    

    componentDidMount() {
        const { sysparames: { sysCategory} } = this.props;
        const category = sysCategory.filter(item=>item.deptlevelid==2)
        this.setState({
            category
        },this.fetchData)
    }
    fetchData = ()=>{
        const { dispatch } = this.props;
        const { category } = this.state;
        dispatch({
            type: 'sampleWerewre/fetch',
            payload: {
                start: 0,
                length: 9,
            },
        });
    }
    componentWillReceiveProps(next){
        const { sysparames: { sysCategory} } = this.props;
        if(sysCategory.length!=next.sysparames.sysCategory.length){
            this.setState({
                category:next.sysparames.sysCategory
            })
        }
    }

    categoryChange = (index) => (e) => {
        let { category } = this.state;
        category[index].checked = e.target.checked;
        // category[index] = Object.assign({},category[index]);
        // const checklist = category.filter(item=>item.checked);
        let newdata = [];
        category.forEach(element => {
            newdata.push(element)
        });
        this.setState({
            category:newdata
            // checkAll: checklist.length === category.length,
        });
      }
    onCheckAllChange = (e) => {
        let checkAll = e.target.checked;
        let { category } = this.state;
        for (const key in category) {
            if (category.hasOwnProperty(key)) {
                const element = category[key];
                element.checked = e.target.checked
            }
        }
        this.setState({
          category,
          checkAll,
        });
    }

    render() {
        const { sampleWerewre: { data: { list } }, user, loading } = this.props;
        const { selectedRows, modalVisible, addInputValue, queryVisible, category } = this.state;
        
        const plainOptions = ['连衣裙', '套裤', '单裙'];
        const defaultCheckedList = ['连衣裙', '套裤'];

        return (
            <PageHeaderLayout title="样衣海选">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            <Checkbox
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                            >
                                全选
                            </Checkbox>

                            {category.map((item,index)=>{
                                return (
                                    <Checkbox
                                        key = {item.categoryid}
                                        onChange={this.categoryChange(index)}
                                        checked={item.checked}
                                    >
                                        {item.categoryname}
                                    </Checkbox>
                                )
                            })}
                            <Button type="primary" onClick={this.fetchData} style={{marginLeft:20,marginTop:10}}> 查询 </Button>
                            {/* <Button style={{marginLeft:20}}> 重置 </Button> */}
                        </div>
                        <InfiniteScroller user={user}  data={list} loading={loading} />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}






