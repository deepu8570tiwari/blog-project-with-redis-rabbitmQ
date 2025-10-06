const ampq= require("amqplib");
const { postGreSql } = require("../configs/db");
const startCacheConsumner=async()=>{
    try {
         const connection = await amqp.connect({
            protocol: "amqp",
            hostname: "localhost",
            port: 5672,
            username: "guest",
            password: "guest"
        });
        const channel = await connection.createChannel();
        const queueName="cache-invalidation";
        await channel.assertQueue(queueName,{durable:true});
        console.log("✅ Blog sever started");
        channel.consume(queueName,async(msg)=>{
            if(msg){
                try {
                    const content=JSON.parse(msg.content.toString());
                    console.log("Blog service received cache Invalidation message",content);
                    if(content.action=="invalidateCache"){
                        for(const pattern of content.keys){
                            const keys=await redisClient.keys(pattern);
                            if(key.length>0){
                                await redisClient.del(key);
                                console.log(`Blog Service Invalidated ${keys.length} cache key matching: ${pattern}`)
                            }
                            const category=""
                            const search = "";
                            const cacheKey=`blog:${search}:${category}`
                            const blog =await postGreSql `select * from blogs order by created_at DESC`
                            await redisClient.set(cacheKey, JSON.stringify(blog), {EX:3600});
                            console.log("Cache rebuilt with key :",cacheKey)
                        }
                    }
                    channel.ack(msg);
                } catch (error) {
                    
                }
            }
        })
    } catch (error) {
        
    }
}