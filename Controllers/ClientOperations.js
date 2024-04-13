const client = require('../RedisClient')

async function AddClient(RequestPacket){
    const HashName = `${RequestPacket.TenantId}_${RequestPacket.OMSId}`
    try{

        const res = await client.hGet(HashName, `${RequestPacket.ClientId}`)
        if(res !== null){
            return {success: false, message: "Client id already exists"};
        }
        await client.HSET(HashName, {[RequestPacket.ClientId]: JSON.stringify(RequestPacket)});
        
        return {success: true, message: "User added successfully"};
    }
    catch(err){
        console.log(err);
        return {success:false, message:"bad request"};
    }
}

async function UpdateClient(RequestPacket){
    const HashName = `${RequestPacket.TenantId}_${RequestPacket.OMSId}`
    try{
        const res = await client.hGet(HashName, `${RequestPacket.ClientId}`)    
        if(res === null){
            return {success: false, message: "client does not exists"};
        }
        await client.HSET(HashName, {[RequestPacket.ClientId]: JSON.stringify(RequestPacket)});
        return {success: true, message: "User updated successfully"};

    }catch(err){
        console.log(err);
        return {success: false, message:"bad request"};
    }
}

async function RemoveClient(RequestPacket){
    const HashName = `${RequestPacket.TenantId}_${RequestPacket.OMSId}`
    try{
        const res = await client.hGet(HashName, `${RequestPacket.ClientId}`)    
        if(res === null){
            return {success: false, message: "client does not exists"};
        }
        await client.HDEL(HashName, `${RequestPacket.ClientId}`);
        return {success: true, message: "User deleted successfully"};
    }catch(err){
        console.log(err);
        return {success:false, message:"bad request"};
    }
}

async function GetClient(RequestPacket){
    const HashName = `${RequestPacket.TenantId}_${RequestPacket.OMSId}`
    try{
        const res = await client.hGet(HashName, `${RequestPacket.ClientId}`)
        if(res === null){
            return {success: false, message: "client does not exists"};
        }
        return {success: true, message: "User retrived successfully", data:JSON.parse(res)};
    }catch(err){
        console.log(err);
        return {success:false, message:"bad request"};
    }
}

async function GetAllClients(){
    try{

        const {keys} = await client.SCAN(0, {MATCH:'*_*'});
        
        const filterdKeys = keys.filter(key=>key.match(/^[0-9]+_[0-9]+$/))
        console.log(filterdKeys)
        const AllData = await Promise.all(filterdKeys.map(async (HashName)=>{
            const dataStr = await client.HGETALL(HashName)
            const data = Object.keys(dataStr).filter(datakey=>JSON.parse(dataStr[datakey]).MsgType===1121)
            .map(datakey=>(JSON.parse(dataStr[datakey])));
            return {[HashName]:data};
        }));
    
        return {success:true, message: "all users retrived", data: AllData.filter(item=>Object.keys(item))};

    }catch(err){
        console.log(err);
        return {success:false, message:"bad request"};
    }
}

module.exports ={ AddClient, UpdateClient, RemoveClient, GetAllClients, GetClient};