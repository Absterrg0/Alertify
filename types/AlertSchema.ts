
import {z} from 'zod'


const alertSchema = z.object({
    title:z.string().min(4),
    description:z.string().min(10),
    layoutId:z.string()
})



export default alertSchema