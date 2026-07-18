import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { createAdminClient } from "@/lib/supabase/admin";
export async function POST(){const {user}=await getViewer();if(!user)return NextResponse.json({error:"请先登录"},{status:401});const {data}=await createAdminClient().from("memberships").select("stripe_customer_id").eq("user_id",user.id).maybeSingle();if(!data?.stripe_customer_id)return NextResponse.json({error:"未找到Stripe客户"},{status:404});const session=await stripe.billingPortal.sessions.create({customer:data.stripe_customer_id,return_url:absoluteUrl("/account")});return NextResponse.json({url:session.url})}
