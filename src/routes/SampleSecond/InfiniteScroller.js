import { List, message, Avatar, Spin, Card, Icon, Checkbox, Row, Col } from 'antd';
import { connect } from 'dva';

const { Meta } = Card;
// import reqwest from 'reqwest';
import fetch from 'dva/fetch';
import React, { PureComponent } from 'react';
import style from '../Sample/style.less';
import InfiniteScroll from 'react-infinite-scroller';
import { LazyLoadImg, getJudge } from '../../utils/ajust';


@connect(({ secondJudge, loading }) => ({
    loading: loading.models.secondJudge,
  }))
class Cards extends PureComponent {
    handleClick = () => {
        const { data } = this.props;
        this.props.dispatch({
            type:'secondJudge/setItem',
            payload: data,
        });
    }
    render() {
      const { data } = this.props;
      return (
        <Col sm={12} md={8} lg={6}>
          <Card
            hoverable
            className={style.main}
            cover={<LazyLoadImg onClick={this.handleClick} />}
          >
            <Meta
                title={<Title data={data} />}
            />
          </Card>
        </Col>
      );
    }
}

const Title = props =>
  (
    <Row className="info">
      <Col xs={24}>
        <span className={style.left}>编号:{props.data.Id}</span>
        <span className={style.right}>状态:{getJudge(props.data.status)}</span>
      </Col>
      <Col xs={24}>
        <span className={style.right}>总得分：123</span>
      </Col>
    </Row>
  );

export default class InfiniteList extends React.Component {
    state = {
      loading: false,
      hasMore: true,
      modal: false,
      modalData: {},
    }
    handleOpenModal = item => () => {
      this.props.funs.Audit({
        modal:true,data:item
      })
    }
    handleCheck = (item,index) => (e) => {
      this.props.funs.Check({
        item,index
      })
    }
    handleCloseModal = () => {
      this.setState({
        modal: false,
      });
    }
    
    handleInfiniteOnLoad = () => {
      const data = this.props.data;
      if (data.length > 100) {
        message.warning('Infinite List loaded all');
        this.setState({
          hasMore: false,
        });
      }
    }
    render() {
      const { hasMore, modal, modalData } = this.state;
      const { data, funs, loading, user } = this.props;
      // const data = [1,2,3,4,5,6,7,8,9,10,11,12,14,15,16]
      return (
        <div className="demo-infinite-container">
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={this.handleInfiniteOnLoad}
            hasMore={!this.state.loading && this.state.hasMore}
            useWindow
          >
            <Row gutter={{
                        md: 8,
                        lg: 24,
                        xl: 48,
                        }}
            >
              {data.map((item, index) => <Cards key={index} data={item} />)}
            </Row>
            {loading && hasMore && <Spin className="demo-loading" />}
          </InfiniteScroll>
        </div>
      );
    }
}

