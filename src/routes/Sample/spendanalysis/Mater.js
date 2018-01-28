import { Table, Input, Popconfirm, Row, Button } from 'antd';
import React, { PureComponent } from 'react';
import { getColumns, getWidthSum } from '../../../utils/ajust';
import styles from './SpendAnalysis.less'
const data = [];
// for (let i = 0; i < 100; i++) {
//   data.push({
//     key: i.toString(),
//     name: `Edrward ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`,
//   });
// }

const EditableCell = ({ editable, value, onChange, ischeck }) => (
    <div className={ischeck&&!value?styles.error:''}>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);

export default class EditableTable extends PureComponent {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '物料名称/编码',
            dataIndex: 'materiel',
            fixed:'left',
            render: (text, record) => this.renderColumns(text, record, 'name'),
        }, {
            title: '幅宽/ 规格',
            dataIndex: 'Width',
            render: (text, record) => this.renderColumns(text, record, 'age'),
        }, {
            title: '单位',
            dataIndex: 'unit',
            render: (text, record) => this.renderColumns(text, record, 'address'),
        }, {
            title: '单件用量',
            dataIndex: 'uqty',
            render: (text, record) => this.renderColumns(text, record, 'address'),
        }, {
            title: '损耗率',
            dataIndex: 'lossrate',
            render: (text, record) => this.renderColumns(text, record, 'address'),
        }, {
            title: '预计总用量',
            dataIndex: 'amount',
            render: (text, record) => this.renderColumns(text, record, 'address'),
        }, {
            title: '单价',
            dataIndex: 'price',
            render: (text, record) => this.renderColumns(text, record, 'address'),
        }, {
            title: '供应商报价金额',
            dataIndex: 'offervalue',
            fixed:'right',
            render: (text, record) => this.renderColumns(text, record, 'address'),
        }, {
            title: '惠购审核差异金额',
            dataIndex: 'address',
            fixed:'right',
            render: (text, record) => this.renderColumns(text, record, 'address'),
        }, {
            title: '操作',
            dataIndex: 'operation',
            fixed:'right',
            render: (text, record) => {
                const { editable } = record;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                                    <a onClick={() => this.save(record.key)}>保存</a>
                                </span>
                                : <span>
                                    <a onClick={() => this.deleteRow(record.key)}>删除</a>
                                </span>
                        }
                    </div>
                );
            },
        }];
        this.state = { data,isEdit: false };
        this.cacheData = data.map(item => ({ ...item }));
    }
    renderColumns(text, record, column) {
        return (
            <EditableCell
                editable={record.editable}
                value={text}
                ischeck={record.ischeck}
                onChange={value => this.handleChange(value, record.key, column)}
            />
        );
    }
    handleChange(value, key, column) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({ data: newData });
        }
    }
    edit(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.editable = true;
            this.setState({ data: newData });
        }
    }
    delete(key) {
        // const newData = [...this.state.data];
        // const target = newData.filter(item => key === item.key)[0];
        // if (target) {
        //     target.editable = true;
        //     this.setState({ data: newData });
        // }
    }
    save(key) {

        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            delete target.editable;
            this.setState({ data: newData });
            this.cacheData = newData.map(item => ({ ...item }));
        }
    }
    cancel(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
            delete target.editable;
            this.setState({ data: newData });
        }
    }
    newRow = () => {
        let { isEdit } = this.state;
        if(isEdit){
            return;
        }
        let newData = [...this.state.data];
        newData.push({ id: new Date().getTime(), editable: true });
        this.setState({ data: newData ,isEdit: true});
    }
    render() {
        const columns = getColumns(this.columns);
        const { isEdit } = this.state;
        const width = getWidthSum(columns);
        return (
            <Row>
                <Row>
                    <Button disabled={isEdit} type="primary" onClick={this.newRow} style={{ marginBottom: 12 }}>添加</Button>
                </Row>
                <Row>
                    <Table scroll={{ x: width }} bordered rowKey="id" pagination={false} dataSource={this.state.data} columns={columns} />
                </Row>
            </Row>
        );
    }
}
