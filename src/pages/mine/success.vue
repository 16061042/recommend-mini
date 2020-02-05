
<template>
    <view style="width:100%">
        <view class="content">
            <view class="block">
                <view style="text-align:center;"><image src="/static/img/sendSuccess.png" class="img"></image></view>
                <view class="title">保存成功</view>
            </view>
        </view>
        <view class="bottom-block">
            <button class="btn" @click="close"><text class="btn-word">知道了</text></button>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    methods: {
        close(){
            this.$store.commit('setInfoChange')
            uni.navigateBack({
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
    margin-top: 50rpx;
    width:auto;
    height:580rpx;
    background:rgba(255,250,235,1);
    border-radius:10rpx;
}
.img{
    width:120rpx;
    height:120rpx;
    margin-top: 60rpx;
}
.title{
    width:auto;
    height:34rpx;
    font-size:34rpx;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:500;
    color:rgba(42,39,31,1);
    line-height:51rpx;
    letter-spacing:1rpx;
    margin-top: 30rpx;
    margin-bottom: 80rpx;
    text-align: center;
}
.word{
    width: auto;
    height:auto;
    font-size:32rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(63,60,53,1);
    line-height:48rpx;
    text-align: center;
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

