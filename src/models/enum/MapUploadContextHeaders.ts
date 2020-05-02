export enum MapUploaderContextHeaders {
    // Server answer constant
    ContextWelcomeAnswer = 0x00,
	MapPartOkAnswer = 0x01,
	MapSavedAnswer = 0x02,
		
	// Client request constant
	ContextRequest = 0x00,
	MapPartRequest = 0x01,
	MapSaveRequest = 0x02,
}