const amqp = require("amqplib");

let channel;
const connectRabbitMq = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: "localhost",
            port: 5672,
            username: "guest",
            password: "guest"
        });

        channel = await connection.createChannel();
        console.log("Connected successfully to RabbitMQ");
    } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
    }
};
const publicToQueue=async(queueName,message)=>{
    if(!channel){
        return console.error("RabbitMQ is not initialized");
    }
    await channel.assertQueue(queueName,{durable:true});
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)),{
        persistent:true,
    });
}
const invalidateCacheJob=async(cacheKeys)=>{
    try {
        const message={
            action:"invalidateCache",
            key:cacheKeys
        };
        await publicToQueue("cache-invalidation", message);
        console.log("Cache invalidation job published to Rabbit");
    } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error); 
    }
}
// Call the function
module.exports={connectRabbitMq,publicToQueue,invalidateCacheJob};
