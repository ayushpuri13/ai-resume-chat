

export async function POST(req:Request){
const body = await req?.json();
    const question = body.question;
    console.log(question);

return Response.json({success:true})
} 