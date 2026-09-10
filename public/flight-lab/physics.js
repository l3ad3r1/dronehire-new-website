(function(root){
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function fresh(){return {x:0,y:0,z:0,vx:0,vy:0,vz:0,yaw:0,airborne:false,auto:null,battery:100,time:0,event:'',turn:0};}
  function takeoff(s){if(s.airborne||s.battery<=0)return;s.airborne=true;s.auto='takeoff';s.event='Taking off to 2 m. Keep the area clear.';}
  function update(s,input,dt,mode='cine',wind=false){
    dt=clamp(dt,0,.05);s.event='';if(!s.airborne)return;
    s.time+=dt;s.battery=Math.max(0,s.battery-dt*.035);
    let up=input.up||0,forward=input.forward||0,right=input.right||0,yaw=input.yaw||0;
    const max=mode==='sport'?10:mode==='normal'?5:2.5;
    let tx=(Math.sin(s.yaw)*forward+Math.cos(s.yaw)*right)*max;
    let tz=(-Math.cos(s.yaw)*forward+Math.sin(s.yaw)*right)*max;
    const length=Math.hypot(tx,tz);if(length>max){tx*=max/length;tz*=max/length;}
    let ty=up*(mode==='cine'?(up<0?.8:1.4):2.5);
    if(s.battery===0)s.auto='land';
    if(s.auto==='takeoff'){tx=tz=yaw=0;ty=clamp((2-s.y)*2,0,1.2);if(s.y>1.96){s.auto=null;s.event='Takeoff complete. Release the sticks to hover.';}}
    if(s.auto==='return'){yaw=0;const d=Math.hypot(s.x,s.z);ty=s.y<7.9?clamp((8-s.y)*2,0,2):0;tx=s.y<7.9?0:clamp(-s.x,-3,3);tz=s.y<7.9?0:clamp(-s.z,-3,3);if(d<.35&&s.y>=7.9){s.auto='land';s.event='Home reached. Descending to the pad.';}}
    if(s.auto==='land'){tx=tz=yaw=0;ty=-.65;}
    const rotation=yaw*.85*dt;s.yaw+=rotation;s.turn+=Math.abs(rotation);
    const ease=1-Math.exp(-3.2*dt);s.vx+=(tx-s.vx)*ease;s.vz+=(tz-s.vz)*ease;s.vy+=(ty-s.vy)*ease;
    if(wind&&!s.auto){s.vx+=Math.sin(s.time*.8)*dt*.3;s.vz+=Math.cos(s.time*.6)*dt*.25;}
    s.x+=s.vx*dt;s.z+=s.vz*dt;s.y+=s.vy*dt;
    if(s.y>30){s.y=30;s.vy=Math.min(0,s.vy);s.event='Training ceiling: 30 m. Practice closer to the ground.';}
    const dist=Math.hypot(s.x,s.z);if(dist>65){s.x*=65/dist;s.z*=65/dist;s.vx=s.vz=0;s.event='Training boundary reached. Turn back toward home.';}
    if(s.y<=0){const hard=s.vy< -1||Math.hypot(s.vx,s.vz)>1.2;const home=Math.hypot(s.x,s.z)<2.5;s.y=0;s.vx=s.vy=s.vz=0;s.airborne=false;s.auto=null;s.event=hard?'Hard landing. Try a slower descent and brake before touchdown.':home?'Smooth landing on the home pad. Nicely done.':'Landed in the field. Aim for the H pad next time.';}
  }
  const api={fresh,takeoff,update,clamp};if(typeof module!=='undefined')module.exports=api;else root.FlightPhysics=api;
})(typeof window!=='undefined'?window:this);

