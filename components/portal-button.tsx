"use client";
export function PortalButton(){return <button className="btn" onClick={async()=>{const r=await fetch("/api/stripe/portal",{method:"POST"});const j=await r.json();if(j.url)location.href=j.url;else alert(j.error??"无法打开会员管理")}}>管理订阅</button>}
