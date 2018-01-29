import { Table, Input, Row, Col, Select, Form, Button, Modal, Tree, Popconfirm, Divider } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { handleFormReset, handleSearch } from '../Wave/DemandSearchFilter';
import { getTreeByLevel, returnTreeNodes, formItemLayout } from '../../utils/ajust';
const FormItem = Form.Item;
import styles from './Dict.less'
import DemandClass from '../Wave/Demand.less'
import { TreeChosen } from './DictColour'
const TreeNode = Tree.TreeNode;
const { Option } = Select
const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);

@connect(({ dictSeason, loading, sysparames }) => ({
    dictSeason,
    sysparames,
    defaultType:dictSeason.defaultType,
    loading: loading.models.dictSeason,
}))
@Form.create()
export default class dictSeason extends PureComponent {
    constructor(props) {
        super(props);
        this.columns = [
        //     {
        //     title: '序号',
        //     dataIndex: 'ID',
        // }, 
        {
            title: '风格',
            dataIndex: 'fgText',
        }, {
            title: '品类',
            dataIndex: 'plText',
        }, {
            title: '季节',
            dataIndex: 'seasonname',
        }, {
            title: '款基准数量',
            dataIndex: 'baseqty',
        }, {
            title: '操作',
            dataIndex: 'fgid',
            render: (text, record) => {
                return (
                    <div className="editable-row-operations">
                        <Popconfirm  title="你确定要删除么？" onConfirm={() => this.deleteRow(record.ID)} okText="是的" cancelText="不是">
                            <a href="#">删除</a>
                        </Popconfirm>
                        <Divider type="vertical" />
                        <a onClick={() => this.editRow(record)} >编辑</a>
                    </div>
                );
            },
        }];
    }
    editRow = (item) => {
        this.props.dispatch({
            type: 'dictSeason/edit',
            payload: item,
        })
    }
    deleteRow = (key) => {
        this.props.dispatch({
            type: 'dictSeason/deleteRow',
            payload: {
                id:key
            },
        })
    }
    handleSearch = handleSearch.bind(this);
    handleFormReset = handleFormReset.bind(this);
    handleAdd = () => {
        this.props.dispatch({
            type: 'dictSeason/edit',
            payload: {},
        })
    }
    componentDidMount(){
        this.props.dispatch({
            type: 'dictSeason/fetch',
        })
    }
    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        const {
          sysparames: {
            band,
            category,
            season,
          },
        } = this.props;
        const realCategory = getTreeByLevel(category, 3);

        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row
                    gutter={{
                        md: 8,
                        lg: 24,
                        xl: 48,
                    }}
                >
                    <Col md={8} sm={24}>
                        <FormItem label="品类" style={{ width: '100%' }}>
                            {getFieldDecorator('pl')(
                                <Select
                                    optionFilterProp="children"
                                    mode="multiple"
                                    placeholder="请选择"
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    {realCategory.map(item => <Option key={item.categoryid} value={item.categoryid}>{item.categoryname}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="季节" style={{ width: '100%' }}>
                            {getFieldDecorator('seasonid')(
                                <Select
                                    optionFilterProp="children"
                                    placeholder="请选择"
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    {season.map(item => <Option key={item.ID} value={item.dtvalue}>{item.dtname}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <span>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button
                                style={{
                                    marginLeft: 8,
                                }}
                                onClick={this.handleFormReset}
                            >重置
                  </Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        let { dictSeason: { data: { list } }, loading } = this.props;
        return (
            <Row>
                <Col xs={24} className={styles.cols}>
                    <div className={DemandClass.tableListForm}>
                        {this.renderSimpleForm()}
                    </div>
                    <Col xs={24} className={styles.cols}>
                        <Button icon="plus" type="primary" onClick={this.handleAdd} style={{ marginRight: 8 }}>
                            新增
                        </Button>
                        <Button icon="export" type="nomal">
                            导入
                        </Button>
                    </Col>
                </Col>
                <Col xs={24} className={styles.cols}>
                    <Table loading={loading} bordered dataSource={list} columns={this.columns} />
                </Col>
                <DictSeasonForm />
            </Row>
        )
    }
}



@connect(({ dictSeason, sysparames, loading }) => ({
    item: dictSeason.item.data,
    modal: dictSeason.item.modal,
    sysparames,
    submitting: loading.effects['dictSeason/editRow'],
}))
@Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        let {
            ID, fgid, plid, seasonid, seasonname, baseqty
        } = props.item;
        return {
            ID: Form.createFormField({ value: ID }),
            fgid: Form.createFormField({ value: fgid }),
            plid: Form.createFormField({ value: plid }),
            seasonid: Form.createFormField({ value: seasonid }),
            seasonname: Form.createFormField({ value: seasonname }),
            baseqty: Form.createFormField({ value: baseqty }),
        };
    },
})
class DictSeasonForm extends PureComponent {
    state = {

    };
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    handleTree = (flag) => {
        this.setState({
            modal: !!flag,
        });
    }
    componentWillReceiveProps(nextprops) {
        if (nextprops.item != this.props.item) {
            const { fgText, plText } = nextprops.item;
            // this.state.fgid = fgid;
            // this.state.plid = plid;
            // this.state.xlid = xlid;
            this.setState({
                xlbtn: fgText,
                pl: plText,
            });
        }
    }
    handleTreeData = (datas) => {
        this.setState({
            xlbtn: datas[2].categoryname,
            pl: datas[1].categoryname,
        });
        const { setFieldsValue, getFieldValue } = this.props.form;
        setFieldsValue({ fgid: datas[1].categoryid });
        setFieldsValue({ plid: datas[2].categoryid });
    }
    seasonnameChange = ( datas ) => {
        const { sysparames: { category, season } } = this.props;
        const color = season.filter(item=>item.dtvalue==datas)
        const { setFieldsValue, getFieldValue } = this.props.form;
        setFieldsValue({ seasonname: color[0].dtname });
    }
    render() {
        const { xlbtn, pl, fg, modal } = this.state;
        const { form, dispatch, submitting, item: { data }, sysparames: { category, season } } = this.props;
        const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
        const validate = () => {
            validateFieldsAndScroll((error, values) => {
                if (!error) {
                    this.props.dispatch({
                        type: 'dictSeason/editRow',
                        payload: values,
                    });
                }
            });
        };
        return (
            <Modal
                title="编辑颜色参数数据"
                width={768}
                footer={null}
                visible={this.props.modal}
                // onOk={this.props.dispatch({type:'closeEdit'})}
                onCancel={() => this.props.dispatch({ type: 'dictSeason/closeEdit' })}
            >
                <Form hideRequiredMark>
                    <Form.Item style={{ display: 'none' }} label="品类id">
                        {getFieldDecorator('ID', {
                        })(
                            <Input disabled placeholder="" />
                            )}
                    </Form.Item>
                    <Form.Item style={{ display: 'none' }} label="品类id">
                        {getFieldDecorator('plid', {
                        })(
                            <Input disabled placeholder="" />
                            )}
                    </Form.Item>
                    <Form.Item style={{ display: 'none' }} label="风格id">
                        {getFieldDecorator('fgid', {
                        })(
                            <Input disabled placeholder="" />
                            )}
                    </Form.Item>
                    <Form.Item style={{ display: 'none' }} label="风格id">
                        {getFieldDecorator('seasonname', {
                        })(
                            <Input disabled placeholder="" />
                            )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="风格">
                        <Button style={{ width: '100%', textAlign: 'left' }} type="nomal" onClick={this.handleTree}>
                            {!xlbtn ? '请点击选择树节点' : xlbtn}
                        </Button>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="品类">
                        <Input disabled value={pl} placeholder="风格" />
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="季节">
                        {getFieldDecorator('seasonid', {
                            rules: [{ required: true, message: '请选择季节' }],
                        })(
                            <Select
                                optionFilterProp="children"
                                placeholder="请选择"
                                onChange={this.seasonnameChange}
                                style={{
                                    width: '100%',
                                }}
                            >
                                {season.map(item => <Option key={item.ID} value={item.dtvalue}>{item.dtname}</Option>)}
                            </Select>
                            )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="款基准数量">
                        {getFieldDecorator('baseqty', {
                            rules: [{ required: true, message: '请正确输入款基准数量' }],
                        })(
                            <Input type="number" placeholder="请输入款基准数量'" />
                            )}
                    </Form.Item>
                    <Row className="xw-tx-center">
                        <Button type="primary" onClick={validate} loading={submitting}>
                            保存
                        </Button>
                    </Row>
                    <TreeChosen category={category} modal={this.state.modal} handleTreeData={this.handleTreeData} handelCancel={this.handleTree} />
                </Form>
            </Modal>
        );
    }
}

