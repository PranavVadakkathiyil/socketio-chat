import mongoose, {  model, models, Schema, Types } from "mongoose";
import bcrypt from 'bcrypt'
import jwt, { SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRTE = process.env.JWT_SECRTE
const JWT_ACCESS_EXPAIRE = process.env.JWT_ACCESS_EXPAIRE
const JWT_REFRESH_EXPAIRE = process.env.JWT_REFRESH_EXPAIRE

interface Iuser extends Document{
    _id:Types.ObjectId;
    username:string;
    phone:number;
    password:string;
    avatar:string;
    Isadmin:boolean;
    refreshToken:string;

}
const userSchema = new Schema<Iuser>({
    username:{type:String,required:true},
    phone:{type:Number,unique:true,required:true},
    password:{type:String,required:true},
    avatar:{type:String,required:true,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    Isadmin:{type:Boolean,required:true,default:false},
    refreshToken:{type:String},

},{timestamps:true})


userSchema.pre("save",async function (next)  {
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
})
userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.AccessToken = function(this: Iuser) {
    if(!JWT_SECRTE){
        throw Error("JWT_SECRTE not fetched");
    }
    return (
        jwt.sign(
            {
                _id: this._id,
                username: this.username
            },
            JWT_SECRTE,
            { expiresIn: JWT_ACCESS_EXPAIRE } as SignOptions
        )
    );
}
userSchema.methods.RefreshToken = function(this: Iuser) {
    if(!JWT_SECRTE){
        throw Error("JWT_SECRTE not fetched");
    }
    return (
        jwt.sign(
            {
                _id: this._id,
                
            },
            JWT_SECRTE,
            { expiresIn: JWT_REFRESH_EXPAIRE } as SignOptions
        )
    );
}


const User = models?.User || model<Iuser>("User",userSchema)

export default User