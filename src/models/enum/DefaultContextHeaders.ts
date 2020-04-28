export enum DefaultContextHeaders {
    
    // Server answer constant
    CONTEXTWELCOME = 0x00,
    GAMELIST = 0x01,
    UDPANSWER = 0x03,
    CREATEGAMERESPONSE = 0x04,
    WEBSOCKETCONNECT = 0x05,
    NEWMESSAGE = 0x0C,
    MAPINFO = 0x0D,
    
    // Client request constant
    CONTEXTREQEST = 0x00,
    GETGAMELIST = 0x01,
    SENDGAMEEXTERNALSIGNAL = 0x02,
    GETUDPGAE = 0x03,
    CREATEGAME = 0x04,
    GETWEBSOCKETCONNECT = 0x05,
    SENDMESSAGE = 0x0C,
    GETMAPINFO = 0x0D,

}