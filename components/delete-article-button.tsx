"use client";
export function DeleteArticleButton({id}:{id:string}){return <button className="btn btn-small btn-danger" onClick={async()=>{if(!confirm("确认删除这篇文章？"))return;const r=await fetch(`/api/admin/articles/${id}`,{method:"DELETE"});if(r.ok)location.reload();else alert("删除失败")}}>删除</button>}
