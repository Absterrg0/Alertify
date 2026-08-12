
import {z} from 'zod'




const websiteSchema = z.object({
    name:z.string().trim().min(2).max(60),
    url:z.url()
})


export default websiteSchema
