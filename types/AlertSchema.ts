
import {z} from 'zod'


const alertSchema = z.object({
    title:z.string().min(4),
    description:z.string().min(10),
    type:z.enum(['ALERT','ALERT_DIALOG','TOAST']),
    style:z.enum(['NATIVE','GRADIENT','LOGO']),
    backgroundColor:z.string(),
    textColor:z.string(),
    borderColor:z.string(),
    imageURL:z.string().optional()
})




export default alertSchema