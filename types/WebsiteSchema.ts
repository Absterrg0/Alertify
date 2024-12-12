
import {z} from 'zod'




const websiteSchema = z.object({
    name:z.string().min(2),
    url:z.string()
})


export default websiteSchema