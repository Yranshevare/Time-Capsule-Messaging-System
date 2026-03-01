import  jwt  from "jsonwebtoken";

// @ts-ignore
export default function verifyJwt(req,res,next){
    try {
        // console.log("kkk")
        // console.log(req.cookies)
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET! || "your-secret-key");
        req.user = decodedToken;
        next();
    } catch (error) {
        throw new Error("invalid access token")      
    }
}