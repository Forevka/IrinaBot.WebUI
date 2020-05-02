export enum DefaultContextHeaders {
    
    // Server answer constant
    WelcomeAnswer = 0x00,
    GameListAnswer = 0x01,
    UdpAnswer = 0x03,
    CreateGameResponseAnswer = 0x04,
    WebsocketConnectAnswer = 0x05,
    NewMessageAnswer = 0x0C,
    MapInfoAnswer = 0x0D,
    
    // Client request constant
    ContextRequest = 0x00,
    GameListRequest = 0x01,
    SendExternalGameSignalRequest = 0x02,
    UpdGameRequest = 0x03,
    CreateGameRequest = 0x04,
    GetWebcoketConnectedRequest = 0x05,
    SendMessageRequest = 0x0C,
    MapInfoRequest = 0x0D,

}