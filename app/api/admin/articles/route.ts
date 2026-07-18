import { NextResponse } from "next/server";
import { requireEditor } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { articleSchema } from "@/lib/validation";
import { createSlug } from "@/lib/utils";
export async function POST(request:Request){const {user}=await requireEditor();const json=await request.json();const parsed=articleSchema.safeParse({...json,slug:json.slug||createSlug(json.title),cover_url:json.cover_url||null});if(!parsed.success)return NextResponse.json({error:parsed.error.issues.map(i=>i.message).join("；")},{status:400});const supabase=await createClient();const payload={...parsed.data,author_id:user.id,published_at:parsed.data.status==="published"?new Date().toISOString():null};const {data,error}=await supabase.from("articles").insert(payload).select().single();if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json(data,{status:201})}
