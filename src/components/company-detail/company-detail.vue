<template>
    <view>
        <view :class="{'max3':isShow}" style="padding-top:10px;text-align: justify;">
            <text class="company-detail" id="word" selectable='true'>{{companyDetail}}</text>
        </view>
        <view @click="isShow=false" v-if="isShow" style="margin-top:50rpx;display:flex;justify-content:center;align-items:center;">
            <text class="click-word">查看公司介绍</text>
            <image src="/static/img/down.png" style="width:18rpx;height:11rpx;margin-left:20rpx;"></image>
        </view>
        <view @click="isShow=true" v-else-if="isShow!=null" style="margin-top:50rpx;display:flex;justify-content:center;align-items:center;">
            <text class="click-word">收起</text>
            <image src="/static/img/up.png" style="width:18rpx;height:11rpx;margin-left:20rpx;"></image>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        companyDetail: String
    },
    data() {
        return {
            isShow: true
        }
    },
    mounted(){
        var query = wx.createSelectorQuery().in(this)
        query.select('#word').boundingClientRect()
        query.selectViewport().scrollOffset()
        var that = this
        query.exec(function(res){
            let height = res[0].height
            let col = height/32
            if(col<=3){
                that.isShow = null
            }
        })
    }
}
</script>


<style scoped>
.company-detail{
    width:100%;
    height:auto;
    font-size:32rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(105,103,98,1);
    line-height:52rpx;
}
.max3{
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    white-space: normal !important;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
.click-word{
    font-size:28rpx;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(105,103,98,1);
    line-height:33rpx;
}
</style>

