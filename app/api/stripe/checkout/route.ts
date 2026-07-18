import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth";
import { stripe, priceIdForPlan } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { createAdminClient } from "@/lib/supabase/admin";
export async function POST(request:Request){const {user}=await getViewer();if(!user)return NextResponse.json({login:"/login?next=/membership"},{status:401});const body=await request.json();if(!["regional","global"].includes(body.plan))return NextResponse.json({error:"无效计划"},{status:400});const admin=createAdminClient();const {data:existing}=await admin.from("memberships").select("stripe_customer_id").eq("user_id",user.id).maybeSingle();const session=await stripe.checkout.sessions.create({mode:"subscription",customer:existing?.stripe_customer_id??undefined,customer_email:existing?.stripe_customer_id?undefined:user.email??undefined,line_items:[{price:priceIdForPlan(body.plan),quantity:1}],success_url:absoluteUrl("/account?checkout=success"),cancel_url:absoluteUrl("/membership?checkout=cancelled"),metadata:{user_id:user.id,plan:body.plan}});return NextResponse.json({url:session.url})}
