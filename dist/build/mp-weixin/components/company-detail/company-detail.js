(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/company-detail/company-detail"],{"035f":function(t,n,e){"use strict";e.r(n);var o=e("bf85"),u=e.n(o);for(var i in o)"default"!==i&&function(t){e.d(n,t,(function(){return o[t]}))}(i);n["default"]=u.a},"3e05":function(t,n,e){"use strict";var o=e("9e0c"),u=e.n(o);u.a},"5ffe":function(t,n,e){"use strict";e.r(n);var o=e("8b39"),u=e("035f");for(var i in u)"default"!==i&&function(t){e.d(n,t,(function(){return u[t]}))}(i);e("3e05");var r=e("4e82"),c=Object(r["a"])(u["default"],o["a"],o["b"],!1,null,"7f905044",null);n["default"]=c.exports},"8b39":function(t,n,e){"use strict";var o=function(){var t=this,n=t.$createElement;t._self._c;t._isMounted||(t.e0=function(n){t.isShow=!1},t.e1=function(n){t.isShow=!0})},u=[];e.d(n,"a",(function(){return o})),e.d(n,"b",(function(){return u}))},"9e0c":function(t,n,e){},bf85:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o={props:{companyDetail:String},data:function(){return{isShow:!0}},mounted:function(){var t=wx.createSelectorQuery().in(this);t.select("#word").boundingClientRect(),t.selectViewport().scrollOffset();var n=this;t.exec((function(t){var e=t[0].height,o=e/32;o<=3&&(n.isShow=null)}))}};n.default=o}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/company-detail/company-detail-create-component',
    {
        'components/company-detail/company-detail-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('aafe')['createComponent'](__webpack_require__("5ffe"))
        })
    },
    [['components/company-detail/company-detail-create-component']]
]);                
