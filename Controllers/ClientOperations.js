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
        console.log(keys);
        const AllData = await Promise.all(keys.map(async (HashName)=>{
            const dataStr = await client.HGETALL(HashName)
            const data = Object.keys(dataStr).map(datakey=>({[datakey]:JSON.parse(dataStr[datakey])}));
            return {[HashName]: data};
        }));
    
        return {success:true, message: "all users retrived", data: AllData};

    }catch(err){
        console.log(err);
        return {success:false, message:"bad request"};
    }
}

module.exports ={ AddClient, UpdateClient, RemoveClient, GetAllClients, GetClient};