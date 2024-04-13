const { AddClient, UpdateClient, RemoveClient, GetClient, GetAllClients } = require( "./ClientOperations")
const { AddOrder, UpdateOrder, RemoveOrder, GetOrder, GetAllOrders } = require( "./OrderOperations")


async function ClientOperations(RequestPacket){
    if(RequestPacket.TenantId === undefined || RequestPacket.OMSId === undefined || RequestPacket.ClientId === undefined){
        return {sucess: false, message: 'invalid packet for client'}
    }
    switch(RequestPacket.OperationType){
        case 100:
            return await AddClient(RequestPacket);
        case 101:
            return await UpdateClient(RequestPacket);
        case 102:
            return await RemoveClient(RequestPacket);
        case 103:
            return await GetClient(RequestPacket);
        case 104:
            return await GetAllClients();
        default:
            return {sucess: false, message:"invalid operaton"};


    }
}

async function OrderOperations(RequestPacket){
    if(RequestPacket.TenantId === undefined || RequestPacket.OMSId === undefined || RequestPacket.ClientId === undefined || RequestPacket.OrderId === undefined){
        return {sucess: false, message: 'invalid packet for Order'}
    }
    if(RequestPacket.OrderType !== 1 && RequestPacket.OrderType !== 2){
        return {status:false, message: "invalid order type"};
    }
    switch(RequestPacket.OperationType){
        case 100:
            return await AddOrder(RequestPacket);
        case 101:
            return await UpdateOrder(RequestPacket);
        case 102:
            return await RemoveOrder(RequestPacket);
        case 103:
            return await GetOrder(RequestPacket);
        case 104:
            return await GetAllOrders();
        default:
            return {status: false, message:"invalid operaton"};


    }
}

module.exports = {ClientOperations, OrderOperations};

