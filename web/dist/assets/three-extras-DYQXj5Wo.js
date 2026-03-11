import{y as wt,f as b,z as He,Q as ke,O as me,P as ge,E as V,F as G,g as O,G as Et,H as St,I as xt,J as Fe,K as we,X as Z,Y as _t,s as Ee,r as Qe,Z as At,m as Ye,_ as We,o as Ot,j as J,$ as Pt,q as Lt,a0 as Mt}from"./three-core-NdVHML45.js";const Je=parseInt(wt.replace(/\D+/g,"")),et=Je>=125?"uv1":"uv2";var Tt=Object.defineProperty,Dt=(f,n,i)=>n in f?Tt(f,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):f[n]=i,Ut=(f,n,i)=>(Dt(f,n+"",i),i);class jt{constructor(){Ut(this,"_listeners")}addEventListener(n,i){this._listeners===void 0&&(this._listeners={});const e=this._listeners;e[n]===void 0&&(e[n]=[]),e[n].indexOf(i)===-1&&e[n].push(i)}hasEventListener(n,i){if(this._listeners===void 0)return!1;const e=this._listeners;return e[n]!==void 0&&e[n].indexOf(i)!==-1}removeEventListener(n,i){if(this._listeners===void 0)return;const s=this._listeners[n];if(s!==void 0){const a=s.indexOf(i);a!==-1&&s.splice(a,1)}}dispatchEvent(n){if(this._listeners===void 0)return;const e=this._listeners[n.type];if(e!==void 0){n.target=this;const s=e.slice(0);for(let a=0,g=s.length;a<g;a++)s[a].call(this,n);n.target=null}}}var Ct=Object.defineProperty,zt=(f,n,i)=>n in f?Ct(f,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):f[n]=i,l=(f,n,i)=>(zt(f,typeof n!="symbol"?n+"":n,i),i);const oe=new Et,Ve=new St,It=Math.cos(70*(Math.PI/180)),Ge=(f,n)=>(f%n+n)%n;class Yt extends jt{constructor(n,i){super(),l(this,"object"),l(this,"domElement"),l(this,"enabled",!0),l(this,"target",new b),l(this,"minDistance",0),l(this,"maxDistance",1/0),l(this,"minZoom",0),l(this,"maxZoom",1/0),l(this,"minPolarAngle",0),l(this,"maxPolarAngle",Math.PI),l(this,"minAzimuthAngle",-1/0),l(this,"maxAzimuthAngle",1/0),l(this,"enableDamping",!1),l(this,"dampingFactor",.05),l(this,"enableZoom",!0),l(this,"zoomSpeed",1),l(this,"enableRotate",!0),l(this,"rotateSpeed",1),l(this,"enablePan",!0),l(this,"panSpeed",1),l(this,"screenSpacePanning",!0),l(this,"keyPanSpeed",7),l(this,"zoomToCursor",!1),l(this,"autoRotate",!1),l(this,"autoRotateSpeed",2),l(this,"reverseOrbit",!1),l(this,"reverseHorizontalOrbit",!1),l(this,"reverseVerticalOrbit",!1),l(this,"keys",{LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"}),l(this,"mouseButtons",{LEFT:V.ROTATE,MIDDLE:V.DOLLY,RIGHT:V.PAN}),l(this,"touches",{ONE:G.ROTATE,TWO:G.DOLLY_PAN}),l(this,"target0"),l(this,"position0"),l(this,"zoom0"),l(this,"_domElementKeyEvents",null),l(this,"getPolarAngle"),l(this,"getAzimuthalAngle"),l(this,"setPolarAngle"),l(this,"setAzimuthalAngle"),l(this,"getDistance"),l(this,"getZoomScale"),l(this,"listenToKeyEvents"),l(this,"stopListenToKeyEvents"),l(this,"saveState"),l(this,"reset"),l(this,"update"),l(this,"connect"),l(this,"dispose"),l(this,"dollyIn"),l(this,"dollyOut"),l(this,"getScale"),l(this,"setScale"),this.object=n,this.domElement=i,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=()=>u.phi,this.getAzimuthalAngle=()=>u.theta,this.setPolarAngle=t=>{let o=Ge(t,2*Math.PI),c=u.phi;c<0&&(c+=2*Math.PI),o<0&&(o+=2*Math.PI);let p=Math.abs(o-c);2*Math.PI-p<p&&(o<c?o+=2*Math.PI:c+=2*Math.PI),m.phi=o-c,e.update()},this.setAzimuthalAngle=t=>{let o=Ge(t,2*Math.PI),c=u.theta;c<0&&(c+=2*Math.PI),o<0&&(o+=2*Math.PI);let p=Math.abs(o-c);2*Math.PI-p<p&&(o<c?o+=2*Math.PI:c+=2*Math.PI),m.theta=o-c,e.update()},this.getDistance=()=>e.object.position.distanceTo(e.target),this.listenToKeyEvents=t=>{t.addEventListener("keydown",pe),this._domElementKeyEvents=t},this.stopListenToKeyEvents=()=>{this._domElementKeyEvents.removeEventListener("keydown",pe),this._domElementKeyEvents=null},this.saveState=()=>{e.target0.copy(e.target),e.position0.copy(e.object.position),e.zoom0=e.object.zoom},this.reset=()=>{e.target.copy(e.target0),e.object.position.copy(e.position0),e.object.zoom=e.zoom0,e.object.updateProjectionMatrix(),e.dispatchEvent(s),e.update(),d=r.NONE},this.update=(()=>{const t=new b,o=new b(0,1,0),c=new ke().setFromUnitVectors(n.up,o),p=c.clone().invert(),y=new b,C=new ke,H=2*Math.PI;return function(){const Be=e.object.position;c.setFromUnitVectors(n.up,o),p.copy(c).invert(),t.copy(Be).sub(e.target),t.applyQuaternion(c),u.setFromVector3(t),e.autoRotate&&d===r.NONE&&le(it()),e.enableDamping?(u.theta+=m.theta*e.dampingFactor,u.phi+=m.phi*e.dampingFactor):(u.theta+=m.theta,u.phi+=m.phi);let z=e.minAzimuthAngle,I=e.maxAzimuthAngle;isFinite(z)&&isFinite(I)&&(z<-Math.PI?z+=H:z>Math.PI&&(z-=H),I<-Math.PI?I+=H:I>Math.PI&&(I-=H),z<=I?u.theta=Math.max(z,Math.min(I,u.theta)):u.theta=u.theta>(z+I)/2?Math.max(z,u.theta):Math.min(I,u.theta)),u.phi=Math.max(e.minPolarAngle,Math.min(e.maxPolarAngle,u.phi)),u.makeSafe(),e.enableDamping===!0?e.target.addScaledVector(R,e.dampingFactor):e.target.add(R),e.zoomToCursor&&ee||e.object.isOrthographicCamera?u.radius=ue(u.radius):u.radius=ue(u.radius*v),t.setFromSpherical(u),t.applyQuaternion(p),Be.copy(e.target).add(t),e.object.matrixAutoUpdate||e.object.updateMatrix(),e.object.lookAt(e.target),e.enableDamping===!0?(m.theta*=1-e.dampingFactor,m.phi*=1-e.dampingFactor,R.multiplyScalar(1-e.dampingFactor)):(m.set(0,0,0),R.set(0,0,0));let q=!1;if(e.zoomToCursor&&ee){let $=null;if(e.object instanceof ge&&e.object.isPerspectiveCamera){const Q=t.length();$=ue(Q*v);const ie=Q-$;e.object.position.addScaledVector(Se,ie),e.object.updateMatrixWorld()}else if(e.object.isOrthographicCamera){const Q=new b(B.x,B.y,0);Q.unproject(e.object),e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/v)),e.object.updateProjectionMatrix(),q=!0;const ie=new b(B.x,B.y,0);ie.unproject(e.object),e.object.position.sub(ie).add(Q),e.object.updateMatrixWorld(),$=t.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),e.zoomToCursor=!1;$!==null&&(e.screenSpacePanning?e.target.set(0,0,-1).transformDirection(e.object.matrix).multiplyScalar($).add(e.object.position):(oe.origin.copy(e.object.position),oe.direction.set(0,0,-1).transformDirection(e.object.matrix),Math.abs(e.object.up.dot(oe.direction))<It?n.lookAt(e.target):(Ve.setFromNormalAndCoplanarPoint(e.object.up,e.target),oe.intersectPlane(Ve,e.target))))}else e.object instanceof me&&e.object.isOrthographicCamera&&(q=v!==1,q&&(e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/v)),e.object.updateProjectionMatrix()));return v=1,ee=!1,q||y.distanceToSquared(e.object.position)>_||8*(1-C.dot(e.object.quaternion))>_?(e.dispatchEvent(s),y.copy(e.object.position),C.copy(e.object.quaternion),q=!1,!0):!1}})(),this.connect=t=>{e.domElement=t,e.domElement.style.touchAction="none",e.domElement.addEventListener("contextmenu",Re),e.domElement.addEventListener("pointerdown",ze),e.domElement.addEventListener("pointercancel",K),e.domElement.addEventListener("wheel",Ie)},this.dispose=()=>{var t,o,c,p,y,C;e.domElement&&(e.domElement.style.touchAction="auto"),(t=e.domElement)==null||t.removeEventListener("contextmenu",Re),(o=e.domElement)==null||o.removeEventListener("pointerdown",ze),(c=e.domElement)==null||c.removeEventListener("pointercancel",K),(p=e.domElement)==null||p.removeEventListener("wheel",Ie),(y=e.domElement)==null||y.ownerDocument.removeEventListener("pointermove",fe),(C=e.domElement)==null||C.ownerDocument.removeEventListener("pointerup",K),e._domElementKeyEvents!==null&&e._domElementKeyEvents.removeEventListener("keydown",pe)};const e=this,s={type:"change"},a={type:"start"},g={type:"end"},r={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let d=r.NONE;const _=1e-6,u=new He,m=new He;let v=1;const R=new b,N=new O,P=new O,D=new O,U=new O,j=new O,A=new O,x=new O,Y=new O,X=new O,Se=new b,B=new O;let ee=!1;const h=[],te={};function it(){return 2*Math.PI/60/60*e.autoRotateSpeed}function k(){return Math.pow(.95,e.zoomSpeed)}function le(t){e.reverseOrbit||e.reverseHorizontalOrbit?m.theta+=t:m.theta-=t}function xe(t){e.reverseOrbit||e.reverseVerticalOrbit?m.phi+=t:m.phi-=t}const _e=(()=>{const t=new b;return function(c,p){t.setFromMatrixColumn(p,0),t.multiplyScalar(-c),R.add(t)}})(),Ae=(()=>{const t=new b;return function(c,p){e.screenSpacePanning===!0?t.setFromMatrixColumn(p,1):(t.setFromMatrixColumn(p,0),t.crossVectors(e.object.up,t)),t.multiplyScalar(c),R.add(t)}})(),W=(()=>{const t=new b;return function(c,p){const y=e.domElement;if(y&&e.object instanceof ge&&e.object.isPerspectiveCamera){const C=e.object.position;t.copy(C).sub(e.target);let H=t.length();H*=Math.tan(e.object.fov/2*Math.PI/180),_e(2*c*H/y.clientHeight,e.object.matrix),Ae(2*p*H/y.clientHeight,e.object.matrix)}else y&&e.object instanceof me&&e.object.isOrthographicCamera?(_e(c*(e.object.right-e.object.left)/e.object.zoom/y.clientWidth,e.object.matrix),Ae(p*(e.object.top-e.object.bottom)/e.object.zoom/y.clientHeight,e.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),e.enablePan=!1)}})();function ce(t){e.object instanceof ge&&e.object.isPerspectiveCamera||e.object instanceof me&&e.object.isOrthographicCamera?v=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function ne(t){ce(v/t)}function de(t){ce(v*t)}function Oe(t){if(!e.zoomToCursor||!e.domElement)return;ee=!0;const o=e.domElement.getBoundingClientRect(),c=t.clientX-o.left,p=t.clientY-o.top,y=o.width,C=o.height;B.x=c/y*2-1,B.y=-(p/C)*2+1,Se.set(B.x,B.y,1).unproject(e.object).sub(e.object.position).normalize()}function ue(t){return Math.max(e.minDistance,Math.min(e.maxDistance,t))}function Pe(t){N.set(t.clientX,t.clientY)}function ot(t){Oe(t),x.set(t.clientX,t.clientY)}function Le(t){U.set(t.clientX,t.clientY)}function st(t){P.set(t.clientX,t.clientY),D.subVectors(P,N).multiplyScalar(e.rotateSpeed);const o=e.domElement;o&&(le(2*Math.PI*D.x/o.clientHeight),xe(2*Math.PI*D.y/o.clientHeight)),N.copy(P),e.update()}function at(t){Y.set(t.clientX,t.clientY),X.subVectors(Y,x),X.y>0?ne(k()):X.y<0&&de(k()),x.copy(Y),e.update()}function rt(t){j.set(t.clientX,t.clientY),A.subVectors(j,U).multiplyScalar(e.panSpeed),W(A.x,A.y),U.copy(j),e.update()}function lt(t){Oe(t),t.deltaY<0?de(k()):t.deltaY>0&&ne(k()),e.update()}function ct(t){let o=!1;switch(t.code){case e.keys.UP:W(0,e.keyPanSpeed),o=!0;break;case e.keys.BOTTOM:W(0,-e.keyPanSpeed),o=!0;break;case e.keys.LEFT:W(e.keyPanSpeed,0),o=!0;break;case e.keys.RIGHT:W(-e.keyPanSpeed,0),o=!0;break}o&&(t.preventDefault(),e.update())}function Me(){if(h.length==1)N.set(h[0].pageX,h[0].pageY);else{const t=.5*(h[0].pageX+h[1].pageX),o=.5*(h[0].pageY+h[1].pageY);N.set(t,o)}}function Te(){if(h.length==1)U.set(h[0].pageX,h[0].pageY);else{const t=.5*(h[0].pageX+h[1].pageX),o=.5*(h[0].pageY+h[1].pageY);U.set(t,o)}}function De(){const t=h[0].pageX-h[1].pageX,o=h[0].pageY-h[1].pageY,c=Math.sqrt(t*t+o*o);x.set(0,c)}function dt(){e.enableZoom&&De(),e.enablePan&&Te()}function ut(){e.enableZoom&&De(),e.enableRotate&&Me()}function Ue(t){if(h.length==1)P.set(t.pageX,t.pageY);else{const c=he(t),p=.5*(t.pageX+c.x),y=.5*(t.pageY+c.y);P.set(p,y)}D.subVectors(P,N).multiplyScalar(e.rotateSpeed);const o=e.domElement;o&&(le(2*Math.PI*D.x/o.clientHeight),xe(2*Math.PI*D.y/o.clientHeight)),N.copy(P)}function je(t){if(h.length==1)j.set(t.pageX,t.pageY);else{const o=he(t),c=.5*(t.pageX+o.x),p=.5*(t.pageY+o.y);j.set(c,p)}A.subVectors(j,U).multiplyScalar(e.panSpeed),W(A.x,A.y),U.copy(j)}function Ce(t){const o=he(t),c=t.pageX-o.x,p=t.pageY-o.y,y=Math.sqrt(c*c+p*p);Y.set(0,y),X.set(0,Math.pow(Y.y/x.y,e.zoomSpeed)),ne(X.y),x.copy(Y)}function ft(t){e.enableZoom&&Ce(t),e.enablePan&&je(t)}function pt(t){e.enableZoom&&Ce(t),e.enableRotate&&Ue(t)}function ze(t){var o,c;e.enabled!==!1&&(h.length===0&&((o=e.domElement)==null||o.ownerDocument.addEventListener("pointermove",fe),(c=e.domElement)==null||c.ownerDocument.addEventListener("pointerup",K)),vt(t),t.pointerType==="touch"?gt(t):ht(t))}function fe(t){e.enabled!==!1&&(t.pointerType==="touch"?bt(t):mt(t))}function K(t){var o,c,p;yt(t),h.length===0&&((o=e.domElement)==null||o.releasePointerCapture(t.pointerId),(c=e.domElement)==null||c.ownerDocument.removeEventListener("pointermove",fe),(p=e.domElement)==null||p.ownerDocument.removeEventListener("pointerup",K)),e.dispatchEvent(g),d=r.NONE}function ht(t){let o;switch(t.button){case 0:o=e.mouseButtons.LEFT;break;case 1:o=e.mouseButtons.MIDDLE;break;case 2:o=e.mouseButtons.RIGHT;break;default:o=-1}switch(o){case V.DOLLY:if(e.enableZoom===!1)return;ot(t),d=r.DOLLY;break;case V.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(e.enablePan===!1)return;Le(t),d=r.PAN}else{if(e.enableRotate===!1)return;Pe(t),d=r.ROTATE}break;case V.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(e.enableRotate===!1)return;Pe(t),d=r.ROTATE}else{if(e.enablePan===!1)return;Le(t),d=r.PAN}break;default:d=r.NONE}d!==r.NONE&&e.dispatchEvent(a)}function mt(t){if(e.enabled!==!1)switch(d){case r.ROTATE:if(e.enableRotate===!1)return;st(t);break;case r.DOLLY:if(e.enableZoom===!1)return;at(t);break;case r.PAN:if(e.enablePan===!1)return;rt(t);break}}function Ie(t){e.enabled===!1||e.enableZoom===!1||d!==r.NONE&&d!==r.ROTATE||(t.preventDefault(),e.dispatchEvent(a),lt(t),e.dispatchEvent(g))}function pe(t){e.enabled===!1||e.enablePan===!1||ct(t)}function gt(t){switch(Ne(t),h.length){case 1:switch(e.touches.ONE){case G.ROTATE:if(e.enableRotate===!1)return;Me(),d=r.TOUCH_ROTATE;break;case G.PAN:if(e.enablePan===!1)return;Te(),d=r.TOUCH_PAN;break;default:d=r.NONE}break;case 2:switch(e.touches.TWO){case G.DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;dt(),d=r.TOUCH_DOLLY_PAN;break;case G.DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;ut(),d=r.TOUCH_DOLLY_ROTATE;break;default:d=r.NONE}break;default:d=r.NONE}d!==r.NONE&&e.dispatchEvent(a)}function bt(t){switch(Ne(t),d){case r.TOUCH_ROTATE:if(e.enableRotate===!1)return;Ue(t),e.update();break;case r.TOUCH_PAN:if(e.enablePan===!1)return;je(t),e.update();break;case r.TOUCH_DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;ft(t),e.update();break;case r.TOUCH_DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;pt(t),e.update();break;default:d=r.NONE}}function Re(t){e.enabled!==!1&&t.preventDefault()}function vt(t){h.push(t)}function yt(t){delete te[t.pointerId];for(let o=0;o<h.length;o++)if(h[o].pointerId==t.pointerId){h.splice(o,1);return}}function Ne(t){let o=te[t.pointerId];o===void 0&&(o=new O,te[t.pointerId]=o),o.set(t.pageX,t.pageY)}function he(t){const o=t.pointerId===h[0].pointerId?h[1]:h[0];return te[o.pointerId]}this.dollyIn=(t=k())=>{de(t),e.update()},this.dollyOut=(t=k())=>{ne(t),e.update()},this.getScale=()=>v,this.setScale=t=>{ce(t),e.update()},this.getZoomScale=()=>k(),i!==void 0&&this.connect(i),this.update()}}const Ze=new Ee,se=new b;class tt extends xt{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const n=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],i=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],e=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(e),this.setAttribute("position",new Fe(n,3)),this.setAttribute("uv",new Fe(i,2))}applyMatrix4(n){const i=this.attributes.instanceStart,e=this.attributes.instanceEnd;return i!==void 0&&(i.applyMatrix4(n),e.applyMatrix4(n),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(n){let i;n instanceof Float32Array?i=n:Array.isArray(n)&&(i=new Float32Array(n));const e=new we(i,6,1);return this.setAttribute("instanceStart",new Z(e,3,0)),this.setAttribute("instanceEnd",new Z(e,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(n,i=3){let e;n instanceof Float32Array?e=n:Array.isArray(n)&&(e=new Float32Array(n));const s=new we(e,i*2,1);return this.setAttribute("instanceColorStart",new Z(s,i,0)),this.setAttribute("instanceColorEnd",new Z(s,i,i)),this}fromWireframeGeometry(n){return this.setPositions(n.attributes.position.array),this}fromEdgesGeometry(n){return this.setPositions(n.attributes.position.array),this}fromMesh(n){return this.fromWireframeGeometry(new _t(n.geometry)),this}fromLineSegments(n){const i=n.geometry;return this.setPositions(i.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ee);const n=this.attributes.instanceStart,i=this.attributes.instanceEnd;n!==void 0&&i!==void 0&&(this.boundingBox.setFromBufferAttribute(n),Ze.setFromBufferAttribute(i),this.boundingBox.union(Ze))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qe),this.boundingBox===null&&this.computeBoundingBox();const n=this.attributes.instanceStart,i=this.attributes.instanceEnd;if(n!==void 0&&i!==void 0){const e=this.boundingSphere.center;this.boundingBox.getCenter(e);let s=0;for(let a=0,g=n.count;a<g;a++)se.fromBufferAttribute(n,a),s=Math.max(s,e.distanceToSquared(se)),se.fromBufferAttribute(i,a),s=Math.max(s,e.distanceToSquared(se));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(n){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(n)}}class Rt extends tt{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(n){const i=n.length-3,e=new Float32Array(2*i);for(let s=0;s<i;s+=3)e[2*s]=n[s],e[2*s+1]=n[s+1],e[2*s+2]=n[s+2],e[2*s+3]=n[s+3],e[2*s+4]=n[s+4],e[2*s+5]=n[s+5];return super.setPositions(e),this}setColors(n,i=3){const e=n.length-i,s=new Float32Array(2*e);if(i===3)for(let a=0;a<e;a+=i)s[2*a]=n[a],s[2*a+1]=n[a+1],s[2*a+2]=n[a+2],s[2*a+3]=n[a+3],s[2*a+4]=n[a+4],s[2*a+5]=n[a+5];else for(let a=0;a<e;a+=i)s[2*a]=n[a],s[2*a+1]=n[a+1],s[2*a+2]=n[a+2],s[2*a+3]=n[a+3],s[2*a+4]=n[a+4],s[2*a+5]=n[a+5],s[2*a+6]=n[a+6],s[2*a+7]=n[a+7];return super.setColors(s,i),this}fromLine(n){const i=n.geometry;return this.setPositions(i.attributes.position.array),this}}class nt extends At{constructor(n){super({type:"LineMaterial",uniforms:Ye.clone(Ye.merge([We.common,We.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new O(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${Je>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(i){this.uniforms.diffuse.value=i}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(i){i===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(i){this.uniforms.linewidth.value=i}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(i){!!i!="USE_DASH"in this.defines&&(this.needsUpdate=!0),i===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(i){this.uniforms.dashScale.value=i}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(i){this.uniforms.dashSize.value=i}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(i){this.uniforms.dashOffset.value=i}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(i){this.uniforms.gapSize.value=i}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(i){this.uniforms.opacity.value=i}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(i){this.uniforms.resolution.value.copy(i)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(i){!!i!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),i===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(n)}}const be=new J,Xe=new b,Ke=new b,w=new J,E=new J,L=new J,ve=new b,ye=new Lt,S=new Pt,qe=new b,ae=new Ee,re=new Qe,M=new J;let T,F;function $e(f,n,i){return M.set(0,0,-n,1).applyMatrix4(f.projectionMatrix),M.multiplyScalar(1/M.w),M.x=F/i.width,M.y=F/i.height,M.applyMatrix4(f.projectionMatrixInverse),M.multiplyScalar(1/M.w),Math.abs(Math.max(M.x,M.y))}function Nt(f,n){const i=f.matrixWorld,e=f.geometry,s=e.attributes.instanceStart,a=e.attributes.instanceEnd,g=Math.min(e.instanceCount,s.count);for(let r=0,d=g;r<d;r++){S.start.fromBufferAttribute(s,r),S.end.fromBufferAttribute(a,r),S.applyMatrix4(i);const _=new b,u=new b;T.distanceSqToSegment(S.start,S.end,u,_),u.distanceTo(_)<F*.5&&n.push({point:u,pointOnLine:_,distance:T.origin.distanceTo(u),object:f,face:null,faceIndex:r,uv:null,[et]:null})}}function Bt(f,n,i){const e=n.projectionMatrix,a=f.material.resolution,g=f.matrixWorld,r=f.geometry,d=r.attributes.instanceStart,_=r.attributes.instanceEnd,u=Math.min(r.instanceCount,d.count),m=-n.near;T.at(1,L),L.w=1,L.applyMatrix4(n.matrixWorldInverse),L.applyMatrix4(e),L.multiplyScalar(1/L.w),L.x*=a.x/2,L.y*=a.y/2,L.z=0,ve.copy(L),ye.multiplyMatrices(n.matrixWorldInverse,g);for(let v=0,R=u;v<R;v++){if(w.fromBufferAttribute(d,v),E.fromBufferAttribute(_,v),w.w=1,E.w=1,w.applyMatrix4(ye),E.applyMatrix4(ye),w.z>m&&E.z>m)continue;if(w.z>m){const A=w.z-E.z,x=(w.z-m)/A;w.lerp(E,x)}else if(E.z>m){const A=E.z-w.z,x=(E.z-m)/A;E.lerp(w,x)}w.applyMatrix4(e),E.applyMatrix4(e),w.multiplyScalar(1/w.w),E.multiplyScalar(1/E.w),w.x*=a.x/2,w.y*=a.y/2,E.x*=a.x/2,E.y*=a.y/2,S.start.copy(w),S.start.z=0,S.end.copy(E),S.end.z=0;const P=S.closestPointToPointParameter(ve,!0);S.at(P,qe);const D=Mt.lerp(w.z,E.z,P),U=D>=-1&&D<=1,j=ve.distanceTo(qe)<F*.5;if(U&&j){S.start.fromBufferAttribute(d,v),S.end.fromBufferAttribute(_,v),S.start.applyMatrix4(g),S.end.applyMatrix4(g);const A=new b,x=new b;T.distanceSqToSegment(S.start,S.end,x,A),i.push({point:x,pointOnLine:A,distance:T.origin.distanceTo(x),object:f,face:null,faceIndex:v,uv:null,[et]:null})}}}class Ht extends Ot{constructor(n=new tt,i=new nt({color:Math.random()*16777215})){super(n,i),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const n=this.geometry,i=n.attributes.instanceStart,e=n.attributes.instanceEnd,s=new Float32Array(2*i.count);for(let g=0,r=0,d=i.count;g<d;g++,r+=2)Xe.fromBufferAttribute(i,g),Ke.fromBufferAttribute(e,g),s[r]=r===0?0:s[r-1],s[r+1]=s[r]+Xe.distanceTo(Ke);const a=new we(s,2,1);return n.setAttribute("instanceDistanceStart",new Z(a,1,0)),n.setAttribute("instanceDistanceEnd",new Z(a,1,1)),this}raycast(n,i){const e=this.material.worldUnits,s=n.camera;s===null&&!e&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const a=n.params.Line2!==void 0&&n.params.Line2.threshold||0;T=n.ray;const g=this.matrixWorld,r=this.geometry,d=this.material;F=d.linewidth+a,r.boundingSphere===null&&r.computeBoundingSphere(),re.copy(r.boundingSphere).applyMatrix4(g);let _;if(e)_=F*.5;else{const m=Math.max(s.near,re.distanceToPoint(T.origin));_=$e(s,m,d.resolution)}if(re.radius+=_,T.intersectsSphere(re)===!1)return;r.boundingBox===null&&r.computeBoundingBox(),ae.copy(r.boundingBox).applyMatrix4(g);let u;if(e)u=F*.5;else{const m=Math.max(s.near,ae.distanceToPoint(T.origin));u=$e(s,m,d.resolution)}ae.expandByScalar(u),T.intersectsBox(ae)!==!1&&(e?Nt(this,i):Bt(this,s,i))}onBeforeRender(n){const i=this.material.uniforms;i&&i.resolution&&(n.getViewport(be),this.material.uniforms.resolution.value.set(be.z,be.w))}}class Wt extends Ht{constructor(n=new Rt,i=new nt({color:Math.random()*16777215})){super(n,i),this.isLine2=!0,this.type="Line2"}}export{Ht as L,Yt as O,Wt as a,nt as b,tt as c,Rt as d};
