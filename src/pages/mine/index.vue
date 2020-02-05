<template>
    <view class="content" v-if="isLogin!=null">
        <navigator v-if="isLogin===true || (register && authorization)" url="/pages/mine/info" hover-class="other-navigator-hover" class="block">
            <view class="name">{{myName}}</view>
            <view style="height: 32rpx;"><image src="/static/img/next.png" class="img"></image></view>
            <view class="mobile">{{myMobile}}</view>  
        </navigator>
        <view class="block" v-else>
            <view style="width:169rpx;height:40rpx;background:rgba(244,244,244,1);border-radius:30rpx;margin-bottom:30rpx;"></view>
            <view style="width:320rpx;height:30rpx;background:rgba(244,244,244,1);border-radius:20rpx;"></view>
        </view>
        <view class="blank"></view>
        <view v-if="isLogin || (register && authorization)" class="block" style="margin-top:81rpx;">
            <view style="margin-bottom:19rpx;">
                <image src="/static/img/myRecommend.png" style="width:36rpx;height:36rpx;margin-right:20rpx;"></image>
                <text class="tittle">我的推荐</text>
            </view>
            <view>
                <view v-for="(item,index) in recommendList" :key="index">
                    <view style="margin-top: 43rpx;margin-bottom:30rpx;">
                        <text class="name">{{item.cvName}}</text>
                        <text class="date">{{item.createTime}}</text>
                    </view>
                    <view class="company" style="margin-bottom:20rpx;">{{item.companyName}}</view>
                    <view style="margin-bottom:43rpx">
                        <text class="company">{{item.positionName}}</text>
                        <text class="status" v-if="item.state!=10"><text class="word">{{statusList[item.state]}}</text></text>
                        <text class="status" v-else><text class="word">{{statusList[item.state-3]}}</text></text>
                    </view>
                    <view class="blank" style="height:1rpx;"></view>
                </view>
            </view>
            <view v-if="recommendList == undefined || recommendList.length <= 0"> 
                <view style="text-align: center;">
                    <image src="/static/img/Group1.png" style="width:114rpx;height:82rpx;margin-top:200rpx;"></image>
                    <view class="text-no">快去推荐人才吧！</view>
                </view>
            </view>
        </view>
        <view v-else-if="isLogin===false" class="block" >
            <view style="margin-top:100rpx;display: flex;">
                <view class="c-1" v-bind:style="{background: bgcolor1}">
                    <text class="c-word" v-bind:style="{color: color1}">1</text>
                </view>
                <view class="blank" style="height:20rpx;width:35%;margin-top:40rpx"></view>
                <view class="c-2" v-bind:style="{background: bgcolor2}">
                    <text class="c-word" v-bind:style="{color: color2}">2</text>
                </view>
            </view>
            <view style="margin-top:35rpx;">
                <text class="c-label" v-bind:style="{color: wcolor1}">微信登录</text>
                <text class="c-label1" v-bind:style="{color: wcolor2}">手机号授权</text>
            </view>
            <button v-if="!authorization" class="btn-info" open-type="getUserInfo" @getuserinfo="getuserinfo"><text class="btn-word">登录参与推荐</text></button>
            <button v-else-if="!register && authorization" class="btn-info" open-type="getPhoneNumber" @getphonenumber="getphonenumber"><text class="btn-word">手机号授权</text></button>
        </view>
    </view>
</template>

<script>
import ENVIRONMENT_CONFIG from '../../config/envConfig.js'
import {mapState} from 'vuex'
import util from '@/utils/util.js'
export default {
    onShow(par){
        this.getCode()
        if(this.register && this.authorization){
            this.isLogin = true
            if(this.token){
                this.getinfo()
                // 获取推荐的列表
                this.getreList()
            }
        } else {
            this.isLogin = false
        }
    },
    computed:{
        ...mapState(['token','code','infoChange','authorization','register']),
        bgcolor1: function() {
            return this.authorization ? 'rgba(233, 233, 232, 1)' : 'rgba(63, 60, 53, 1)';
        },
        bgcolor2: function() {
            return this.authorization ? 'rgba(63, 60, 53, 1)' : 'rgba(233, 233, 232, 1)';
        },
        color1: function() {
            return this.authorization ? 'rgba(191,190,187,1)' : 'rgba(255,204,54,1)';
        },
        color2: function() {
            return this.authorization ? 'rgba(255,204,54,1)' : 'rgba(191,190,187,1)';
        },
        wcolor1: function() {
            return this.authorization ? 'rgba(127, 125, 121, 1)' : 'rgba(42, 39, 31, 1)';
        },
        wcolor2: function() {
            return this.authorization ? 'rgba(42, 39, 31, 1)' : 'rgba(127, 125, 121, 1)';
        }
    },
    data() {
        return {
            myName: '',
            myMobile: '',
            recommendList: [],
            isLogin: null,
            unionId: 0,
            statusList: ['新投递','初筛','用人部门筛选','面试','沟通offer','等待入职','已入职','淘汰']
        }
    },
    methods: {
        getCode() {
            wx.login({
                success: loginRes => {
                    this.$store.commit('setCode', loginRes.code);
                }
            })
        },
        getuserinfo(e){
            if(e.detail.iv && e.detail.encryptedData){
                uni.showLoading({
                    title: '登录中',
                    mask: true
                })
                uni.request({
                    url: ENVIRONMENT_CONFIG.host+'/tr/web/talentRecommend/login?'+ENVIRONMENT_CONFIG.code,
                    method: 'POST',
                    data: {
                        code: this.code,
                        iv: e.detail.iv,
                        encryptedData: e.detail.encryptedData
                    },
                    success: res => {
                        let realRes = res.data
                        console.log(realRes)
                        if(realRes.code==0){
                            this.$store.commit('setAuthorization', true)
                            this.$store.commit('setUnionId', realRes.data.unionId)
                            uni.setStorage({
                                key: 'unionIdRelation',
                                data: {
                                    unionId: realRes.data.unionId,
                                }
                            })
                            if(realRes.data.token){
                                this.$store.commit('setToken', realRes.data.token)
                                if(realRes.data.mobile){  //已绑定手机号
                                    this.$store.commit('setRegister', true)
                                    uni.setStorage({
                                        key: 'userInfoRelation',
                                        data: {
                                            token: this.token,
                                        }
                                    })
                                    this.getinfo()
                                }else{ //未绑定手机号
                                    this.getCode()
                                }
                            }else{ //未授权
                                this.getCode()
                            }
                        }else{
                            util.show(realRes.message)
                        }
                    },
                    fail: () => {
                        this.getCode()
                        console.log('error')
                    },
                    complete: () => {
                        uni.hideLoading()
                    }
                })
            }
        },
        getphonenumber(e){
            if(e.detail.encryptedData && e.detail.iv){
                if(this.token){
                    uni.request({
                        url: ENVIRONMENT_CONFIG.host+'/tr/web/talentRecommend/bindMobile?'+ENVIRONMENT_CONFIG.code,
                        method: 'POST',
                        data: {
                            code: this.code,
                            encryptedData: e.detail.encryptedData,
                            iv: e.detail.iv,
                        },
                        success: res => {
                            var res = res.data
                            if(res.code==0){
                                this.$store.commit('setRegister', true)
                                this.$store.commit('setToken', res.data.token)
                                uni.setStorage({
                                    key: 'userInfoRelation',
                                    data: {
                                        token: this.token,
                                    }
                                })
                                this.getinfo()
                            } else {
                                util.show(res.message)
                            }
                            this.getCode()
                        },
                        fail: () => {
                            this.getCode()
                        }
                    })
                }else{
                    uni.request({
                        url: ENVIRONMENT_CONFIG.host+'/tr/web/talentRecommend/register?'+ENVIRONMENT_CONFIG.code,
                        method: 'POST',
                        data: {
                            code: this.code,
                            encryptedData: e.detail.encryptedData,
                            iv: e.detail.iv,
                            unionId: this.unionId
                        },
                        success: res => {
                            var res = res.data
                            if(res.code==0){
                                this.$store.commit('setRegister', true)
                                this.$store.commit('setToken', res.data.token)
                                uni.setStorage({
                                    key: 'userInfoRelation',
                                    data: {
                                        token: this.token,
                                    }
                                })
                                this.getinfo()
                            } else {
                                util.show(res.message)
                            }
                            this.getCode()
                        },
                        fail: () => {
                            this.getCode()
                        }
                    })
                }
            }
        },
        getinfo(){
            uni.request({
                url: ENVIRONMENT_CONFIG.host+'/tr/api/talentRecommend/recommendUserInfo?'+ENVIRONMENT_CONFIG.code,
                method: 'POST',
                header:{
                    'Authorization': 'Bearer '+this.token
                },
                success: res => {
                    let realRes = res.data
                    if(realRes.code!=0){
                        util.show(realRes.message)
                    }else{
                        this.myName = realRes.data.recommendUserName
                        this.myMobile = realRes.data.recommendUserMobile
                        this.isLogin = true
                    }
                    this.getCode()
                },
                fail: (e) => {
                    console.log(e)
                }
            })
        },
        getreList(){
            uni.request({
                url: ENVIRONMENT_CONFIG.host+'/tr/api/talentRecommend/recommendList?'+ENVIRONMENT_CONFIG.code,
                method: 'POST',
                header:{
                    'Authorization': 'Bearer '+this.token
                },
                data: {
                    page: 1,
                    pageSize: 20
                },
                success: res => {
                    let realRes = res.data
                    if(realRes.code!=0){
                        util.show(realRes.message)
                    }else{
                        this.recommendList = realRes.data.list
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
    },
    watch:{
        infoChange(val){
            this.getinfo()
        },
        register(val){
            if(!this.isLogin){
                this.getinfo()
                this.getreList()
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
    margin-top:50rpx;
    margin-right: 40rpx; 
    margin-bottom: 50rpx;
    height: auto;
}
.blank{
    width:100%;
    height:10rpx;
    background:rgba(244,244,244,1);
}
.name{
    width: auto;
    height:34rpx;
    font-size:34rpx;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:500;
    color:rgba(42,39,31,1);
    line-height:51rpx;
    letter-spacing:1rpx;
}
.mobile{
    width:auto;
    height:28rpx;
    font-size:28rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(63,60,53,1);
    line-height:42rpx;
}
.img{
    width:11rpx;
    height:18rpx;
    float:right;
    margin-top: 7rpx;
}
.tittle{
    width:193rpx;
    height:34rpx;
    font-size:34rpx;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:500;
    color:rgba(42,39,31,1);
    line-height:51rpx;
    letter-spacing:1rpx;
}
.date{
    width:auto;
    height:28rpx;
    font-size:28rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(127,125,121,1);
    line-height:42rpx;
    letter-spacing:1rpx;
    float: right;
}
.company{
    width:auto;
    height:28rpx;
    font-size:28rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(63,60,53,1);
    line-height:42rpx;
}
.status{
    width:auto;
    height:50rpx;
    border-radius:10rpx;
    border:1rpx solid rgba(191,190,187,1);
    float: right;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 20rpx;
    padding-right: 20rpx;
}
.word{
    width:auto;
    height:28rpx;
    font-size:28rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(63,60,53,1);
    line-height:42rpx;

}
.c-1{
    width:100rpx;
    height:100rpx;
    border-radius: 50rpx;
    margin-left: 18.6%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.c-2{
    width:100rpx;
    height:100rpx;
    border-radius: 50rpx;
    margin-right: 18.6%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.c-word{
    width:37rpx;
    font-size:60rpx;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:500;
    line-height:90rpx;
    letter-spacing:2rpx;
}
.c-label{
    height:28rpx;
    font-size:28rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(42,39,31,1);
    line-height:42rpx;
    letter-spacing:1rpx;
    margin-left: 120rpx
}
.c-label1{
    height:28rpx;
    font-size:28rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(42,39,31,1);
    line-height:42rpx;
    letter-spacing:1rpx;
    margin-left: 28%;
}
.btn-info{
    height:80rpx;
    background:rgba(255,204,54,1);
    box-shadow:0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.1);
    border-radius:4rpx;
    margin-left: 80rpx;
    margin-right: 80rpx;
    margin-top: 120rpx;
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
.text-no{
    width:auto;
    height:44rpx;
    font-size:32rpx;
    font-family:SourceHanSansCN-Normal,SourceHanSansCN;
    font-weight:400;
    color:rgba(127,125,121,1);
    line-height:48rpx;
    letter-spacing:1rpx;
    margin-top: 30rpx;
}
</style>

