import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  InputNumber,
  DatePicker,
} from 'antd';
import React, { PureComponent } from 'react';

const { Option } = Select;

const FormItem = Form.Item;
import { getTreeByLevel } from '../../utils/ajust';
import styles from './Demand.less';

export function handleFormReset() {
  const { form, dispatch, defaultType } = this.props;
  form.resetFields();
  this.setState({ formValues: {} });
  dispatch({ type: defaultType});
}

export function toggleForm() {
  this.setState({
    expandForm: !this.state.expandForm,
  });
}

export function handleSearch(e) {
  e.preventDefault();

  const { dispatch, form, data, defaultType } = this.props;
  console.log(defaultType);
  form.validateFields((err, fieldsValue) => {
    if (err) { return; }

    const values = {
      ...fieldsValue,
    };
    const realValue = {};
    Object
      .keys(values)
      .forEach((item) => {
        if (values[item]) {
          realValue[item] = values[item];
        }
      });
    console.log(realValue);
    this.setState({ formValues: realValue });

    dispatch({
      type: defaultType,
      payload: {
        ...realValue,
        start: 0,
        length: 9,
      },
    });
  });
}

export function renderSimpleForm() {
  const { getFieldDecorator } = this.props.form;
  const {
    sysparames: {
      band,
      category,
    },
  } = this.props;
  const realCategory = getTreeByLevel(category, 2);

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
          <FormItem label="波段(多选)">
            {getFieldDecorator('brand')(
              <Select
                optionFilterProp="children"
                mode="multiple"
                placeholder="请选择"
                style={{
                                width: '100%',
                            }}
              >
                {band.map(item => <Option key={item.Key} value={item.Key}>{item.Value}</Option>)}
              </Select>
                        )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem label="风格(多选)">
            {getFieldDecorator('fgid')(
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
          <span className={styles.submitButtons}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button
              style={{
                            marginLeft: 8,
                        }}
              onClick={this.handleFormReset}
            >重置
            </Button>
            <a
              style={{
                            marginLeft: 8,
                        }}
              onClick={this.toggleForm}
            >
                            展开
              <Icon type="down" />
            </a>
          </span>
        </Col>
      </Row>
    </Form>
  );
}

export function renderAdvancedForm() {
  const { getFieldDecorator } = this.props.form;
  const {
    sysparames: {
      band,
      category,
      bandYear,
    },
  } = this.props;
  const realCategory = getTreeByLevel(category, 2);
  const littleCategory = getTreeByLevel(category, 4);

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
          <FormItem label="波段(多选)">
            {getFieldDecorator('brand')(
              <Select
                optionFilterProp="children"
                mode="multiple"
                placeholder="请选择"
                style={{
                                width: '100%',
                            }}
              >
                {band.map(item => <Option value={item.Key} key={item.Key}>{item.Value}</Option>)}
              </Select>
                        )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem label="风格(多选)">
            {getFieldDecorator('fgid')(
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
          <FormItem label="小小类(多选)">
            {getFieldDecorator('xlid')(
              <Select
                optionFilterProp="children"
                mode="multiple"
                placeholder="请选择"
                style={{
                                width: '100%',
                            }}
              >
                {littleCategory.map(item => <Option key={item.categoryid} value={item.categoryid}>{item.categoryname}</Option>)}
              </Select>
                        )}
          </FormItem>
        </Col>
      </Row>
      <div style={{
                overflow: 'hidden',
            }}
      >
        <span
          style={{
                    float: 'right',
                    marginBottom: 24,
                }}
        >
          <Button type="primary" htmlType="submit">查询</Button>
          <Button
            style={{
                        marginLeft: 8,
                    }}
            onClick={this.handleFormReset}
          >重置
          </Button>
          <a
            style={{
                        marginLeft: 8,
                    }}
            onClick={this.toggleForm}
          >
                        收起
            <Icon type="up" />
          </a>
        </span>
      </div>
    </Form>
  );
}

export function renderForm() {
  return this.state.expandForm
    ? this.renderAdvancedForm()
    : this.renderSimpleForm();
}

export function renderSampleForm(){
    return this.state.expandForm
    ? this.sampleAdvancedForm()
    : this.renderSimpleForm();
}

export function sampleAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    const {
      sysparames: {
        band,
        category,
        bandYear,
        vender,
      },
    } = this.props;
    const realCategory = getTreeByLevel(category, 2);
    const littleCategory = getTreeByLevel(category, 4);
  
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
            <FormItem label="波段(多选)">
              {getFieldDecorator('brand')(
                <Select
                  optionFilterProp="children"
                  mode="multiple"
                  placeholder="请选择"
                  style={{
                                  width: '100%',
                              }}
                >
                  {band.map(item => <Option value={item.Key} key={item.Key}>{item.Value}</Option>)}
                </Select>
                          )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="风格(多选)">
              {getFieldDecorator('fgid')(
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
            <FormItem label="小小类(多选)">
              {getFieldDecorator('xlid')(
                <Select
                  optionFilterProp="children"
                  mode="multiple"
                  placeholder="请选择"
                  style={{
                                  width: '100%',
                              }}
                >
                  {littleCategory.map(item => <Option key={item.categoryid} value={item.categoryid}>{item.categoryname}</Option>)}
                </Select>
                          )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
          <FormItem label="供应商(多选)">
            {getFieldDecorator('xlid')(
              <Select
                optionFilterProp="children"
                mode="multiple"
                placeholder="请选择"
                style={{
                                width: '100%',
                            }}
              >
                {vender.map(item => <Option key={item.Key} value={item.Key}>{item.Value}</Option>)}
              </Select>
                        )}
          </FormItem>
        </Col>
        </Row>
        <div style={{
                  overflow: 'hidden',
              }}
        >
          <span
            style={{
                      float: 'right',
                      marginBottom: 24,
                  }}
          >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button
              style={{
                          marginLeft: 8,
                      }}
              onClick={this.handleFormReset}
            >重置
            </Button>
            <a
              style={{
                          marginLeft: 8,
                      }}
              onClick={this.toggleForm}
            >
                          收起
              <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }