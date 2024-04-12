const { AddClient, UpdateClient, RemoveClient, GetClient, GetAllClients } = require( "./ClientOperations")
const { AddOrder, UpdateOrder, RemoveOrder, GetOrder, GetAllOrders } = require( "./OrderOperations")


async function ClientOperations(RequestPacket){
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
            return {status: false, message:"invalid operaton"};


    }
}

async function OrderOperations(RequestPacket){
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

