
import {z} from 'zod'



const userSchema = z.object({
    email:z.string().email(),
    name:z.string().min(2)
})


export default userSchema