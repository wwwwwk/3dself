(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-a39fdcba"],{"0e02":function(e,t,n){"use strict";n("65f5")},4036:function(e,t,n){},6511:function(e,t,n){"use strict";n.r(t);var o=n("7a23"),a={class:"home-main"};function r(e,t,n,r,c,i){var s=Object(o["D"])("HomePage");return Object(o["v"])(),Object(o["f"])("div",a,[Object(o["j"])(s)])}n("b0c0");var c={class:"home-container"},i={class:"gl-render",ref:"homeContainer"};function s(e,t,n,a,r,s){var f=Object(o["D"])("router-link");return Object(o["v"])(),Object(o["f"])(o["a"],null,[Object(o["g"])("div",c,[(Object(o["v"])(!0),Object(o["f"])(o["a"],null,Object(o["C"])(a.headerData,(function(e,t){return Object(o["v"])(),Object(o["d"])(f,{key:t,to:e.path},{default:Object(o["I"])((function(){return[Object(o["g"])("span",null,Object(o["F"])(e.name),1)]})),_:2},1032,["to"])})),128))]),Object(o["g"])("div",i,null,512)],64)}n("d3b7"),n("cfc3"),n("907a"),n("9a8c"),n("a975"),n("735e"),n("c1ac"),n("d139"),n("3a7b"),n("d5d6"),n("82f8"),n("e91f"),n("60bd"),n("5f96"),n("3280"),n("3fcc"),n("ca91"),n("25a1"),n("cd26"),n("3c5d"),n("2954"),n("649e"),n("219c"),n("170b"),n("b39a"),n("72f7"),n("159b");var f,d,u,b,l,p,m=n("5a89"),h=[],v=function(e){f=new m["vb"],d=new m["jb"](60,e.offsetWidth/e.offsetHeight,1,1e3),d.position.set(0,10,0),u=new m["b"](5592405),f.add(u),b=new m["Sb"]({antialias:!0}),f.fog=new m["z"](1118495,.002),b.setClearColor(f.fog.color),b.setSize(e.offsetWidth,e.offsetHeight),e.appendChild(b.domElement),l=new m["L"]({vertexColors:!0});for(var t=[new m["Ob"](-10,-10,-10),new m["Ob"](10,10,10)],n=[.4,1,1,0,0,0],o=[],a=0;a<300;a+=1){var r=(new m["i"]).setFromPoints(t);r.setAttribute("color",new m["h"](new Float32Array(n),3));var c=new m["K"](r,l);c.position.set(400*Math.random()-200,500*Math.random()-250,400*Math.random()-200),f.add(c),o.push(c)}h=o},j=function e(){p=requestAnimationFrame(e);for(var t=0;t<h.length;t+=1){var n=h[t].position.x-4-.1*.1,o=h[t].position.y-4-.1*.1,a=h[t].position.z-4-.1*.1;n=n<-200?200:n,o=o<-200?200:o,a=a<-200?200:a,h[t].position.set(n,o,a)}b.render(f,d)},O=function(){l.dispose(),b.dispose(),u.dispose(),h.forEach((function(e){e.geometry.dispose()})),cancelAnimationFrame(p)},w={name:"HomePage",setup:function(){var e=[{name:"地球",path:"/earth"},{name:"城市",path:"/city"},{name:"建筑",path:"building"},{name:"房间",path:"room"}],t=Object(o["B"])();return Object(o["t"])((function(){v(t.value),j()})),Object(o["r"])((function(){O()})),{homeContainer:t,headerData:e}}},C=(n("f1d1"),n("6b0d")),g=n.n(C);const y=g()(w,[["render",s],["__scopeId","data-v-124c3572"]]);var k=y,H={name:"Home",components:{HomePage:k},setup:function(){var e=Object(o["n"])("setToolbarState");e({routeControl:!1,rotateControl:!1,initControl:!1,heatmapControl:!1,flyLineControl:!1,featurePointControl:!1,distanceBufferControl:!1,lightMaskControl:!1,citySpriteControl:!1})}};n("0e02");const F=g()(H,[["render",r],["__scopeId","data-v-1c16c92d"]]);t["default"]=F},"65f5":function(e,t,n){},f1d1:function(e,t,n){"use strict";n("4036")}}]);
//# sourceMappingURL=chunk-a39fdcba.ab1fabd2.js.map