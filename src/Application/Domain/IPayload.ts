export type IPayloadTypes = number|string|boolean|null|undefined|BigInt;
export type IPayloadBasicTypes = IPayloadTypes|IPayloadTypes[];
export type IPayloadObject = {
    [attr: string|number]: IPayloadBasicTypes|IPayloadObject
};
export type ISerializablePayload = IPayloadObject|IPayloadBasicTypes;
export type IPayload = {
    [attr: string|number]: any;
};
export default IPayload;