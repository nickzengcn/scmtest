import { List, message, Avatar, Spin, Card, Icon, Checkbox, Row, Col, Modal } from 'antd';

const { Meta } = Card;
// import reqwest from 'reqwest';
import fetch from 'dva/fetch';
import React, { PureComponent } from 'react';
import style from '../style.less';
import InfiniteScroll from 'react-infinite-scroller';
import { LazyLoadImg, getJudge } from '../../../utils/ajust';
import { connect } from 'dva';



@connect()
class Cards extends PureComponent {
    handleClick = () => {
        this.props.handleData();
    }
    handleLike = () => {
        const { data } = this.props;
        this.props.dispatch({
            type:'sampleWerewre/audit',
            payload:{
                type:'Like',
                data:{
                    sampleId:data.SampleId
                },
            }
        })
    }
    handleDislike = () => {
        const { data } = this.props;
        this.props.dispatch({
            type:'sampleWerewre/audit',
            payload:{
                type:'UnLike',
                data:{
                    sampleId:data.SampleId
                },
            }
        })    
    }
    render() {
        const { data } = this.props;
        return (
            <Col sm={12} lg={8} xl={6} xxl={4}>
                <Card
                    hoverable
                    className={style.main2}
                    
                    // style={{ width: 300 }}
                    title={"编号：" + data.SampleId}
                    cover={<LazyLoadImg onClick={this.handleClick}/>}
                    actions={[<Dislike onClick={this.handleDislike} data={data.UnLike}/>, <Like onClick={this.handleLike} data={data.Like}/>]}

                >
                    {/* <Meta
                title={<Title data={data} />}
            /> */}
                </Card>
            </Col>
        );
    }
}

const Dislike = props =>
    (
        <span {...props} >
            <Icon style={{ fontSize: 20 }} type="dislike" />
            <span>({props.data})</span>
        </span>
    );

const Like = props =>
    (
        <span {...props} >
            <Icon style={{ fontSize: 20 }}type="heart" />
            <span>({props.data})</span>
        </span>
    );

export default class InfiniteList extends React.Component {
    state = {
        loading: false,
        hasMore: true,
        modal: false,
        modalData: {},
    }
    handleOpenModal = item => () => {
        this.setState({
            modal: true,
            modalData:item,
        });
    }
    handleCheck = (item, index) => (e) => {
        this.props.funs.Check({
            item, index
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
                        {data.map((item, index) => <Cards handleCheck={this.handleCheck(item, index)} handleData={this.handleOpenModal(item)} key={index} data={item} />)}
                    </Row>

                    {loading && hasMore && <Spin className="demo-loading" />}
                </InfiniteScroll>
                <PicLeftRight handleCloseModal={this.handleCloseModal} modal={modal} pics={modalData}/>
            </div>
        );
    }
}

class PicLeftRight extends PureComponent{
    state = {
        pics:[],
        now : 0
    }

    componentWillReceiveProps(nextProps){
        const { pics } = nextProps;
        const { ImagePath1, ImagePath2, ImagePath3 } = pics;
        this.setState({
            pics:[ImagePath1, ImagePath2, ImagePath3],
            now:0,
        })
    }
    handleLeft = ()=>{
        let { pics,now } = this.state;
        if(now == 0){
            now = 2;
        }else {
            now--;
        }
        this.setState({
            now:now,
        });
    }
    handleRight = ()=>{
        let { pics } = this.state;
        const length = pics.length;
        if(now == length){
            now = 0
        }else {
            now++;
        }
        this.setState({
            now:now,
        });
    }
    render(){
        const { modal } = this.props;
        let { pics,now } = this.state;
        console.log(pics)

        const currentPic = pics[now];
        return (
            <Modal
                className={style.PicWall}
                title={null}
                footer={null}
                width={"80%"}
                visible={modal}
                onCancel={() => this.props.handleCloseModal()}
            >
                <Row>
                    <Col sm={2} md={1} className={style.butleft}>
                        <Icon type="left-circle-o" />
                    </Col>
                    <Col sm={20}  md={22}   className={style.center}>
                        <LazyLoadImg src = {currentPic}/>
                    </Col>
                    <Col sm={2}  md={1}  className={style.butright}>
                        <Icon type="right-circle-o" />
                    </Col>
                </Row>
            </Modal>
        )
    }
}