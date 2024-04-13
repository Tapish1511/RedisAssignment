const client = require('../RedisClient');

async function AddOrder(RequestPacket){
    const HashNameClient = `${RequestPacket.TenantId}_${RequestPacket.OMSId}`
    const HashNameOrder = `${RequestPacket.TenantId}_${RequestPacket.OMSId}_${RequestPacket.ClientId}_${RequestPacket.Token}`
    try{

        const resClient = await client.hGet(HashNameClient, `${RequestPacket.ClientId}`)
        if(resClient === null){
            return {success:false, message:"Client does not exists"};
        }
        const resOrder = await client.hGet(HashNameOrder, `${RequestPacket.OrderId}`)
        if(resOrder !== null){
            return {success:false, message:"Order already exists"};
        }
        await client.hSet(HashNameOrder, RequestPacket.OrderId, JSON.stringify(RequestPacket));
        return {success: true, message:"Order placed successfully"};
        
    }
    catch(err){
        console.log(err);
        return {success:false, message:'bad request'}
    }

}

async function UpdateOrder(RequestPacket){
    const HashNameClient = `${RequestPacket.TenantId}_${RequestPacket.OMSId}`
    const HashNameOrder = `${RequestPacket.TenantId}_${RequestPacket.OMSId}_${RequestPacket.ClientId}_${RequestPacket.Token}`
    try{

        const resClient = await client.hGet(HashNameClient, `${RequestPacket.ClientId}`)
        if(resClient === null){
            return {success:false, message:"Client does not exists"};
        }
        const resOrder = await client.hGet(HashNameOrder, `${RequestPacket.OrderId}`)
        if(resOrder === null){
            return {success:false, message:"Order does not exists"};
        }
        await client.hSet(HashNameOrder, RequestPacket.OrderId, JSON.stringify(RequestPacket));
        return {success: true, message:"Order updated successfully"};
        
    }
    catch(err){
        console.log(err);
        return {success:false, message:'bad request'}
    }
}

async function RemoveOrder(RequestPacket){
    const HashNameClient = `${RequestPacket.TenantId}_${RequestPacket.OMSId}`
    const HashNameOrder = `${RequestPacket.TenantId}_${RequestPacket.OMSId}_${RequestPacket.ClientId}_${RequestPacket.Token}`
    try{

        const resClient = await client.hGet(HashNameClient, `${RequestPacket.ClientId}`)
        if(resClient === null){
            return {success:false, message:"Client does not exists"};
        }
        const resOrder = await client.hGet(HashNameOrder, `${RequestPacket.OrderId}`)
        if(resOrder === null){
            return {success:false, message:"Order does not exists"};
        }
        await client.hDel(HashNameOrder, `${RequestPacket.OrderId}`);
        return {success: true, message:"Order updated successfully"};
        
    }
    catch(err){
        console.log(err);
        return {success:false, message:'bad request'}
    }
}

async function GetOrder(RequestPacket){
    const HashNameClient = `${RequestPacket.TenantId}_${RequestPacket.OMSId}`
    const HashNameOrder = `${RequestPacket.TenantId}_${RequestPacket.OMSId}_${RequestPacket.ClientId}_${RequestPacket.Token}`
    try{

        const resClient = await client.hGet(HashNameClient, `${RequestPacket.ClientId}`)
        if(resClient === null){
            return {success:false, message:"Client does not exists"};
        }
        const resOrder = await client.hGet(HashNameOrder, `${RequestPacket.OrderId}`)
        if(resOrder === null){
            return {success:false, message:"Order does not exists"};
        }
        return {success: true, message:"Order updated successfully", data:JSON.parse(resOrder)};
        
    }
    catch(err){
        console.log(err);
        return {success:false, message:'bad request'}
    }
}

async function GetAllOrders(){
    try{
        const {keys} = await client.SCAN(0, {MATCH:'*_*_*_*'});
        const filterdKeys = keys.filter(key=>key.match(/^[0-9]+_[0-9]+_[0-9]+_[0-9]+$/))
        //console.log(keys)
        const AllData = await Promise.all(keys.map(async(hashName)=>{
            const dataStr = await client.hGetAll(hashName);
            //console.log(dataStr)
            const data = Object.keys(dataStr).map(dataKey=>({[dataKey]:JSON.parse(dataStr[dataKey])}));
            return {[hashName]:data};
        }))
        return {success:true, message:"All orders retrived", data:AllData};

    }catch(err){
        console.log(err);
        return {success:false, message:'bad request'};
    }
}

module.exports = {AddOrder, UpdateOrder, RemoveOrder, GetOrder, GetAllOrders};