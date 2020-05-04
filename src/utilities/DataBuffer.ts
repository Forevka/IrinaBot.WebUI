export default class DataBuffer {
    public length: number;
    private data: DataView;
    private offset: number;
    private isLittleIndian: boolean;

    constructor(rawBuffer: ArrayBuffer) {
        this.length = rawBuffer.byteLength;
        this.data = new DataView(rawBuffer);
        this.offset = 0;
        this.isLittleIndian = true;
    }

    public getUint8() {
        let resp = this.data.getUint8(this.offset);
        this.offset++;
        return resp;
    }

    public getInt8() {
        let resp = this.data.getInt8(this.offset);
        this.offset++;
        return resp;
    }


    public getInt16() {
        let resp = this.data.getInt16(this.offset, this.isLittleIndian);
        this.offset += 2;
        return resp;
    }

    public getUint16() {
        let resp = this.data.getUint16(this.offset, this.isLittleIndian);
        this.offset += 2;
        return resp;
    }

    public getInt32() {
        let resp = this.data.getInt32(this.offset, this.isLittleIndian);
        this.offset += 4;
        return resp;
    }

    public getUint32() {
        let resp = this.data.getUint32(this.offset, this.isLittleIndian);
        this.offset += 4;
        return resp;
    }

    public getNullTerminatedString() {
        let chars = new Array<number>();
        for (var i = 0;; ++i)
        {
            var newbyte = this.getUint8();
            if(newbyte == 0)
            {
                var stringResult = DataBuffer.stringFromUTF8Array(chars);
                
                if( stringResult == null || stringResult == undefined )
                    return "";
                
                return stringResult;
            }
            chars[chars.length] = newbyte;
        }
    }

    public getArray(size: number) {
        var array = new Array;
        for ( var i = 0; i < size; ++i )
        {
            array[array.length] = this.getUint8();
        }
        
        return array;
    }

    public static stringFromUTF8Array(data: Array<number>)
    {
        let extraByteMap = [ 1, 1, 1, 1, 2, 2, 3, 0 ];
        let count = data.length;
        let str = "";
    
        for (let index = 0; index < count;)
        {
            let ch = data[index++];
            if (ch & 0x80)
            {
                let extra = extraByteMap[(ch >> 3) & 0x07];
                if (!(ch & 0x40) || !extra || ((index + extra) > count))
                    return null;
                
                ch = ch & (0x3F >> extra);
                for (;extra > 0;extra -= 1)
                {
                    let chx = data[index++];
                    if ((chx & 0xC0) != 0x80)
                        return null;
                    
                    ch = (ch << 6) | (chx & 0x3F);
                }
            }
      
            str += String.fromCharCode(ch);
        }
    
        return str;
    }
}
