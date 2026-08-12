
import {z} from 'zod'



const userSchema = z.object({
    email:z.email(),
    name:z.string().trim().min(2).max(80)
})


export default userSchema
