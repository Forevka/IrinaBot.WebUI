export enum GlobalContextHeaders {
    
    // Server answer constant
    GetErrorAnswer = 0x00,
    PongAnswer = 0x02,
    UserAuthAnswer = 0x03,
    BNetKeyAnswer = 0x04,
    IntegrationByTokenAnswer = 0x05,
    SetConnectorNameAnswer = 0x06,
    DeleteIntegrationAnswer = 0x07,
    
    // Client request constant
    SendErrorRequest = 0x00,
    PingRequest = 0x02,
    UserAuthRequest = 0x03,
    GetBnetKeyRequest = 0x04,
    AddIntegrationTokenRequest = 0x05,

}