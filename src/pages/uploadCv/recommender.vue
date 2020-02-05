<template>
    <view style="width:100%">
        <view class="content">
            <view class="b-title">请填写你的信息</view>
            <form class="block">
                <text class="title">姓名</text><input class="input" v-model="name" placeholder="请输入" placeholder-style="color:rgba(197,199,201,1);text-align:right;" placeholder-class="placeholderStyle"/>
                <view class="blank"></view>
                <text class="title">公司</text><input class="input" v-model="company" placeholder="请输入" placeholder-style="color:rgba(197,199,201,1);text-align:right;" placeholder-class="placeholderStyle"/>
                <view class="blank"></view>
                <text class="title">职位</text><input class="input" v-model="position" placeholder="请输入" placeholder-style="color:rgba(197,199,201,1);text-align:right;" placeholder-class="placeholderStyle"/>
                <view class="blank"></view>
                <view class="b-title" style="margin-top:81rpx;margin-left:0rpx;">我们会把上传链接发送到你的邮箱</view>
                <input v-model="email" placeholder="请输入你的邮箱" placeholder-style="color:rgba(197,199,201,1);" placeholder-class="placeholderStyle"/>
                <view class="blank"></view>
            </form>
            <view class="bottom-block">
                <button class="btn" @click="handleSubmit"><text class="btn-word">确定</text></button>
            </view>
        </view>
    </view>
</template>

<script>
import ENVIRONMENT_CONFIG from '../../config/envConfig.js'
import {mapState} from 'vuex'
import util from '@/utils/util.js'
export default {
    onLoad(par){
        this.positionId = par.positionId
        uni.request({
            url: ENVIRONMENT_CONFIG.host+'/tr/api/talentRecommend/recommendUserInfo?'+ENVIRONMENT_CONFIG.code,
            method: 'POST',
            header:{
                Authorization: 'Bearer '+this.token
            },
            success: res => {
                console.log(res)
                let realRes = res.data
                if(realRes.code==0){
                    this.name = realRes.data.recommendUserName
                    this.company = realRes.data.recommendUserCompany
                    this.position = realRes.data.recommendUserPosition
                    this.email = realRes.data.recommendUserEmail
                }else{
                    util.show(realRes.message)
                }
            },
            fail: () => {
                util.show('获取推荐信息失败')
            }
        })
    },
    computed: {
        ...mapState(['token'])
    },
    data() {
        return {
            name: '',
            company: '',
            position: '',
            email:'',
            positionId: 0
        }
    },
    methods: {
        handleSubmit(){
            uni.request({
                url: ENVIRONMENT_CONFIG.host+'/tr/api/talentRecommend/beginRecommend?'+ENVIRONMENT_CONFIG.code,
                method: 'POST',
                header:{
                    'Authorization': 'Bearer '+this.token
                },
                data:{
                    recommendUserName: this.name,
                    recommendUserPosition: this.position,
                    recommendUserCompany: this.company,
                    recommendUserEmail: this.email,
                    positionId: this.positionId

                },
                success: res => {
                    let realRes = res.data
                    if(realRes.code==0){
                        uni.redirectTo({
                            url: 'success?email='+this.email
                        });
                    }else{
                        util.show(realRes.message)
                    }
                },
                fail: (e) => {
                    console.log(e)
                }
            })
        },
        onShareAppMessage: function () {
            return{
                title: '推荐简历，兼职赚钱',
                path: '/pages/main/main',
                //imageUrl: '/static/img/share.png'
            }
        }
    }
}
</script>


<style scoped>
.content{
    width: 100%;
    background: rgba(255,255,255,1);
    padding: 0rpx;
}
.block{
    margin-left:40rpx;
    margin-right: 40rpx; 
    height: auto;
}
.b-title{
    width:auto;
    height:34rpx;
    font-size:34rpx;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:500;
    color:rgba(42,39,31,1);
    line-height:51rpx;
    letter-spacing:1rpx;
    margin-left: 40rpx;
    margin-bottom: 95rpx;
    margin-top: 50rpx;
}
.title{
    width:auto;
    height:32rpx;
    font-size:32rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(63,60,53,1);
    line-height:48rpx;
}
.input{
    float: right;
    text-align: right;
}
.placeholderStyle{
    width:auto;
    height:32rpx;
    font-size:32rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    line-height:48rpx;
}
.blank{
    width:100%;
    height:1rpx;
    background:rgba(244,244,244,1);
    margin-top: 40rpx;
    margin-bottom: 40rpx;
}
.bottom-block{
    width:100%;
    height:120rpx;
    background:rgba(255,255,255,1);
    box-shadow:0rpx -1rpx 0rpx 0rpx rgba(0,0,0,0.1);
    position: fixed;
    bottom: 0px;
}
.btn{
    width:auto;
    height:80rpx;
    background:rgba(255,204,54,1);
    box-shadow:0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.1);
    border-radius:4rpx;
    margin-left: 20rpx;
    margin-top: 20rpx;
    margin-right: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}
.btn-word{
    width:auto;
    font-size:30rpx;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:500;
    color:rgba(42,39,31,1);
    line-height:45rpx;
    letter-spacing:1rpx;
}
</style>

