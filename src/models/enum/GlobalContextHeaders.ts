export enum GlobalContextHeaders {
    
    // Server answer constant
    GETERROR = 0x00,
    PONG = 0x02,
    USERAUTHRESPONSE = 0x03,
    BNETKEY = 0x04,
    INTEGRATIONBYTOKEN = 0x05,
    SETCONNECTORNAME = 0x06,
    DELETEINTEGRATION = 0x07,
    
    // Client request constant
    SENDERROR = 0x00,
    PING = 0x02,
    USERAUTH = 0x03,
    GETBNETKEY = 0x04,
    ADDINTEGRATIONBYTOKEN = 0x05,

}