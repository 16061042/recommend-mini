(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/uploadCv/recommender"],{"34b8":function(e,t,n){},"4a51":function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=i(n("ce4d")),r=n("08c1"),a=i(n("ca00"));function i(e){return e&&e.__esModule?e:{default:e}}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(n,!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var d={onLoad:function(t){var n=this;this.positionId=t.positionId,e.request({url:o.default.host+"/tr/api/talentRecommend/recommendUserInfo?"+o.default.code,method:"POST",header:{Authorization:"Bearer "+this.token},success:function(e){console.log(e);var t=e.data;0==t.code?(n.name=t.data.recommendUserName,n.company=t.data.recommendUserCompany,n.position=t.data.recommendUserPosition,n.email=t.data.recommendUserEmail):a.default.show(t.message)},fail:function(){a.default.show("获取推荐信息失败")}})},computed:u({},(0,r.mapState)(["token"])),data:function(){return{name:"",company:"",position:"",email:"",positionId:0}},methods:{handleSubmit:function(){var t=this;e.request({url:o.default.host+"/tr/api/talentRecommend/beginRecommend?"+o.default.code,method:"POST",header:{Authorization:"Bearer "+this.token},data:{recommendUserName:this.name,recommendUserPosition:this.position,recommendUserCompany:this.company,recommendUserEmail:this.email,positionId:this.positionId},success:function(n){var o=n.data;0==o.code?e.redirectTo({url:"success?email="+t.email}):a.default.show(o.message)},fail:function(e){console.log(e)}})},onShareAppMessage:function(){return{title:"推荐简历，兼职赚钱",path:"/pages/main/main"}}}};t.default=d}).call(this,n("aafe")["default"])},"59bd":function(e,t,n){"use strict";n.r(t);var o=n("ce0f"),r=n("ee55");for(var a in r)"default"!==a&&function(e){n.d(t,e,(function(){return r[e]}))}(a);n("c38e");var i=n("4e82"),c=Object(i["a"])(r["default"],o["a"],o["b"],!1,null,"6e43b84e",null);t["default"]=c.exports},"7dde":function(e,t,n){"use strict";(function(e){n("6cdc"),n("ca78");o(n("31af"));var t=o(n("59bd"));function o(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("aafe")["createPage"])},c38e:function(e,t,n){"use strict";var o=n("34b8"),r=n.n(o);r.a},ce0f:function(e,t,n){"use strict";var o=function(){var e=this,t=e.$createElement;e._self._c},r=[];n.d(t,"a",(function(){return o})),n.d(t,"b",(function(){return r}))},ee55:function(e,t,n){"use strict";n.r(t);var o=n("4a51"),r=n.n(o);for(var a in o)"default"!==a&&function(e){n.d(t,e,(function(){return o[e]}))}(a);t["default"]=r.a}},[["7dde","common/runtime","common/vendor"]]]);